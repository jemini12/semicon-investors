# Semiconductor Investors - Project Specification

## 1. Executive Summary
**Semiconductor Investors** is a specialized financial analytics platform dedicated to the global semiconductor supply chain. It empowers investors to track, analyze, and monitor the chip industry, breaking down complex sector dynamics into actionable data using a high-density, real-time dashboard.

## 2. Core Value Proposition
Unlike general finance portals, this platform categorizes the semiconductor industry by its unique value chain (Foundry, Logic, Memory, Equipment, Materials), offering insights that generalist tools miss. It focuses on the critical relationship between the South Korean market and global SOX index peers.

## 3. Product Features

### 3.1. Market Dashboard (The "Portal View")
- **Focused Coverage**: Strict curation of **50+ Key Assets**:
  - **22 Korean Leaders**: Samsung, SK hynix, Hanmi, HPSP, etc.
  - **30 Global Giants**: Full PHLX Semiconductor Sector (SOX) members.
  - **Macro Environment**: Critical indicators including the **US Dollar Index (DXY)**, **USD/KRW**, **US 10Y Yield**, and key commodities (Oil, Gold, Copper, Iron Ore).
- **Responsive Grid Layout**: A unified, high-density grid system (1-4 columns) that ensures a consistent look across Macro and Sector views.
- **Smart Sorting**: Sector companies are auto-sorted by **Price Change % (Descending)**, surfacing the day's top performers.
- **Direct Research Links**: Asset names link directly to live Yahoo Finance quotes.

### 3.2. Visual & UX Design
- **Silicon Theme**: A premium "Deep Charcoal & Orange" aesthetic using glassmorphism, subtle micro-animations, and vibrant accent colors.
- **Loading State**: Integrated **Loading Spinner** (Circle) to provide immediate feedback during initial data hydration.
- **Header**: Compact two-line title branding ("Semiconductor / Investors").

## 4. Technical Architecture

### 4.1. Frontend Stack
- **Framework**: Next.js 15+ (App Router).
- **Language**: TypeScript (Strict Mode).
- **Styling**: Tailwind CSS with custom portal utility classes.
- **Components**: Modular React components for `MacroView`, `SemiconductorSectorView`, and `MemoryCycleMonitor`.
- **Formatting**: Standard JavaScript `Intl.NumberFormat` for multi-currency handling (USD, KRW, PTS).

### 4.2. Data Integration
- **Market Data Engine**:
  - **Source**: `yahoo-finance2` for live batch-fetching.
  - **Caching Architecture**: Next.js `unstable_cache` with a **15-minute revalidation** window (Key: `market-data-all-v2`).
  - **Strategy**: Static data defined in `ticker-data.ts` acts as the baseline for all market assets.

## 5. Visual Identity & UI/UX
- **Background**: Deep portal black/gray balance.
- **Accents**: 
  - `portal-accent`: Warm orange for primary highlights and borders.
  - `green-500` / `red-500`: Standardized price change indicators.
- **Typography**: Inter (Body) and JetBrains Mono (Financial Data/Numbers).

## 6. Current Implementation Status
1. **Foundation (Completed)**: Root routing, unified layout, and core styling.
2. **Real-time Engine (Completed)**: Batch fetching from Yahoo Finance with robust caching.
3. **Dashboard Refinement (Completed)**: Unified grid layouts, loading indicators, and Macro/Sector consolidation.
4. **Branding & Cleanup (Completed)**: Removed localization for performance; finalized "Semiconductor Investors" identity.
