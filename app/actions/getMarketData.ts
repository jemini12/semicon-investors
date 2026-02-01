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

                // Cast to unknown first to bypass potential library type mismatches, then to our interface
                const results = await yahooFinance.quote(symbols) as unknown as YahooQuote[];

                // Map results back to our structure
                const mappedResults: { [symbol: string]: { price: number; change: number; marketCap: number } } = {};

                results.forEach((quote: YahooQuote) => {
                    mappedResults[quote.symbol] = {
                        price: quote.regularMarketPrice || 0,
                        change: quote.regularMarketChangePercent || 0,
                        marketCap: quote.marketCap || 0,
                    };
                });
                return mappedResults;
            } catch (error) {
                console.error("Failed to fetch market data:", error);
                return null;
            }
        },
        ['market-data-all-v2'],
        { revalidate: 60 } // 1 minute for faster updates during dev
    );

    return getCachedData();
}
