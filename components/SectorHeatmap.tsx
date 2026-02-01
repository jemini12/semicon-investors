"use client";

import { useMemo, useEffect, useState } from "react";
import { SECTOR_DATA } from "@/lib/ticker-data";
import { MarketItem } from "@/lib/constants";
import { getMarketData } from "@/app/actions/getMarketData";

export default function SectorHeatmap() {
    const [data, setData] = useState<{ [symbol: string]: { price: number; change: number; marketCap: number } }>({});

    useEffect(() => {
        const fetchData = async () => {
            const realData = await getMarketData();
            if (realData) setData(realData);
        };
        fetchData();
        const interval = setInterval(fetchData, 10000);
        return () => clearInterval(interval);
    }, []);

    // Group by sector
    const sectors = useMemo(() => {
        const groups: { [key: string]: MarketItem[] } = {};
        SECTOR_DATA.forEach(item => {
            if (item.sector === 'Index') return;
            if (!groups[item.sector]) groups[item.sector] = [];
            groups[item.sector].push(item);
        });
        return groups;
    }, []);

    return (
        <div className="w-full p-8 bg-portal-gray/30 border border-white/5 backdrop-blur-sm">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center tracking-tight">
                <span className="w-1 h-6 bg-portal-accent mr-3"></span>
                Sector Heatmap
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(sectors).map(([sector, items]) => (
                    <div key={sector} className="flex flex-col space-y-3">
                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest pl-1">{sector}</h3>
                        <div className="flex flex-col space-y-2">
                            {items.map(item => {
                                const change = data[item.symbol]?.change || 0;
                                const isNeutral = Math.abs(change) < 0.01;

                                return (
                                    <div
                                        key={item.symbol}
                                        className={`
                      relative overflow-hidden py-4 px-6 transition-all hover:bg-white/5 cursor-pointer group border-l-4
                      ${isNeutral ? 'border-gray-500 bg-gray-500/5' : change > 0 ? 'border-green-500 bg-green-500/5' : 'border-red-500 bg-red-500/5'}
                    `}
                                    >
                                        <a
                                            href={`https://finance.yahoo.com/quote/${item.symbol}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex justify-between items-start relative z-10 w-full h-full"
                                        >
                                            <div className="flex justify-between items-start w-full">
                                                <span className="font-bold text-white tracking-wide">{item.symbol}</span>
                                                <span className={`text-xs font-mono px-1.5 py-0.5 ${isNeutral ? 'text-gray-400' : change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                    {change > 0 && !isNeutral ? '+' : ''}{change.toFixed(2)}%
                                                </span>
                                            </div>
                                        </a>
                                        <div className="text-xs text-slate-400 mt-1 truncate relative z-10 font-medium">
                                            {item.type === 'KRX' ? item.koName : item.name}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
