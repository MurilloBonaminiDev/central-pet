import { Heading, Text } from '@central-pet/ui';
import { useAuth } from '@modules/auth';
import { formatBRLFromCents } from '../api';
import { AppointmentsChart } from '../components/AppointmentsChart';
import { FinanceChart } from '../components/FinanceChart';
import { KpiCard } from '../components/KpiCard';
import { TopServicesChart } from '../components/TopServicesChart';
import { useDashboardStats } from '../hooks/useDashboardStats';
import '../styles/dashboard.css';

function IconCalendar() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.75" />
      <path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

function IconClock() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.75" />
      <path d="M12 8v5l3 2" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

function IconUsers() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.75" />
      <path d="M3.5 19a5.5 5.5 0 0 1 11 0" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      <circle cx="17" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.75" />
      <path d="M19.5 19a4.5 4.5 0 0 0-3.2-4.3" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.75" />
      <path d="M8.5 12.5l2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconCash() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.75" />
      <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.75" />
    </svg>
  );
}

export function DashboardPage() {
  const { session } = useAuth();
  const { stats, loading, error, refetch } = useDashboardStats();
  const firstName = session?.full_name?.split(' ')[0] ?? 'equipe';

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="h-32 animate-pulse rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)]"
          />
        ))}
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-6 py-12 text-center">
        <p className="font-display text-xl font-semibold text-[var(--color-fg)]">
          Não foi possível carregar a dashboard
        </p>
        <p className="mt-2 text-sm text-[var(--color-fg-muted)]">{error}</p>
        <button
          type="button"
          onClick={() => void refetch()}
          className="mt-6 inline-flex h-10 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-brand-600)] px-5 text-sm font-semibold text-[var(--color-primary-fg)] hover:bg-[var(--color-brand-700)]"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  const { kpis } = stats;

  return (
    <div className="space-y-6">
      <section className="cp-dash-rise relative overflow-hidden rounded-[1.25rem] border border-white/10 bg-[var(--color-sidebar-bg)] text-[var(--color-sidebar-fg)] shadow-[var(--shadow-md)]">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 80% 90% at 0% 50%, color-mix(in srgb, var(--color-brand-400) 35%, transparent), transparent 55%), radial-gradient(ellipse 70% 80% at 100% 0%, color-mix(in srgb, var(--color-accent-400) 28%, transparent), transparent 50%)',
          }}
        />
        <div className="relative p-6 md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-sidebar-muted)]">
            {session?.tenant_name ?? 'Central Pet'}
          </p>
          <Heading level={2} className="mt-2 text-3xl text-[var(--color-sidebar-fg)] md:text-4xl">
            Olá, {firstName}
          </Heading>
          <Text className="mt-2 max-w-2xl text-[var(--color-sidebar-muted)]">
            Visão geral com dados reais da clínica — agendamentos, clientes, serviços e faturamento.
          </Text>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <KpiCard
          label="Agendamentos pendentes"
          value={String(kpis.pending_appointments)}
          hint="Aguardando confirmação"
          accent="warning"
          icon={<IconClock />}
          delayMs={40}
        />
        <KpiCard
          label="Agendamentos do dia"
          value={String(kpis.today_appointments)}
          hint="Para hoje"
          accent="brand"
          icon={<IconCalendar />}
          delayMs={80}
        />
        <KpiCard
          label="Total de clientes"
          value={kpis.total_clients.toLocaleString('pt-BR')}
          hint="Tutores únicos"
          accent="info"
          icon={<IconUsers />}
          delayMs={120}
        />
        <KpiCard
          label="Serviços realizados"
          value={String(kpis.completed_services)}
          hint="Status concluído"
          accent="success"
          icon={<IconCheck />}
          delayMs={160}
        />
        <KpiCard
          label="Faturamento mensal"
          value={formatBRLFromCents(kpis.monthly_revenue_cents)}
          hint="Mês atual"
          accent="accent"
          icon={<IconCash />}
          delayMs={200}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <AppointmentsChart
          title="Atendimentos por mês"
          subtitle="Serviços concluídos nos últimos 12 meses"
          data={stats.attendances_by_month}
        />
        <FinanceChart
          title="Receita mensal"
          subtitle="Faturamento de serviços concluídos"
          data={stats.revenue_by_month}
        />
      </div>

      <TopServicesChart
        title="Serviços mais vendidos"
        subtitle="Ranking por quantidade de atendimentos concluídos"
        data={stats.top_services}
      />
    </div>
  );
}
