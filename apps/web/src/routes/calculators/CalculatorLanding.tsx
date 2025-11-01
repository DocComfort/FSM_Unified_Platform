export default function CalculatorLanding() {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6">
      <h2 className="text-2xl font-semibold text-slate-100">Choose a calculator</h2>
      <p className="mt-2 text-sm text-slate-400">
        Select a calculator on the left to load presets, review technician history, and log new runs. Saved
        sessions sync to Supabase when you&apos;re authenticated; otherwise they remain local to this device.
      </p>
    </div>
  );
}
