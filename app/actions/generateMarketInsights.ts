'use server';

import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { unstable_cache } from 'next/cache';
import { getMarketData } from './getMarketData';
import { SECTOR_DATA } from '@/lib/ticker-data';

export interface MarketInsights {
    macroAnalysis: string;
    semiconductorAnalysis: string;
    topCompanies: string;
    generatedAt: string;
}

const webSearchTool = {
    web_search: openai.tools.webSearch({
        externalWebAccess: true,
        searchContextSize: 'high',
    }),
};

const webSearchToolChoice = { type: 'tool', toolName: 'web_search' } as const;

// Helper to get current hour for cache key
function getCurrentHourKey(): string {
    return Math.floor(Date.now() / (1000 * 60 * 60)).toString();
}

// Helper to prepare macro context
async function prepareMacroContext() {
    const marketData = await getMarketData();
    if (!marketData) throw new Error('Failed to fetch market data');

    const macroAssets = [
        { symbol: 'DX-Y.NYB', name: 'US Dollar Index' },
        { symbol: '^TNX', name: 'US 10Y Yield' },
        { symbol: '^GSPC', name: 'S&P 500' },
        { symbol: '^KS11', name: 'KOSPI' },
        { symbol: 'KRW=X', name: 'USD/KRW' },
        { symbol: 'CL=F', name: 'Crude Oil' },
        { symbol: 'GC=F', name: 'Gold' },
        { symbol: 'HG=F', name: 'Copper' },
    ];

    return macroAssets
        .map(asset => {
            const data = marketData[asset.symbol];
            if (!data) return null;
            const direction = data.change >= 0 ? '+' : '';
            return `${asset.name}: ${direction}${data.change.toFixed(2)}%`;
        })
        .filter(Boolean)
        .join(', ');
}

// Helper to prepare semiconductor context
async function prepareSemiconductorContext() {
    const marketData = await getMarketData();
    if (!marketData) throw new Error('Failed to fetch market data');

    const semiAssets = SECTOR_DATA.filter(
        item => item.sector !== 'Macro' && item.sector !== 'Index'
    );

    return semiAssets
        .slice(0, 15)
        .map(asset => {
            const data = marketData[asset.symbol];
            if (!data) return null;
            const direction = data.change >= 0 ? '+' : '';
            const displayName = asset.type === 'KRX' ? asset.koName : asset.name;
            return `${displayName} (${asset.symbol}): ${direction}${data.change.toFixed(2)}%`;
        })
        .filter(Boolean)
        .join(', ');
}

// Helper to prepare top movers context
async function prepareTopMoversContext() {
    const marketData = await getMarketData();
    if (!marketData) throw new Error('Failed to fetch market data');

    const allAssets = SECTOR_DATA.filter(item => item.sector !== 'Macro' && item.sector !== 'Index');
    const movers = allAssets
        .map(asset => {
            const data = marketData[asset.symbol];
            if (!data) return null;
            return {
                name: asset.type === 'KRX' ? asset.koName : asset.name,
                symbol: asset.symbol,
                change: data.change,
                absChange: Math.abs(data.change),
            };
        })
        .filter((item): item is NonNullable<typeof item> => item !== null)
        .sort((a, b) => b.absChange - a.absChange)
        .slice(0, 3);

    return movers
        .map((m, i) => {
            const direction = m.change >= 0 ? '+' : '';
            return `${i + 1}. ${m.name} (${m.symbol}): ${direction}${m.change.toFixed(2)}%`;
        })
        .join(', ');
}

// Stream macro analysis
export async function streamMacroAnalysis() {
    const currentHour = getCurrentHourKey();

    // Check cache first
    const getCached = unstable_cache(
        async () => {
            const context = await prepareMacroContext();
            const prompt = `당신은 전문 금융 애널리스트입니다. 오늘의 시장 데이터를 바탕으로 시장 브리핑을 작성합니다: ${context}

거시경제 환경에 대한 간결한 8-10문장의 분석을 한국어로 작성하세요. 전문적이고 블룸버그 스타일의 어조를 사용하세요. 데이터의 구체적인 수치를 포함하세요. "~입니다", "~습니다" 같은 격식있는 하십시오체를 사용하세요. AI라는 언급을 하지 마세요. 사람 애널리스트처럼 작성하세요. 링크가 필요한 경우 마크다운이 아닌 평문 URL만 사용하세요.`;

            const { textStream } = await streamText({
                model: openai('gpt-5-mini'),
                prompt,
                tools: webSearchTool,
                toolChoice: webSearchToolChoice,
            });

            // Collect full text for caching
            let fullText = '';
            for await (const chunk of textStream) {
                fullText += chunk;
            }

            return fullText;
        },
        ['macro-analysis', currentHour],
        { tags: ['market-insights'] }
    );

    const cachedText = await getCached();

    // Return as stream
    return new ReadableStream({
        start(controller) {
            controller.enqueue(new TextEncoder().encode(cachedText));
            controller.close();
        }
    });
}

