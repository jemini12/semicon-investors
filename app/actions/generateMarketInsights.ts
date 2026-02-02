'use server';

import { generateText } from 'ai';
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

async function generateMarketInsightsInternal(): Promise<MarketInsights> {
    // Fetch current market data
    const marketData = await getMarketData();

    if (!marketData) {
        throw new Error('Failed to fetch market data');
    }

    // Prepare macro assets context
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

    const macroContext = macroAssets
        .map(asset => {
            const data = marketData[asset.symbol];
            if (!data) return null;
            const direction = data.change >= 0 ? '+' : '';
            return `${asset.name}: ${direction}${data.change.toFixed(2)}%`;
        })
        .filter(Boolean)
        .join(', ');

    // Prepare semiconductor assets context
    const semiAssets = SECTOR_DATA.filter(
        item => item.sector !== 'Macro' && item.sector !== 'Index'
    );

    const semiContext = semiAssets
        .slice(0, 15) // Top 15 for context
        .map(asset => {
            const data = marketData[asset.symbol];
            if (!data) return null;
            const direction = data.change >= 0 ? '+' : '';
            const displayName = asset.type === 'KRX' ? asset.koName : asset.name;
            return `${displayName} (${asset.symbol}): ${direction}${data.change.toFixed(2)}%`;
        })
        .filter(Boolean)
        .join(', ');

    // Find top 3 movers by absolute change
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

    const moversContext = movers
        .map((m, i) => {
            const direction = m.change >= 0 ? '+' : '';
            return `${i + 1}. ${m.name} (${m.symbol}): ${direction}${m.change.toFixed(2)}%`;
        })
        .join(', ');

    // Generate macro analysis
    const macroPrompt = `당신은 전문 금융 애널리스트입니다. 오늘의 시장 데이터를 바탕으로 시장 브리핑을 작성합니다: ${macroContext}

거시경제 환경에 대한 간결한 8-10문장의 분석을 한국어로 작성하세요. 전문적이고 블룸버그 스타일의 어조를 사용하세요. 데이터의 구체적인 수치를 포함하세요. "~입니다", "~습니다" 같은 격식있는 하십시오체를 사용하세요. AI라는 언급을 하지 마세요. 사람 애널리스트처럼 작성하세요.`;

    const { text: macroAnalysis } = await generateText({
        model: openai('gpt-5-mini'),
        prompt: macroPrompt,
    });

    // Generate semiconductor analysis
    const semiPrompt = `당신은 전문 반도체 산업 애널리스트입니다. 오늘의 시장 움직임을 바탕으로: ${semiContext}

반도체 섹터에 대한 간결한 3-4문장의 분석을 한국어로 작성하세요. 메모리 사이클 지표, 장비 업체, 주요 트렌드에 집중하세요. 구체적인 회사명과 퍼센트를 사용하세요. "~입니다", "~습니다" 같은 격식있는 하십시오체를 사용하세요. 전문적이고 업계 내부자 같은 어조로 작성하세요. AI라는 언급을 하지 마세요.`;

    const { text: semiconductorAnalysis } = await generateText({
        model: openai('gpt-5-mini'),
        prompt: semiPrompt,
    });

    // Generate top companies analysis
    const topPrompt = `당신은 전문 주식 애널리스트입니다. 오늘의 상위 3개 종목 변동은: ${moversContext}

이러한 움직임을 주도하는 요인을 설명하는 간단한 분석을 한국어로 작성하세요. (번호는 따로 없는) 리스트 형식으로 회사당 1-2문장씩 작성하세요. "~입니다", "~습니다" 같은 격식있는 하십시오체를 사용하세요. 구체적이고 통찰력 있게 작성하세요. AI라는 언급을 하지 마세요. 사람 애널리스트처럼 작성하세요.`;

    const { text: topCompanies } = await generateText({
        model: openai('gpt-5-mini'),
        prompt: topPrompt,
    });

    return {
        macroAnalysis,
        semiconductorAnalysis,
        topCompanies,
        generatedAt: new Date().toISOString(),
    };
}

// Export cached version with time-based cache key for hourly refresh
export async function generateMarketInsights(): Promise<MarketInsights> {
    // Create a cache key that changes every hour
    const currentHour = Math.floor(Date.now() / (1000 * 60 * 60));

    const getCachedInsights = unstable_cache(
        generateMarketInsightsInternal,
        ['market-insights', currentHour.toString()],
        {
            tags: ['market-insights'],
        }
    );

    return getCachedInsights();
}
