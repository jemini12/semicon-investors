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

                // Fetch quotes for basic data (FAST - single batch request)
                const quotes = await yahooFinance.quote(symbols) as unknown as YahooQuote[];

                // NOTE: Sparkline chart data removed to restore fast loading
                // Fetching 30 days of chart data for 50+ symbols was causing 48s delays
                // If needed in the future, implement as a separate lazy-loaded endpoint

                quotes.forEach((quote: YahooQuote) => {
                    mappedResults[quote.symbol] = {
                        price: quote.regularMarketPrice || 0,
                        change: quote.regularMarketChangePercent || 0,
                        marketCap: quote.marketCap || 0,
                        sparkline: [], // Empty - no chart data fetched
                    };
                });
                return mappedResults;
            } catch (error) {
                console.error("Failed to fetch market data:", error);
                return null;
            }
        },
        ['market-data-quotes-only-v2'], // Changed cache key
        { revalidate: 300 } // 5 minutes - faster than hourly since we removed expensive chart data
    );

    return getCachedData();
}
