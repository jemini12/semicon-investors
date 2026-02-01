'use server';

import { unstable_cache } from 'next/cache';

import YahooFinance from 'yahoo-finance2';
const yahooFinance = new YahooFinance();
import { SECTOR_DATA } from '@/lib/ticker-data';

export async function getMarketData() {
    const symbols = SECTOR_DATA.map(item => item.symbol);

    const getCachedData = unstable_cache(
        async () => {
            try {
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

                // Fetch quotes for basic data
                const quotes = await yahooFinance.quote(symbols) as unknown as YahooQuote[];

                // Fetch chart data for sparklines (1 month)
                // We use a simplified chart fetch for all symbols
                const chartPromises = symbols.map(async (symbol) => {
                    try {
                        const chartData = await yahooFinance.chart(symbol, {
                            period1: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                            interval: '1d',
                        });
                        return {
                            symbol,
                            prices: chartData.quotes?.map(q => q.close).filter((p): p is number => typeof p === 'number' && p !== null) || []
                        };
                    } catch (e) {
                        console.error(`Failed to fetch chart for ${symbol}:`, e);
                        return { symbol, prices: [] };
                    }
                });

                const allCharts = await Promise.all(chartPromises);

                quotes.forEach((quote: YahooQuote) => {
                    const chart = allCharts.find(c => c.symbol === quote.symbol);
                    mappedResults[quote.symbol] = {
                        price: quote.regularMarketPrice || 0,
                        change: quote.regularMarketChangePercent || 0,
                        marketCap: quote.marketCap || 0,
                        sparkline: chart?.prices || [],
                    };
                });
                return mappedResults;
            } catch (error) {
                console.error("Failed to fetch market data:", error);
                return null;
            }
        },
        ['market-data-with-sparklines-v1'],
        { revalidate: 3600 } // 1 hour for historical data (more aggressive caching)
    );

    return getCachedData();
}
