"use client";

import { useEffect, useState } from "react";
import { SECTOR_DATA } from "@/lib/ticker-data";

import { getMarketData } from "@/app/actions/getMarketData";
import LoadingSpinner from "./LoadingSpinner";



export default function MacroView() {

    const [data, setData] = useState<{ [symbol: string]: { price: number; change: number; marketCap: number } }>({});

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

    const macroItems = SECTOR_DATA.filter(item => item.sector === 'Macro');

    return (
        <div className="w-full bg-portal-gray/30 border border-white/5 backdrop-blur-sm p-6">
            <div className="flex items-center space-x-3 mb-6 border-b border-white/10 pb-4">
                <h3 className="text-xl font-bold text-white tracking-widest uppercase">Macro Environment</h3>
            </div>
            {isLoading ? (
                <LoadingSpinner />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {macroItems
                        .sort((a, b) => {
                            const changeA = data[a.symbol]?.change || 0;
                            const changeB = data[b.symbol]?.change || 0;
                            return changeB - changeA;
                        })
                        .map(item => {
                            const price = data[item.symbol]?.price || item.basePrice;
                            const change = data[item.symbol]?.change || 0;
                            const isNeutral = Math.abs(change) < 0.01;
                            const isPositive = change >= 0 && !isNeutral;

                            return (
                                <div key={item.symbol} className="flex items-center justify-between p-3 bg-portal-black/40 border border-white/5 hover:border-portal-accent/30 hover:bg-white/5 transition-colors group">
                                    {/* Name & Symbol (Linked) */}
                                    <a
                                        href={`https://finance.yahoo.com/quote/${item.symbol}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex flex-col w-auto shrink-0 hover:text-portal-accent transition-colors overflow-hidden"
                                    >
                                        <span className="font-bold text-slate-200 text-sm truncate group-hover:text-portal-accent" title={item.name}>{item.name}</span>
                                        <span className="text-[10px] text-slate-500 font-mono group-hover:text-portal-accent/70">{item.symbol}</span>
                                    </a>

                                    {/* Price & Change */}
                                    <div className="flex flex-col items-end w-28 shrink-0 ml-2">
                                        <span className="font-mono text-white font-medium text-sm">
                                            {item.currency === 'PTS' ? price.toFixed(2) : new Intl.NumberFormat('en-US', { style: 'currency', currency: item.currency }).format(price)}
                                        </span>
                                        <div className={`text-xs font-mono font-bold flex items-center ${isNeutral ? 'text-slate-500' : isPositive ? 'text-green-500' : 'text-red-500'}`}>
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
