'use client';

import { useUIStore } from '@/store/useUIStore';

export function NewMetricButton() {
    // Pull the single function needed from our store slice
    const openForm = useUIStore((state) => state.openForm);

    return (
        <button
            onClick={openForm}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-sm font-semibold shadow-lg shadow-blue-500/20 transition-all active:scale-95"
        >
            + Add Metric
        </button>
    );
}