// Stream semiconductor analysis
export async function streamSemiconductorAnalysis() {
    const currentHour = getCurrentHourKey();

    const getCached = unstable_cache(
        async () => {
            const context = await prepareSemiconductorContext();
            const prompt = `당신은 전문 반도체 산업 애널리스트입니다. 오늘의 시장 움직임을 바탕으로: ${context}

반도체 섹터에 대한 간결한 3-4문장의 분석을 한국어로 작성하세요. 메모리 사이클 지표, 장비 업체, 주요 트렌드에 집중하세요. 구체적인 회사명과 퍼센트를 사용하세요. "~입니다", "~습니다" 같은 격식있는 하십시오체를 사용하세요. 전문적이고 업계 내부자 같은 어조로 작성하세요. AI라는 언급을 하지 마세요. 링크가 필요한 경우 마크다운이 아닌 평문 URL만 사용하세요.`;

            const { textStream } = await streamText({
                model: openai('gpt-5-mini'),
                prompt,
                tools: webSearchTool,
                toolChoice: webSearchToolChoice,
            });

            let fullText = '';
            for await (const chunk of textStream) {
                fullText += chunk;
            }

            return fullText;
        },
        ['semiconductor-analysis', currentHour],
        { tags: ['market-insights'] }
    );

    const cachedText = await getCached();

    return new ReadableStream({
        start(controller) {
            controller.enqueue(new TextEncoder().encode(cachedText));
            controller.close();
        }
    });
}

// Stream highlight analysis
export async function streamHighlightAnalysis() {
    const currentHour = getCurrentHourKey();

    const getCached = unstable_cache(
        async () => {
            const context = await prepareTopMoversContext();
            const prompt = `당신은 전문 주식 애널리스트입니다. 오늘의 상위 3개 종목 변동은: ${context}

이러한 움직임을 주도하는 요인을 설명하는 간단한 분석을 한국어로 작성하세요. (번호는 따로 없는) 리스트 형식으로 회사당 1-2문장씩 작성하세요. "~입니다", "~습니다" 같은 격식있는 하십시오체를 사용하세요. 구체적이고 통찰력 있게 작성하세요. AI라는 언급을 하지 마세요. 사람 애널리스트처럼 작성하세요. 링크가 필요한 경우 마크다운이 아닌 평문 URL만 사용하세요.`;

            const { textStream } = await streamText({
                model: openai('gpt-5-mini'),
                prompt,
                tools: webSearchTool,
                toolChoice: webSearchToolChoice,
            });

            let fullText = '';
            for await (const chunk of textStream) {
                fullText += chunk;
            }

            return fullText;
        },
        ['highlight-analysis', currentHour],
        { tags: ['market-insights'] }
    );

    const cachedText = await getCached();

    return new ReadableStream({
        start(controller) {
            controller.enqueue(new TextEncoder().encode(cachedText));
            controller.close();
        }
    });
}

// Legacy function for backward compatibility (can be removed later)
export async function generateMarketInsights(): Promise<MarketInsights> {
    const [macroStream, semiStream, highlightStream] = await Promise.all([
        streamMacroAnalysis(),
        streamSemiconductorAnalysis(),
        streamHighlightAnalysis(),
    ]);

    const decoder = new TextDecoder();

    const readStream = async (stream: ReadableStream) => {
        const reader = stream.getReader();
        let text = '';
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            text += decoder.decode(value);
        }
        return text;
    };

    const [macroAnalysis, semiconductorAnalysis, topCompanies] = await Promise.all([
        readStream(macroStream),
        readStream(semiStream),
        readStream(highlightStream),
    ]);

    return {
        macroAnalysis,
        semiconductorAnalysis,
        topCompanies,
        generatedAt: new Date().toISOString(),
    };
}
