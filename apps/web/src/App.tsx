import { useState } from 'react';
import { StatusCard } from '@fsm/ui-web';

export default function App() {
  const [status] = useState('Unified Platform Scaffold Ready');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex max-w-4xl flex-col gap-6 px-6 py-16">
        <header className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-widest text-emerald-400">
            FSM Unified Platform
          </p>
          <h1 className="text-3xl font-semibold sm:text-4xl">Web application scaffold online.</h1>
          <p className="text-base text-slate-300">
            This starter integrates Vite, React, TypeScript, TanStack Query, Tailwind, and our
            shared workspace tooling. Replace this block with dashboard routing and modules as
            features arrive.
          </p>
        </header>

        <StatusCard tone="success" title="Status">
          <p className="text-slate-100">{status}</p>
        </StatusCard>

        <div className="grid gap-4 sm:grid-cols-2">
          <StatusCard tone="info" title="Next Steps">
            <ul className="space-y-2">
              <li>Configure Supabase env vars (`.env.local`).</li>
              <li>Import shared UI + domain modules.</li>
              <li>Wire routes and authentication flows.</li>
            </ul>
          </StatusCard>
          <StatusCard tone="warning" title="Key Tools">
            <ul className="space-y-2">
              <li>Vite + TypeScript</li>
              <li>Tailwind CSS</li>
              <li>TanStack Query</li>
            </ul>
          </StatusCard>
        </div>
      </div>
    </div>
  );
}
