'use client';
import { useUIStore } from '@/store/useUIStore';
import { MetricForm } from './MetricForm';

export function FormDrawer() {
    // Read our global layout state and close trigger function from the Zustand store
    const { isFormOpen, closeForm } = useUIStore();

    if (!isFormOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fade-in">
            {/* Backdrop overlay listener to close when clicking outside */}
            <div className="absolute inset-0" onClick={closeForm} />

            {/* Drawer Body Panel */}
            <div className="relative w-full max-w-md h-full bg-slate-900 border-l border-slate-800 p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
                <div>
                    <header className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-slate-100">Configure KPI</h2>
                        <button
                            onClick={closeForm}
                            className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
                        >
                            ✕
                        </button>
                    </header>

                    {/* Injecting our form code inside the modular drawer container */}
                    <MetricForm />
                </div>
            </div>
        </div>
    );
}