import SemiconductorSectorView from '@/components/SemiconductorSectorView';
import MacroView from '@/components/MacroView';
import MarketInsightsPanel from '@/components/MarketInsightsPanel';


export default function Home() {
    return (
        <main className="min-h-screen bg-portal-black text-white p-4 md:p-8 font-sans">
            <div className="max-w-7xl mx-auto space-y-12">

                {/* Header Section */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/10 pb-6">
                    <div>
                        <h1 className="text-2xl md:text-4xl font-black tracking-tighter uppercase text-white leading-tight mb-4">
                            Semicon<br />
                            <span className="text-portal-accent text-stroke">Investors</span>
                        </h1>

                    </div>

                </header>

                {/* AI-Powered Market Analysis - Collapsible */}
                <section>
                    <MarketInsightsPanel />
                </section>

                {/* Main Sector View */}
                <SemiconductorSectorView />

                {/* Macro Overview */}
                <section>
                    <MacroView />
                </section>

            </div>
        </main>
    );
}
