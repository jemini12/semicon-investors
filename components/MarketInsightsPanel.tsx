"use client";

import { useEffect, useState } from "react";
import { streamMacroAnalysis, streamSemiconductorAnalysis, streamHighlightAnalysis } from "@/app/actions/generateMarketInsights";

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
    const [macroText, setMacroText] = useState("");
    const [semiText, setSemiText] = useState("");
    const [highlightText, setHighlightText] = useState("");

    const [macroLoading, setMacroLoading] = useState(true);
    const [semiLoading, setSemiLoading] = useState(true);
    const [highlightLoading, setHighlightLoading] = useState(true);

    const [isExpanded, setIsExpanded] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Stream macro analysis
    useEffect(() => {
        const fetchMacro = async () => {
            try {
                setMacroLoading(true);
                const stream = await streamMacroAnalysis();
                const reader = stream.getReader();
                const decoder = new TextDecoder();

                let text = '';
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    text += decoder.decode(value);
                    setMacroText(text);
                }
            } catch (e) {
                console.error('Failed to stream macro analysis:', e);
                setError('거시경제 분석을 생성할 수 없습니다.');
            } finally {
                setMacroLoading(false);
            }
        };
        fetchMacro();
    }, []);

    // Stream semiconductor analysis
    useEffect(() => {
        const fetchSemi = async () => {
            try {
                setSemiLoading(true);
                const stream = await streamSemiconductorAnalysis();
                const reader = stream.getReader();
                const decoder = new TextDecoder();

                let text = '';
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    text += decoder.decode(value);
                    setSemiText(text);
                }
            } catch (e) {
                console.error('Failed to stream semiconductor analysis:', e);
                setError('반도체 분석을 생성할 수 없습니다.');
            } finally {
                setSemiLoading(false);
            }
        };
        fetchSemi();
    }, []);

    // Stream highlight analysis
    useEffect(() => {
        const fetchHighlight = async () => {
            try {
                setHighlightLoading(true);
                const stream = await streamHighlightAnalysis();
                const reader = stream.getReader();
                const decoder = new TextDecoder();

                let text = '';
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    text += decoder.decode(value);
                    setHighlightText(text);
                }
            } catch (e) {
                console.error('Failed to stream highlight analysis:', e);
                setError('주목 종목 분석을 생성할 수 없습니다.');
            } finally {
                setHighlightLoading(false);
            }
        };
        fetchHighlight();
    }, []);

    // Auto-expand when first section is ready
    useEffect(() => {
        if (!macroLoading && macroText) {
            setIsExpanded(true);
        }
    }, [macroLoading, macroText]);

    const anyLoading = macroLoading || semiLoading || highlightLoading;
    const hasContent = macroText || semiText || highlightText;

    if (error) {
        return (
            <div className="w-full p-6 bg-red-500/10 border border-red-500/20 backdrop-blur-sm rounded">
                <p className="text-red-400 text-sm">{error}</p>
            </div>
        );
    }

    return (
        <div className="w-full bg-portal-gray/30 border border-white/5 backdrop-blur-sm">
            {/* Collapsible Header */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full p-6 flex items-center justify-between hover:bg-white/5 transition-colors border-b border-white/10"
            >
                <div className="flex items-center space-x-3">
                    <h3 className="text-xl font-bold text-white tracking-widest uppercase">Market Analysis</h3>
                    {anyLoading && (
                        <div className="flex items-center space-x-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-portal-accent border-t-transparent"></div>
                            <span className="text-xs text-slate-400">AI 분석 중...</span>
                        </div>
                    )}
                    {!anyLoading && hasContent && (
                        <span className="text-xs text-green-400">✓ 준비 완료</span>
                    )}
                </div>
                <div className="flex items-center space-x-2">
                    <span className="text-xs text-slate-400">
                        {isExpanded ? '접기' : '펼치기'}
                    </span>
                    <svg
                        className={`w-5 h-5 text-white transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </button>

            {/* Expandable Content */}
            {isExpanded && (
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Macro Analysis */}
                        <div className="bg-gradient-to-br from-portal-black/80 to-portal-black/50 p-8 border border-white/10 hover:border-portal-accent/40 transition-all backdrop-blur-sm">
                            <h3 className="text-base font-bold text-portal-accent mb-5 flex items-center pb-3 border-b border-portal-accent/20">
                                <span className="mr-2 text-xl">🌍</span>
                                Macro Environment
                            </h3>
                            {macroLoading && !macroText ? (
                                <div className="space-y-3 animate-pulse">
                                    <div className="h-3 bg-white/5 rounded"></div>
                                    <div className="h-3 bg-white/5 rounded"></div>
                                    <div className="h-3 bg-white/5 rounded w-5/6"></div>
                                </div>
                            ) : (
                                <div className="text-base text-slate-200 leading-relaxed font-normal">
                                    {formatAnalysisText(macroText)}
                                </div>
                            )}
                        </div>

                        {/* Top Companies */}
                        <div className="bg-gradient-to-br from-portal-black/80 to-portal-black/50 p-8 border border-white/10 hover:border-yellow-400/40 transition-all backdrop-blur-sm">
                            <h3 className="text-base font-bold text-yellow-400 mb-5 flex items-center pb-3 border-b border-yellow-400/20">
                                <span className="mr-2 text-xl">⭐</span>
                                Highlight
                            </h3>
                            {highlightLoading && !highlightText ? (
                                <div className="space-y-3 animate-pulse">
                                    <div className="h-3 bg-white/5 rounded"></div>
                                    <div className="h-3 bg-white/5 rounded"></div>
                                    <div className="h-3 bg-white/5 rounded w-5/6"></div>
                                </div>
                            ) : (
                                <div className="text-base text-slate-200 leading-relaxed font-normal whitespace-pre-line">
                                    {formatAnalysisText(highlightText)}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
