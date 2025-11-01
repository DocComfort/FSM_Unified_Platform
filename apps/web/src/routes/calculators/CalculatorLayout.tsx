import { NavLink, Outlet } from 'react-router-dom';

const calculators = [
  { to: '/calculators/airflow', label: 'Airflow' },
  { to: '/calculators/duct', label: 'Duct' },
  { to: '/calculators/manual-j', label: 'Manual J' },
  { to: '/calculators/filter', label: 'Filter' },
];

export default function CalculatorLayout() {
  return (
    <div className="grid gap-6 lg:grid-cols-[220px,1fr]">
      <aside className="space-y-4 rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Calculators</h2>
          <p className="mt-1 text-xs text-slate-500">
            Choose a tool to load technician presets and log new runs.
          </p>
        </div>
        <nav className="flex flex-col gap-2">
          {calculators.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
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
      </aside>
      <section className="space-y-6">
        <Outlet />
      </section>
    </div>
  );
}
