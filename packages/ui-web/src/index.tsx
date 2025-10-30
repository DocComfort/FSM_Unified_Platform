import type { PropsWithChildren } from 'react';
import clsx from 'clsx';

export type StatusCardTone = 'success' | 'info' | 'warning' | 'danger';

const toneStyles: Record<StatusCardTone, string> = {
  success: 'border-emerald-500/60 bg-emerald-500/5 text-emerald-200',
  info: 'border-sky-500/60 bg-sky-500/5 text-sky-200',
  warning: 'border-amber-500/60 bg-amber-500/5 text-amber-100',
  danger: 'border-rose-500/60 bg-rose-500/5 text-rose-100',
};

export function StatusCard({
  tone = 'info',
  title,
  children,
}: PropsWithChildren<{ title: string; tone?: StatusCardTone }>) {
  return (
    <div className={clsx('rounded-2xl border p-6 shadow-sm backdrop-blur-sm', toneStyles[tone])}>
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="mt-3 text-sm leading-6 opacity-90">{children}</div>
    </div>
  );
}
