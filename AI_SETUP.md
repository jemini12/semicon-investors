# AI Market Analysis Setup

The Semiconductor Investors dashboard now includes AI-powered market intelligence that provides three daily insights.

## Quick Setup

1. **Get an OpenAI API Key**
   - Visit [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
   - Create a new API key
   - Copy the key (it starts with `sk-`)

2. **Configure Environment**
   ```bash
   # Create .env.local file in project root
   cp .env.example .env.local
   ```

3. **Add Your API Key**
   Edit `.env.local` and replace the placeholder:
   ```
   OPENAI_API_KEY=sk-your-actual-key-here
   ```

4. **Restart Development Server**
   ```bash
   npm run dev
   ```

## What It Does

The MarketInsightsPanel generates three professional market analyses:

1. **🌍 Macro Environment**: Analysis of USD index, yields, S&P 500, KOSPI, and commodities
2. **💾 Semiconductor Sector**: Insights on memory cycle, equipment makers, and major trends
3. **⭐ Top Movers**: Commentary on the 3 most remarkable companies by % change

All analyses are generated using real-time market data and written in a professional, Bloomberg-style tone.

## Features

- **Natural Language**: Written by GPT-4 in professional analyst tone
- **Data-Driven**: Uses actual price changes and percentages from live data
- **Cached**: Insights regenerate every page load (can be optimized with caching if needed)
- **Error Handling**: Gracefully handles API failures with user-friendly messages

## Cost Considerations

- Each insight generation makes 3 API calls to OpenAI GPT-4
- Average cost: ~$0.01-0.03 per page load
- Consider implementing caching for production use

## Alternative Providers

The implementation uses Vercel AI SDK, which supports multiple providers:
- **OpenAI** (default): GPT-4, GPT-3.5
- **Anthropic**: Claude 3.5 Sonnet, Claude 3 Opus
- **Google**: Gemini Pro
- **Others**: See [AI SDK Providers](https://sdk.vercel.ai/providers)

To switch providers, modify `app/actions/generateMarketInsights.ts` and install the corresponding package.
