"use client";

import { useEffect, useState } from "react";
import { generateMarketInsights, MarketInsights } from "@/app/actions/generateMarketInsights";

// Helper function to enhance text with better spacing
function formatAnalysisText(text: string) {
    // Split by sentences for better spacing
    const sentences = text.split(/(?<=[.!?])\s+/);

    return sentences.map((sentence, index) => (
        <span key={index} className="block mb-3 last:mb-0">
            {sentence}
        </span>
    ));
}

export default function MarketInsightsPanel() {
    const [insights, setInsights] = useState<MarketInsights | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchInsights = async () => {
            try {
                setIsLoading(true);
                const data = await generateMarketInsights();
                setInsights(data);
                setError(null);
            } catch (e) {
                console.error('Failed to generate insights:', e);
                setError('시장 인사이트를 생성할 수 없습니다.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchInsights();
    }, []);

    if (error) {
        return (
            <div className="w-full p-6 bg-red-500/10 border border-red-500/20 backdrop-blur-sm rounded">
                <p className="text-red-400 text-sm">{error}</p>
            </div>
        );
    }

    return (
        <div className="w-full p-6 bg-portal-gray/30 border border-white/5 backdrop-blur-sm">
            <div className="flex items-center space-x-3 mb-6 border-b border-white/10 pb-4">
                <h3 className="text-xl font-bold text-white tracking-widest uppercase">Market Analysis</h3>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="bg-portal-black/50 p-6 border border-white/5 animate-pulse">
                            <div className="h-4 bg-white/10 rounded w-3/4 mb-4"></div>
                            <div className="space-y-3">
                                <div className="h-3 bg-white/5 rounded"></div>
                                <div className="h-3 bg-white/5 rounded"></div>
                                <div className="h-3 bg-white/5 rounded w-5/6"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : insights ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Macro Analysis */}
                    <div className="bg-gradient-to-br from-portal-black/80 to-portal-black/50 p-8 border border-white/10 hover:border-portal-accent/40 transition-all backdrop-blur-sm">
                        <h3 className="text-base font-bold text-portal-accent mb-5 flex items-center pb-3 border-b border-portal-accent/20">
                            <span className="mr-2 text-xl">🌍</span>
                            거시경제 환경
                        </h3>
                        <div className="text-base text-slate-200 leading-relaxed font-normal">
                            {formatAnalysisText(insights.macroAnalysis)}
                        </div>
                    </div>

                    {/* Semiconductor Analysis */}
                    <div className="bg-gradient-to-br from-portal-black/80 to-portal-black/50 p-8 border border-white/10 hover:border-green-400/40 transition-all backdrop-blur-sm">
                        <h3 className="text-base font-bold text-green-400 mb-5 flex items-center pb-3 border-b border-green-400/20">
                            <span className="mr-2 text-xl">💾</span>
                            반도체 섹터
                        </h3>
                        <div className="text-base text-slate-200 leading-relaxed font-normal">
                            {formatAnalysisText(insights.semiconductorAnalysis)}
                        </div>
                    </div>

                    {/* Top Companies */}
                    <div className="bg-gradient-to-br from-portal-black/80 to-portal-black/50 p-8 border border-white/10 hover:border-yellow-400/40 transition-all backdrop-blur-sm">
                        <h3 className="text-base font-bold text-yellow-400 mb-5 flex items-center pb-3 border-b border-yellow-400/20">
                            <span className="mr-2 text-xl">⭐</span>
                            주목할 종목
                        </h3>
                        <div className="text-base text-slate-200 leading-relaxed font-normal whitespace-pre-line">
                            {formatAnalysisText(insights.topCompanies)}
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
}
