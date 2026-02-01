"use client";

import { Area, AreaChart, ResponsiveContainer, YAxis } from "recharts";

interface SparklineProps {
    data: number[];
    isPositive: boolean;
    isUnderlay?: boolean;
}

export default function Sparkline({ data, isPositive, isUnderlay = false }: SparklineProps) {
    if (!data || data.length === 0) return null;

    const chartData = data.map((val, i) => ({ value: val }));
    const color = isPositive ? "#22c55e" : "#ef4444";

    return (
        <div className={isUnderlay
            ? "absolute inset-0 w-full h-full opacity-20 pointer-events-none select-none z-0"
            : "w-20 h-8 md:w-24 overflow-hidden pointer-events-none"}>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                    <defs>
                        <linearGradient id={`gradient-${isPositive}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                            <stop offset="95%" stopColor={color} stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <YAxis domain={['auto', 'auto']} hide />
                    <Area
                        type="monotone"
                        dataKey="value"
                        stroke={color}
                        strokeWidth={isUnderlay ? 1 : 2}
                        fill={isUnderlay ? `url(#gradient-${isPositive})` : "transparent"}
                        dot={false}
                        isAnimationActive={false}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}

