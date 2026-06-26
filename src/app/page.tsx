import { db } from '@/db';
import { metrics } from '@/db/schema';
import { desc } from 'drizzle-orm';

// This forces Next.js to run this page dynamically on every request 
// instead of caching a blank page during your initial build.
export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  let allMetrics = [];
  let connectionError = null;

  try {
    // Attempt to query your cloud/local database, sorting by latest updates
    allMetrics = await db.select().from(metrics).orderBy(desc(metrics.updatedAt));
  } catch (error) {
    console.error("Database connection failed:", error);
    connectionError = (error as Error).message;
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 p-6 md:p-12">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header Section */}
        <header className="border-b border-slate-800 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Enterprise KPI Dashboard
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Full-stack React 19 Server Architecture
            </p>
          </div>

          {/* Placeholder button for our future Form Action Modal */}
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-semibold shadow-lg shadow-blue-500/20 transition-all active:scale-95">
            + Add Metric
          </button>
        </header>

        {/* Database Connection Error Callout */}
        {connectionError && (
          <div className="p-4 bg-red-950/50 border border-red-800 rounded-xl text-red-200 text-sm">
            <strong className="font-semibold">Database Connection Error:</strong> {connectionError}
            <p className="mt-1 text-red-400/80 text-xs">Check that your DATABASE_URL in .env.local is correct.</p>
          </div>
        )}

        {/* Metrics Grid */}
        {!connectionError && (
          <div>
            {allMetrics.length === 0 ? (
              /* Empty State UI */
              <div className="flex flex-col items-center justify-center border border-dashed border-slate-800 rounded-2xl p-16 text-center bg-slate-900/20">
                <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 font-mono text-xl mb-4">
                  ✓
                </div>
                <h3 className="text-lg font-medium text-slate-200">Connected to Database!</h3>
                <p className="text-slate-500 text-sm max-w-sm mt-1">
                  Your pipeline is live, but your <code className="text-slate-400 font-mono">metrics</code> table is currently empty. Next, we will build a Server Action to populate it.
                </p>
              </div>
            ) : (
              /* Populated Cards State */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {allMetrics.map((item) => (
                  <div
                    key={item.id}
                    className="p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl flex flex-col justify-between hover:border-slate-700 transition-colors"
                  >
                    <div>
                      <span className="text-xs font-semibold tracking-wider uppercase text-blue-400 bg-blue-950/50 px-2.5 py-1 rounded-md">
                        {item.category}
                      </span>
                      <h2 className="text-xl font-bold mt-4 text-slate-100">{item.name}</h2>
                    </div>
                    <div className="mt-6 flex items-baseline gap-2">
                      <span className="text-3xl font-extrabold tracking-tight text-white">
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