export type MarketItem = {
    symbol: string;
    name: string;
    basePrice: number;
    currency: 'KRW' | 'USD' | 'XZN' | 'PTS'; // XZN for rates, PTS for indices if needed
    type: 'KRX' | 'US' | 'INDEX' | 'MACRO';
    sector: 'Memory' | 'Logic' | 'Foundry' | 'Equipment' | 'Materials' | 'Index' | 'Macro';
    changeRange: number;
};

export const INITIAL_MARKET_DATA: MarketItem[] = [
    // --- Memory Cycle (The Core) ---
    { symbol: '005930.KS', name: 'Samsung Elec', basePrice: 74200, currency: 'KRW', type: 'KRX', sector: 'Memory', changeRange: 2.5 },
    { symbol: '000660.KS', name: 'SK Hynix', basePrice: 198000, currency: 'KRW', type: 'KRX', sector: 'Memory', changeRange: 3.0 },
    { symbol: 'MU', name: 'Micron', basePrice: 110.50, currency: 'USD', type: 'US', sector: 'Memory', changeRange: 4.0 },

    // --- Macro Economics ---
    { symbol: 'KRW=X', name: 'USD/KRW', basePrice: 1380.50, currency: 'KRW', type: 'MACRO', sector: 'Macro', changeRange: 0.5 },
    { symbol: '^TNX', name: 'US 10Y Yield', basePrice: 4.45, currency: 'PTS', type: 'MACRO', sector: 'Macro', changeRange: 1.0 },
    { symbol: '^GSPC', name: 'S&P 500', basePrice: 5500.00, currency: 'PTS', type: 'INDEX', sector: 'Macro', changeRange: 1.0 },
    { symbol: '^KS11', name: 'KOSPI', basePrice: 2700.00, currency: 'PTS', type: 'INDEX', sector: 'Macro', changeRange: 1.2 },

    // --- Key Logic/Foundry (Secondary Context) ---
    { symbol: 'NVDA', name: 'NVIDIA', basePrice: 120.50, currency: 'USD', type: 'US', sector: 'Logic', changeRange: 3.5 },
    { symbol: 'TSM', name: 'TSMC', basePrice: 170.00, currency: 'USD', type: 'US', sector: 'Foundry', changeRange: 2.0 },
];
