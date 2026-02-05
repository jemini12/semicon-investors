"use client";

import { useEffect, useState } from 'react';
import MacroView from '@/components/MacroView';
import MarketInsightsPanel from '@/components/MarketInsightsPanel';
import { getMarketQuotes, getSparklines } from '@/app/actions/getMarketData';

// Define the type here to match the action return type
type MarketData = {
    [symbol: string]: {
        price: number;
        change: number;
        marketCap: number;
        sparkline: number[]
    }
};

export default function Home() {
    const [marketData, setMarketData] = useState<MarketData | null>(null);
    const [isLoadingMarket, setIsLoadingMarket] = useState(true);
    const [showMarketInsights, setShowMarketInsights] = useState(false);

    // Progressive loading strategy
    useEffect(() => {
        const loadData = async () => {
            const startTime = performance.now();

            // 1. FAST: Get quotes immediately
            try {
                console.log('[Client] 🚀 Fetching fast quotes...');
                if (!marketData) setIsLoadingMarket(true);

                const quotes = await getMarketQuotes();
                if (quotes) {
                    setMarketData(prev => ({ ...(prev || {}), ...quotes }));
                    setIsLoadingMarket(false); // Stop spinner immediately!
                    console.log(`[Client] ✅ Quotes loaded in ${(performance.now() - startTime).toFixed(0)}ms`);
                }
            } catch (e) {
                console.error('Failed to load quotes:', e);
                setIsLoadingMarket(false);
            }

            // 2. SLOW: Get sparklines in background
            try {
                console.log('[Client] 📉 Fetching background sparklines...');
                const sparklines = await getSparklines();

                if (sparklines) {
                    setMarketData(prev => {
                        if (!prev) return sparklines;
                        // Deep merge only sparklines
                        const merged = { ...prev };
                        Object.keys(sparklines).forEach(key => {
                            if (merged[key]) {
                                merged[key] = { ...merged[key], sparkline: sparklines[key].sparkline };
                            }
                        });
                        return merged;
                    });
                    console.log(`[Client] ✅ Sparklines loaded in ${(performance.now() - startTime).toFixed(0)}ms`);
                }
            } catch (e) {
                console.error('Failed to load sparklines:', e);
            }
        };

        // Initial load
        loadData();

        // Poll only quotes frequently (every 10s)
        const interval = setInterval(async () => {
            const quotes = await getMarketQuotes();
            if (quotes) {
                setMarketData(prev => {
                    const merged = { ...(prev || {}) };
                    Object.keys(quotes).forEach(key => {
                        if (merged[key]) {
                            // Preserve existing sparklines while updating price
                            merged[key] = {
                                ...quotes[key],
                                sparkline: merged[key].sparkline
                            };
                        } else {
                            merged[key] = quotes[key];
                        }
                    });
                    return merged;
                });
            }
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (!isLoadingMarket && marketData) {
            setShowMarketInsights(true);
        }
    }, [isLoadingMarket, marketData]);

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

                {/* Macro Overview - Uses shared market data */}
                <section>
                    <MacroView data={marketData} isLoading={isLoadingMarket} />
                </section>

                {/* AI-Powered Market Analysis - Independent from market data */}
                {showMarketInsights ? (
                    <section>
                        <MarketInsightsPanel />
                    </section>
                ) : null}
            </div>
        </main>
    );
}
