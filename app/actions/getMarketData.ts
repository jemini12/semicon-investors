'use server';

import { unstable_cache } from 'next/cache';

import YahooFinance from 'yahoo-finance2';
const yahooFinance = new YahooFinance();
import { SECTOR_DATA } from '@/lib/ticker-data';

export async function getMarketData() {
    const startTime = Date.now();
    console.log('[getMarketData] Starting data fetch...');

    const symbols = SECTOR_DATA.map(item => item.symbol);
    console.log(`[getMarketData] Fetching data for ${symbols.length} symbols`);

    const getCachedData = unstable_cache(
        async () => {
            try {
                const fetchStartTime = Date.now();

                // Define minimal interface to satisfy linter and type safety
                interface YahooQuote {
                    symbol: string;
                    regularMarketPrice?: number;
                    regularMarketChangePercent?: number;
                    marketCap?: number;
                }

                // Map results back to our structure
                const mappedResults: {
                    [symbol: string]: {
                        price: number;
                        change: number;
                        marketCap: number;
                        sparkline: number[];
                    }
                } = {};

                // Fetch quotes for basic data (FAST - single batch request)
                console.log('[getMarketData] Fetching quotes batch...');
                const quotesStartTime = Date.now();
                const quotes = await yahooFinance.quote(symbols) as unknown as YahooQuote[];
                const quotesDuration = Date.now() - quotesStartTime;
                console.log(`[getMarketData] Quotes fetched in ${quotesDuration}ms for ${quotes.length} symbols`);

                // Fetch chart data for sparklines in smaller batches to avoid timeout
                console.log('[getMarketData] Fetching sparkline chart data...');
                const chartStartTime = Date.now();

                const BATCH_SIZE = 5; // Process 5 symbols at a time to avoid overwhelming API
                const chartResults: { symbol: string; prices: number[] }[] = [];

                for (let i = 0; i < symbols.length; i += BATCH_SIZE) {
                    const batch = symbols.slice(i, i + BATCH_SIZE);
                    const batchStartTime = Date.now();

                    const batchPromises = batch.map(async (symbol) => {
                        try {
                            const symbolStartTime = Date.now();
                            const chartData = await yahooFinance.chart(symbol, {
                                period1: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days instead of 30
                                interval: '1d',
                            });
                            const symbolDuration = Date.now() - symbolStartTime;
                            console.log(`  [${symbol}] Chart fetched in ${symbolDuration}ms`);

                            return {
                                symbol,
                                prices: chartData.quotes?.map(q => q.close).filter((p): p is number => typeof p === 'number' && p !== null) || []
                            };
                        } catch (e) {
                            console.error(`  [${symbol}] Chart fetch failed:`, e);
                            return { symbol, prices: [] };
                        }
                    });

                    const batchResults = await Promise.all(batchPromises);
                    chartResults.push(...batchResults);

                    const batchDuration = Date.now() - batchStartTime;
                    console.log(`[getMarketData] Batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(symbols.length / BATCH_SIZE)} completed in ${batchDuration}ms`);
                }

                const chartDuration = Date.now() - chartStartTime;
                console.log(`[getMarketData] All sparkline charts fetched in ${chartDuration}ms`);

                quotes.forEach((quote: YahooQuote) => {
                    const chart = chartResults.find(c => c.symbol === quote.symbol);
                    mappedResults[quote.symbol] = {
                        price: quote.regularMarketPrice || 0,
                        change: quote.regularMarketChangePercent || 0,
                        marketCap: quote.marketCap || 0,
                        sparkline: chart?.prices || [], // Use fetched chart data
                    };
                });

                const totalDuration = Date.now() - fetchStartTime;
                console.log(`[getMarketData] ✅ Complete fetch in ${totalDuration}ms (${quotes.length} symbols with sparklines)`);

                return mappedResults;
            } catch (error) {
                console.error("[getMarketData] ❌ Failed to fetch market data:", error);
                return null;
            }
        },
        ['market-data-with-sparklines-v3'], // Batched fetching with 7-day sparklines
        { revalidate: 300 } // 5 minutes
    );

    const result = await getCachedData();
    const totalTime = Date.now() - startTime;
    console.log(`[getMarketData] Total execution time: ${totalTime}ms (includes cache lookup)`);

    return result;
}
