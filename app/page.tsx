"use client";

import { useEffect, useState } from 'react';
import SemiconductorSectorView from '@/components/SemiconductorSectorView';
import MacroView from '@/components/MacroView';
import MarketInsightsPanel from '@/components/MarketInsightsPanel';
import { getMarketData } from '@/app/actions/getMarketData';

export default function Home() {
    const [marketData, setMarketData] = useState<{ [symbol: string]: { price: number; change: number; marketCap: number; sparkline: number[] } } | null>(null);
    const [isLoadingMarket, setIsLoadingMarket] = useState(true);

    // Fetch market data once at page level
    useEffect(() => {
        const fetchData = async (isInitial = false) => {
            try {
                if (isInitial) setIsLoadingMarket(true);
                const data = await getMarketData();
                if (data) setMarketData(data);
            } catch (e) {
                console.error('Failed to fetch market data:', e);
            } finally {
                if (isInitial) setIsLoadingMarket(false);
            }
        };

        fetchData(true); // Initial load
        const interval = setInterval(() => fetchData(false), 10000); // Poll every 10s
        return () => clearInterval(interval);
    }, []);

    return (
        <main className="min-h-screen bg-portal-black text-white p-4 md:p-8 font-sans">
            <div className="max-w-7xl mx-auto space-y-12">

                {/* Header Section */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/10 pb-6">
                    <div>
                        <h1 className="text-2xl md:text-4xl font-black tracking-tighter uppercase text-white leading-tight mb-4">
                            Semicon<br />
                            <span className="text-portal-accent text-stroke">Investors</span>
                        </h1>
                    </div>
                </header>

                {/* AI-Powered Market Analysis - Independent from market data */}
                <section>
                    <MarketInsightsPanel />
                </section>

                {/* Main Sector View - Uses shared market data */}
                <SemiconductorSectorView data={marketData} isLoading={isLoadingMarket} />

                {/* Macro Overview - Uses shared market data */}
                <section>
                    <MacroView data={marketData} isLoading={isLoadingMarket} />
                </section>

            </div>
        </main>
    );
}
