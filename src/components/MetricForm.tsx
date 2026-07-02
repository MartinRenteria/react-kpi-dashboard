'use client'; // This component has interactivity, so it's a Client Component

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { createMetric } from '@/actions/metrics';

export function MetricForm() {
    // useActionState takes: (yourActionFunction, initialFormState)
    // It returns: [currentServerState, formActionTriggerWrapper, isPendingBoolean]
    const [state, formAction, isPending] = useActionState(createMetric, null);

    return (
        <form action={formAction} className="space-y-4 p-6 border border-slate-800 bg-slate-900 rounded-2xl w-full max-w-sm">
            <h3 className="text-lg font-bold text-slate-100 mb-2">Track New KPI</h3>

            {/* Global Error Notice */}
            {state?.errors?.global && (
                <p className="text-sm text-red-400 bg-red-950/30 p-2 rounded border border-red-900">{state.errors.global}</p>
            )}

            <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Metric Name</label>
                <input
                    name="name"
                    placeholder="e.g., Active Users"
                    className="w-full p-2.5 mt-1 rounded-lg bg-slate-950 border border-slate-800 text-white text-sm focus:border-blue-500 focus:outline-none"
                />
                {state?.errors?.name && <p className="text-xs text-red-400 mt-1">{state.errors.name[0]}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Value</label>
                    <input
                        name="value"
                        type="number"
                        placeholder="0"
                        className="w-full p-2.5 mt-1 rounded-lg bg-slate-950 border border-slate-800 text-white text-sm focus:border-blue-500 focus:outline-none"
                    />
                    {state?.errors?.value && <p className="text-xs text-red-400 mt-1">{state.errors.value[0]}</p>}
                </div>

                <div>
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Display Type</label>
                    <select
                        name="type"
                        className="w-full p-2.5 mt-1 rounded-lg bg-slate-950 border border-slate-800 text-white text-sm focus:border-blue-500 focus:outline-none"
                    >
                        <option value="count">Count (Standard)</option>
                        <option value="currency">Currency ($)</option>
                        <option value="percentage">Percentage (%)</option>
                    </select>
                </div>
            </div>

            <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Category</label>
                <input
                    name="category"
                    placeholder="e.g., Engineering"
                    className="w-full p-2.5 mt-1 rounded-lg bg-slate-950 border border-slate-800 text-white text-sm focus:border-blue-500 focus:outline-none"
                />
                {state?.errors?.category && <p className="text-xs text-red-400 mt-1">{state.errors.category[0]}</p>}
            </div>

            {/* Embedded Submitting Button */}
            <SubmitButton />
        </form>
    );
}

// Mini sub-component using useFormStatus to seamlessly track pending states from form context
function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full py-2.5 px-4 mt-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/10 transition-all text-sm"
        >
            {pending ? 'Writing to Postgres...' : 'Save Metric'}
        </button>
    );
}