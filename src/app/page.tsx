import { db } from '@/db';
import { metrics } from '@/db/schema';
import { desc } from 'drizzle-orm';
import { NewMetricButton } from '@/components/NewMetricButton';
import { FormDrawer } from '@/components/FormDrawer';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  let allMetrics: any[] = [];
  let connectionError = null;

  try {
    allMetrics = await db.select().from(metrics).orderBy(desc(metrics.updatedAt));
  } catch (error) {
    connectionError = (error as Error).message;
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 p-6 md:p-12">
      <div className="max-w-7xl mx-auto space-y-8">

        <header className="border-b border-slate-800 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Enterprise KPI Dashboard
            </h1>
            <p className="text-slate-400 text-sm mt-1">Full-stack React 19 Server Architecture</p>
          </div>

          {/* FIXED: Replaced static placeholder/form with interactive toggle button */}
          <NewMetricButton />
        </header>

        {/* Global Slideout Overlay Drawer Component */}
        <FormDrawer />

        {/* Database Metrics Rendering Layout Grid */}
        {!connectionError && (
          <div>
            {allMetrics.length === 0 ? (
              <div className="flex flex-col items-center justify-center border border-dashed border-slate-800 rounded-2xl p-16 text-center bg-slate-900/20">
                <h3 className="text-lg font-medium text-slate-200">Connected to Database!</h3>
                <p className="text-slate-500 text-sm mt-1">Click the Add Metric button to feed the dataset panel.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {allMetrics.map((item) => (
                  <div key={item.id} className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-semibold tracking-wider uppercase text-blue-400 bg-blue-950/50 px-2.5 py-1 rounded-md">
                        {item.category}
                      </span>
                      <h2 className="text-xl font-bold mt-4 text-slate-100">{item.name}</h2>
                    </div>
                    <div className="mt-6 flex items-baseline gap-2">
                      <span className="text-3xl font-extrabold text-white">
                        {item.type === 'currency' && '$'}
                        {item.value.toLocaleString()}
                        {item.type === 'percentage' && '%'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}