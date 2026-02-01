import { MarketItem } from "./constants";

export const SECTOR_DATA: MarketItem[] = [
    // ==============================================================================
    // USER SELECTED KRX LIST (Strict 21 Companies)
    // ==============================================================================

    // --- Memory ---
    { symbol: '005930.KS', name: 'Samsung Electronics', koName: '삼성전자', basePrice: 74200, currency: 'KRW', type: 'KRX', sector: 'Memory', changeRange: 2.5 },
    { symbol: '000660.KS', name: 'SK hynix', koName: 'SK하이닉스', basePrice: 198000, currency: 'KRW', type: 'KRX', sector: 'Memory', changeRange: 3.0 },

    // --- Foundry / Logic ---
    { symbol: '000990.KS', name: 'DB HiTek', koName: 'DB하이텍', basePrice: 45000, currency: 'KRW', type: 'KRX', sector: 'Foundry', changeRange: 1.2 },
    { symbol: '108320.KQ', name: 'LX Semicon', koName: 'LX세미콘', basePrice: 70000, currency: 'KRW', type: 'KRX', sector: 'Logic', changeRange: 1.5 },

    // --- Equipment (Wafer Fab, Test, OSAT, Parts) ---
    { symbol: '042700.KS', name: 'Hanmi Semiconductor', koName: '한미반도체', basePrice: 140000, currency: 'KRW', type: 'KRX', sector: 'Equipment', changeRange: 3.0 },
    { symbol: '403870.KQ', name: 'HPSP', koName: 'HPSP', basePrice: 40000, currency: 'KRW', type: 'KRX', sector: 'Equipment', changeRange: 2.5 },
    { symbol: '036930.KQ', name: 'Jusung Engineering', koName: '주성엔지니어링', basePrice: 28000, currency: 'KRW', type: 'KRX', sector: 'Equipment', changeRange: 2.0 },
    { symbol: '240810.KQ', name: 'Wonik IPS', koName: '원익IPS', basePrice: 35000, currency: 'KRW', type: 'KRX', sector: 'Equipment', changeRange: 1.5 },
    { symbol: '084370.KQ', name: 'Eugene Tech', koName: '유진테크', basePrice: 45000, currency: 'KRW', type: 'KRX', sector: 'Equipment', changeRange: 1.5 },
    { symbol: '029460.KS', name: 'KC', koName: '케이씨', basePrice: 20000, currency: 'KRW', type: 'KRX', sector: 'Equipment', changeRange: 1.2 },
    { symbol: '281820.KS', name: 'KC Tech', koName: '케이씨텍', basePrice: 38000, currency: 'KRW', type: 'KRX', sector: 'Equipment', changeRange: 1.5 },
    { symbol: '058470.KQ', name: 'Leeno Industrial', koName: '리노공업', basePrice: 200000, currency: 'KRW', type: 'KRX', sector: 'Equipment', changeRange: 1.5 },
    { symbol: '039030.KQ', name: 'EO Technics', koName: '이오테크닉스', basePrice: 150000, currency: 'KRW', type: 'KRX', sector: 'Equipment', changeRange: 1.8 },
    { symbol: '095340.KQ', name: 'ISC', koName: 'ISC', basePrice: 80000, currency: 'KRW', type: 'KRX', sector: 'Equipment', changeRange: 1.5 },
    { symbol: '232140.KQ', name: 'YC', koName: '와이씨', basePrice: 15000, currency: 'KRW', type: 'KRX', sector: 'Equipment', changeRange: 1.5 },
    { symbol: '067310.KQ', name: 'Hana Micron', koName: '하나마이크론', basePrice: 25000, currency: 'KRW', type: 'KRX', sector: 'Equipment', changeRange: 1.4 },

    // --- Materials / Components ---
    { symbol: '357780.KQ', name: 'Soulbrain', koName: '솔브레인', basePrice: 280000, currency: 'KRW', type: 'KRX', sector: 'Materials', changeRange: 1.5 },
    { symbol: '005290.KQ', name: 'Dongjin Semichem', koName: '동진쎄미켐', basePrice: 40000, currency: 'KRW', type: 'KRX', sector: 'Materials', changeRange: 1.2 },
    { symbol: '281740.KQ', name: 'Lake Materials', koName: '레이크머티리얼즈', basePrice: 20000, currency: 'KRW', type: 'KRX', sector: 'Materials', changeRange: 2.0 },
    { symbol: '101490.KQ', name: 'S&S Tech', koName: '에스앤에스텍', basePrice: 50000, currency: 'KRW', type: 'KRX', sector: 'Materials', changeRange: 2.0 },
    { symbol: '064760.KQ', name: 'TCK', koName: '티씨케이', basePrice: 110000, currency: 'KRW', type: 'KRX', sector: 'Materials', changeRange: 1.5 },
    { symbol: '009150.KS', name: 'Samsung Electro-Mech', koName: '삼성전기', basePrice: 140000, currency: 'KRW', type: 'KRX', sector: 'Materials', changeRange: 1.2 },

    // ==============================================================================
    // SOX (Global Context)
    // ==============================================================================
    { symbol: 'MU', name: 'Micron', basePrice: 110.50, currency: 'USD', type: 'US', sector: 'Memory', changeRange: 4.0 }, // Keeping MU for Memory context

    { symbol: 'NVDA', name: 'NVIDIA', basePrice: 120.00, currency: 'USD', type: 'US', sector: 'Logic', changeRange: 3.5 },
    { symbol: 'AMD', name: 'AMD', basePrice: 160.00, currency: 'USD', type: 'US', sector: 'Logic', changeRange: 3.0 },
    { symbol: 'AVGO', name: 'Broadcom', basePrice: 1400.00, currency: 'USD', type: 'US', sector: 'Logic', changeRange: 2.5 },
    { symbol: 'QCOM', name: 'Qualcomm', basePrice: 200.00, currency: 'USD', type: 'US', sector: 'Logic', changeRange: 2.0 },
    { symbol: 'INTC', name: 'Intel', basePrice: 30.00, currency: 'USD', type: 'US', sector: 'Foundry', changeRange: 0.5 },
    { symbol: 'ARM', name: 'Arm Holdings', basePrice: 140.00, currency: 'USD', type: 'US', sector: 'Logic', changeRange: 2.2 },

    { symbol: 'TSM', name: 'TSMC', basePrice: 170.00, currency: 'USD', type: 'US', sector: 'Foundry', changeRange: 2.0 },
    { symbol: 'ASML', name: 'ASML', basePrice: 950.00, currency: 'USD', type: 'US', sector: 'Equipment', changeRange: 2.0 },
    { symbol: 'AMAT', name: 'Applied Materials', basePrice: 230.00, currency: 'USD', type: 'US', sector: 'Equipment', changeRange: 2.5 },
    { symbol: 'LRCX', name: 'Lam Research', basePrice: 950.00, currency: 'USD', type: 'US', sector: 'Equipment', changeRange: 2.2 },
    { symbol: 'KLAC', name: 'KLA Corp', basePrice: 800.00, currency: 'USD', type: 'US', sector: 'Equipment', changeRange: 2.0 },
    { symbol: 'TER', name: 'Teradyne', basePrice: 140.00, currency: 'USD', type: 'US', sector: 'Equipment', changeRange: 1.5 },
    { symbol: 'ENTG', name: 'Entegris', basePrice: 130.00, currency: 'USD', type: 'US', sector: 'Equipment', changeRange: 1.2 },

    { symbol: 'TXN', name: 'Texas Instruments', basePrice: 190.00, currency: 'USD', type: 'US', sector: 'Logic', changeRange: 1.0 },
    { symbol: 'ADI', name: 'Analog Devices', basePrice: 230.00, currency: 'USD', type: 'US', sector: 'Logic', changeRange: 1.5 },
    { symbol: 'NXPI', name: 'NXP Semi', basePrice: 270.00, currency: 'USD', type: 'US', sector: 'Logic', changeRange: 1.3 },
    { symbol: 'MCHP', name: 'Microchip', basePrice: 90.00, currency: 'USD', type: 'US', sector: 'Logic', changeRange: 1.2 },
    { symbol: 'ON', name: 'ON Semi', basePrice: 70.00, currency: 'USD', type: 'US', sector: 'Logic', changeRange: 1.8 },
    { symbol: 'MRVL', name: 'Marvell', basePrice: 70.00, currency: 'USD', type: 'US', sector: 'Logic', changeRange: 2.0 },
    { symbol: 'SWKS', name: 'Skyworks', basePrice: 90.00, currency: 'USD', type: 'US', sector: 'Logic', changeRange: 1.2 },
    { symbol: 'QRVO', name: 'Qorvo', basePrice: 100.00, currency: 'USD', type: 'US', sector: 'Logic', changeRange: 1.5 },
    { symbol: 'MPWR', name: 'Monolithic Power', basePrice: 800.00, currency: 'USD', type: 'US', sector: 'Logic', changeRange: 1.8 },
    { symbol: 'ALGM', name: 'Allegro Micro', basePrice: 25.00, currency: 'USD', type: 'US', sector: 'Logic', changeRange: 1.0 },
    { symbol: 'WOLF', name: 'Wolfspeed', basePrice: 25.00, currency: 'USD', type: 'US', sector: 'Logic', changeRange: 2.5 },
    { symbol: 'RMBS', name: 'Rambus', basePrice: 50.00, currency: 'USD', type: 'US', sector: 'Logic', changeRange: 1.2 },
    { symbol: 'LSCC', name: 'Lattice Semi', basePrice: 60.00, currency: 'USD', type: 'US', sector: 'Logic', changeRange: 1.5 },
    { symbol: 'COHR', name: 'Coherent', basePrice: 60.00, currency: 'USD', type: 'US', sector: 'Equipment', changeRange: 1.5 },

    { symbol: 'AMKR', name: 'Amkor Tech', basePrice: 30.00, currency: 'USD', type: 'US', sector: 'Equipment', changeRange: 1.5 },
    { symbol: 'GFS', name: 'GlobalFoundries', basePrice: 50.00, currency: 'USD', type: 'US', sector: 'Foundry', changeRange: 1.5 },

    // ==============================================================================
    // MACRO / INDICES / COMMODITIES
    // ==============================================================================
    { symbol: 'DX-Y.NYB', name: 'US Dollar Index', basePrice: 105.00, currency: 'PTS', type: 'MACRO', sector: 'Macro', changeRange: 0.2 },
    { symbol: 'KRW=X', name: 'USD/KRW', basePrice: 1380.50, currency: 'KRW', type: 'MACRO', sector: 'Macro', changeRange: 0.5 },
    { symbol: '^TNX', name: 'US 10Y Yield', basePrice: 4.45, currency: 'PTS', type: 'MACRO', sector: 'Macro', changeRange: 1.0 },

    { symbol: '^GSPC', name: 'S&P 500', basePrice: 5500.00, currency: 'PTS', type: 'INDEX', sector: 'Macro', changeRange: 1.0 },
    { symbol: '^KS11', name: 'KOSPI', basePrice: 2700.00, currency: 'PTS', type: 'INDEX', sector: 'Macro', changeRange: 1.2 },
    { symbol: '^SOX', name: 'PHLX Semi', basePrice: 5200.00, currency: 'PTS', type: 'INDEX', sector: 'Macro', changeRange: 1.5 },
    { symbol: '^NDX', name: 'Nasdaq 100', basePrice: 18000.00, currency: 'PTS', type: 'INDEX', sector: 'Macro', changeRange: 1.5 },
    { symbol: 'CL=F', name: 'Crude Oil', basePrice: 80.00, currency: 'USD', type: 'MACRO', sector: 'Macro', changeRange: 2.0 },
    { symbol: 'GC=F', name: 'Gold', basePrice: 2300.00, currency: 'USD', type: 'MACRO', sector: 'Macro', changeRange: 0.5 },
    { symbol: 'HG=F', name: 'Copper', basePrice: 4.50, currency: 'USD', type: 'MACRO', sector: 'Macro', changeRange: 1.5 },
    { symbol: 'RIO', name: 'Iron Ore (RIO)', basePrice: 65.00, currency: 'USD', type: 'MACRO', sector: 'Macro', changeRange: 1.0 },
];
