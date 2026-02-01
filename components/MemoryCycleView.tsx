"use client";

import { useEffect, useState } from "react";
import { SECTOR_DATA } from "@/lib/ticker-data";

import { getMarketData } from "@/app/actions/getMarketData";
import LoadingSpinner from "./LoadingSpinner";
import Sparkline from "./Sparkline";

export default function MemoryCycleView() {

    const [data, setData] = useState<{ [symbol: string]: { price: number; change: number; sparkline: number[] } }>({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const realData = await getMarketData();
                if (realData) setData(realData);
            } catch (e) {
                console.error(e);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
        const interval = setInterval(fetchData, 10000);
        return () => clearInterval(interval);
    }, []);

    const memoryPeers = SECTOR_DATA.filter(item => item.sector === 'Memory');

    return (
        <div className="w-full p-6 bg-portal-gray/30 border border-white/5 backdrop-blur-sm">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center tracking-tight">
                <span className="w-1 h-6 bg-portal-accent mr-3"></span>
                Memory Cycle Monitor
            </h2>

            {isLoading ? (
                <LoadingSpinner />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {memoryPeers.map(item => {
                        const price = data[item.symbol]?.price || item.basePrice;
                        const change = data[item.symbol]?.change || 0;
                        const isNeutral = Math.abs(change) < 0.01;
                        const isPositive = change >= 0 && !isNeutral;

                        return (
                            <div key={item.symbol} className="relative bg-portal-black/50 py-8 px-6 border-t-2 border-white/10 hover:border-portal-accent transition-colors overflow-hidden group">
                                {/* Sparkline Underlay */}
                                <Sparkline data={data[item.symbol]?.sparkline || []} isPositive={isPositive} isUnderlay={true} />

                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="text-sm font-bold text-slate-400 group-hover:text-portal-accent transition-colors">{item.type === 'KRX' ? item.koName : item.name}</span>
                                        <span className="text-xs font-mono text-orange-500/60">{item.symbol}</span>
                                    </div>

                                    <div className="flex items-baseline space-x-2">
                                        <span className="text-4xl font-mono font-black text-white">
                                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: item.currency, maximumFractionDigits: item.currency === 'KRW' ? 0 : 2 }).format(price)}
                                        </span>
                                    </div>

                                    <div className={`flex items-center mt-3 text-base font-mono font-bold ${isNeutral ? 'text-slate-500' : isPositive ? 'text-green-500' : 'text-red-500'}`}>
                                        {isNeutral ? '' : isPositive ? '+' : ''}
                                        {Math.abs(change).toFixed(2)}%
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    );
}
