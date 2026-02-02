'use server';

import { unstable_cache } from 'next/cache';

import YahooFinance from 'yahoo-finance2';
const yahooFinance = new YahooFinance();
import { SECTOR_DATA } from '@/lib/ticker-data';

// Define reusable interface
interface YahooQuote {
    symbol: string;
    regularMarketPrice?: number;
    regularMarketChangePercent?: number;
    marketCap?: number;
}

export type MarketDataMap = {
    [symbol: string]: {
        price: number;
        change: number;
        marketCap: number;
        sparkline: number[];
    }
};

// FAST: Fetch only basic price data (~1s)
export async function getMarketQuotes() {
    const symbols = SECTOR_DATA.map(item => item.symbol);

    return unstable_cache(
        async () => {
            try {
                const startTime = Date.now();
                console.log('[getMarketQuotes] Fetching quotes batch...');

                const quotes = await yahooFinance.quote(symbols) as unknown as YahooQuote[];

                const mappedResults: MarketDataMap = {};
                quotes.forEach((quote: YahooQuote) => {
                    mappedResults[quote.symbol] = {
                        price: quote.regularMarketPrice || 0,
                        change: quote.regularMarketChangePercent || 0,
                        marketCap: quote.marketCap || 0,
                        sparkline: [], // Empty initially
                    };
                });

                console.log(`[getMarketQuotes] ✅ Done in ${Date.now() - startTime}ms`);
                return mappedResults;
            } catch (error) {
                console.error("[getMarketQuotes] ❌ Failed:", error);
                return null;
            }
        },
        ['market-quotes-v1'],
        { revalidate: 60 } // Update prices every minute
    )();
}

// SLOW: Fetch only sparkline charts (~7-9s)
export async function getSparklines() {
    const symbols = SECTOR_DATA.map(item => item.symbol);

    return unstable_cache(
        async () => {
            try {
                const startTime = Date.now();
                console.log('[getSparklines] Starting chart fetch...');

                const BATCH_SIZE = 5;
                const chartResults: { symbol: string; prices: number[] }[] = [];

                for (let i = 0; i < symbols.length; i += BATCH_SIZE) {
                    const batch = symbols.slice(i, i + BATCH_SIZE);
                    const batchPromises = batch.map(async (symbol) => {
                        try {
                            const chartData = await yahooFinance.chart(symbol, {
                                period1: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                                interval: '1d',
                            });
                            return {
                                symbol,
                                prices: chartData.quotes?.map(q => q.close).filter((p): p is number => typeof p === 'number' && p !== null) || []
                            };
                        } catch (e) {
                            return { symbol, prices: [] };
                        }
                    });

                    chartResults.push(...await Promise.all(batchPromises));
                }

                // Map to same structure but only with sparklines populated (others 0/empty)
                const mappedResults: MarketDataMap = {};
                chartResults.forEach(r => {
                    mappedResults[r.symbol] = {
                        price: 0,
                        change: 0,
                        marketCap: 0,
                        sparkline: r.prices
                    };
                });

                console.log(`[getSparklines] ✅ Done in ${Date.now() - startTime}ms`);
                return mappedResults;
            } catch (error) {
                console.error("[getSparklines] ❌ Failed:", error);
                return null;
            }
        },
        ['market-sparklines-v1'],
        { revalidate: 300 } // Charts update every 5 mins
    )();
}

// Legacy support (optional, can remove if unused)
export async function getMarketData() {
    const quotes = await getMarketQuotes();
    const sparks = await getSparklines();

    if (!quotes) return null;
    if (!sparks) return quotes;

    // Merge
    const merged = { ...quotes };
    Object.keys(merged).forEach(symbol => {
        if (sparks[symbol]) {
            merged[symbol].sparkline = sparks[symbol].sparkline;
        }
    });
    return merged;
}
