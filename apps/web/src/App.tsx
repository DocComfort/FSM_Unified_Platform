import { NavLink, Outlet } from 'react-router-dom';

const mainNav = [
  { to: '/', label: 'Overview' },
  { to: '/calculators', label: 'Calculators' },
  { to: '/reports', label: 'Reports' },
];

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10 lg:flex-row">
        <aside className="lg:w-64">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6 shadow-lg shadow-emerald-500/5">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400">
                FSM Unified Platform
              </p>
              <h1 className="text-2xl font-semibold text-slate-100">Technician Hub</h1>
              <p className="text-xs text-slate-400">
                Navigate calculators, AI telemetry, and reporting views tailored for field teams.
              </p>
            </div>

            <nav className="mt-6 flex flex-col gap-2">
              {mainNav.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    [
                      'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-400/40'
                        : 'text-slate-300 hover:bg-slate-800/60 hover:text-slate-100',
                    ].join(' ')
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
        </aside>

        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
