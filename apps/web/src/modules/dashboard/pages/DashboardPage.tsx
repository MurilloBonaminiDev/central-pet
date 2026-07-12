import { Heading, Text } from '@central-pet/ui';
import { useAuth } from '@modules/auth';
import { AgendaPanel } from '../components/AgendaPanel';
import { AppointmentsChart } from '../components/AppointmentsChart';
import { FinanceChart } from '../components/FinanceChart';
import { KpiCard } from '../components/KpiCard';
import { QuickShortcuts } from '../components/QuickShortcuts';
import { RecentAttendances } from '../components/RecentAttendances';
import { SideCalendar } from '../components/SideCalendar';
import {
  agendaToday,
  appointmentsSeries,
  dashboardFormatters,
  dashboardKpis,
  financeSeries,
  kpiSparks,
  quickShortcuts,
  recentAttendances,
} from '../data/mock';
import { DashboardShell } from '../layouts/DashboardShell';

function IconStethoscope() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 4v6a4 4 0 0 0 8 0V4M10 14v2a4 4 0 0 0 8 0v-3"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <circle cx="18" cy="11" r="2" stroke="currentColor" strokeWidth="1.75" />
    </svg>
  );
}

function IconDroplet() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 3s6 7 6 11a6 6 0 1 1-12 0c0-4 6-11 6-11Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconShield() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 3l8 3v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V6l8-3Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
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

function IconUsers() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="M3.5 19a5.5 5.5 0 0 1 11 0"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <circle cx="17" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="M19.5 19a4.5 4.5 0 0 0-3.2-4.3"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconPaw() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="7" cy="8" r="2" stroke="currentColor" strokeWidth="1.75" />
      <circle cx="12" cy="5.5" r="2" stroke="currentColor" strokeWidth="1.75" />
      <circle cx="17" cy="8" r="2" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="M8 14c0-1.5 1.8-2.5 4-2.5s4 1 4 2.5-2 5-4 5-4-3.5-4-5Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function DashboardPage() {
  const { session } = useAuth();
  const todayLabel = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
  }).format(new Date());
  const firstName = session?.full_name?.split(' ')[0] ?? 'equipe';
  const activityToday =
    dashboardKpis.consultasHoje + dashboardKpis.banhosHoje + dashboardKpis.vacinasHoje;

  return (
    <DashboardShell title="Dashboard" subtitle={`Hoje · ${todayLabel}`}>
      <section className="cp-dash-rise relative mb-7 overflow-hidden rounded-[1.25rem] border border-white/10 bg-[var(--color-sidebar-bg)] text-[var(--color-sidebar-fg)] shadow-[var(--shadow-md)]">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 80% 90% at 0% 50%, color-mix(in srgb, var(--color-brand-400) 35%, transparent), transparent 55%), radial-gradient(ellipse 70% 80% at 100% 0%, color-mix(in srgb, var(--color-accent-400) 28%, transparent), transparent 50%)',
          }}
        />
        <div className="cp-hero-sheen pointer-events-none absolute inset-0" aria-hidden />
        <div className="relative grid gap-6 p-6 md:grid-cols-[1.4fr_1fr] md:p-8 lg:p-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-sidebar-muted)]">
              Central Pet
            </p>
            <Heading level={2} className="mt-2 text-3xl text-[var(--color-sidebar-fg)] md:text-5xl">
              Bom dia, {firstName}
            </Heading>
            <Text className="mt-3 max-w-xl text-[var(--color-sidebar-muted)]">
              Visão premium da clínica: agenda, receita e ritmo de atendimento em tempo real de
              demonstração.
            </Text>
            <div className="mt-6 flex flex-wrap gap-3">
              <div className="rounded-[var(--radius-lg)] bg-white/10 px-4 py-3 backdrop-blur-sm">
                <p className="text-[11px] uppercase tracking-[0.08em] text-[var(--color-sidebar-muted)]">
                  Movimentações hoje
                </p>
                <p className="font-display text-2xl font-semibold">{activityToday}</p>
              </div>
              <div className="rounded-[var(--radius-lg)] bg-white/10 px-4 py-3 backdrop-blur-sm">
                <p className="text-[11px] uppercase tracking-[0.08em] text-[var(--color-sidebar-muted)]">
                  Receita do dia
                </p>
                <p className="font-display text-2xl font-semibold">
                  {dashboardFormatters.formatBRL(dashboardKpis.receitaDia)}
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-end gap-3 md:items-end">
            <div className="w-full max-w-sm rounded-[var(--radius-xl)] border border-white/15 bg-black/20 p-4 backdrop-blur-md">
              <p className="text-xs text-[var(--color-sidebar-muted)]">Meta mensal</p>
              <div className="mt-2 flex items-end justify-between gap-3">
                <p className="font-display text-3xl font-semibold">78%</p>
                <p className="text-sm text-[var(--color-sidebar-muted)]">
                  {dashboardFormatters.formatBRL(dashboardKpis.receitaMensal)}
                </p>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-[var(--radius-md)] bg-white/15">
                <div
                  className="h-full rounded-[var(--radius-md)] bg-gradient-to-r from-[var(--color-accent-300)] to-[var(--color-brand-300)]"
                  style={{ width: '78%' }}
                />
              </div>
            </div>
            <p className="text-xs text-[var(--color-sidebar-muted)]">Atualizado agora · demo</p>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_21rem]">
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <KpiCard
              label="Consultas hoje"
              value={String(dashboardKpis.consultasHoje)}
              delta="+3 vs ontem"
              hint="Sala clínica"
              accent="brand"
              icon={<IconStethoscope />}
              spark={kpiSparks.consultas}
              delayMs={40}
            />
            <KpiCard
              label="Banhos hoje"
              value={String(dashboardKpis.banhosHoje)}
              delta="2 em fila"
              hint="Banho e tosa"
              accent="accent"
              icon={<IconDroplet />}
              spark={kpiSparks.banhos}
              delayMs={80}
            />
            <KpiCard
              label="Vacinas hoje"
              value={String(dashboardKpis.vacinasHoje)}
              delta="Protocolo ok"
              hint="Imunização"
              accent="success"
              icon={<IconShield />}
              spark={kpiSparks.vacinas}
              delayMs={120}
            />
            <KpiCard
              label="Receita do dia"
              value={dashboardFormatters.formatBRL(dashboardKpis.receitaDia)}
              delta="Caixa aberto"
              hint="Financeiro"
              accent="warning"
              icon={<IconCash />}
              spark={kpiSparks.receitaDia}
              delayMs={160}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <KpiCard
              label="Receita mensal"
              value={dashboardFormatters.formatBRL(dashboardKpis.receitaMensal)}
              delta="Meta 78%"
              accent="brand"
              icon={<IconCash />}
              spark={kpiSparks.receitaMensal}
              delayMs={200}
            />
            <KpiCard
              label="Clientes"
              value={dashboardKpis.clientes.toLocaleString('pt-BR')}
              delta="Base ativa"
              accent="info"
              icon={<IconUsers />}
              spark={kpiSparks.clientes}
              delayMs={240}
            />
            <KpiCard
              label="Pets"
              value={dashboardKpis.pets.toLocaleString('pt-BR')}
              delta="Cadastrados"
              accent="success"
              icon={<IconPaw />}
              spark={kpiSparks.pets}
              delayMs={280}
            />
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <FinanceChart
              title="Gráfico financeiro"
              subtitle="Receita dos últimos 7 dias"
              data={financeSeries}
            />
            <AppointmentsChart
              title="Gráfico de consultas"
              subtitle="Volume semanal de atendimentos clínicos"
              data={appointmentsSeries}
            />
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
            <RecentAttendances items={recentAttendances} />
            <QuickShortcuts items={quickShortcuts} />
          </div>

          <AgendaPanel items={agendaToday} />
        </div>

        <aside className="space-y-6 xl:sticky xl:top-6 xl:self-start">
          <SideCalendar />
          <section className="cp-dash-rise relative overflow-hidden rounded-[var(--radius-xl)] border border-white/10 bg-[var(--color-sidebar-bg)] p-5 text-[var(--color-sidebar-fg)] shadow-[var(--shadow-md)]">
            <div className="cp-hero-sheen pointer-events-none absolute inset-0 opacity-40" aria-hidden />
            <p className="relative text-xs font-semibold uppercase tracking-[0.1em] text-[var(--color-sidebar-muted)]">
              Destaque do dia
            </p>
            <h3 className="relative mt-2 font-display text-2xl font-semibold leading-tight">
              Clínica em ritmo alto
            </h3>
            <p className="relative mt-2 text-sm text-[var(--color-sidebar-muted)]">
              {activityToday} movimentações previstas até o fim do expediente.
            </p>
            <div className="relative mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-[var(--radius-md)] bg-white/10 px-3 py-2">
                <p className="text-xs text-[var(--color-sidebar-muted)]">Ocupação</p>
                <p className="font-display text-xl font-semibold">86%</p>
              </div>
              <div className="rounded-[var(--radius-md)] bg-white/10 px-3 py-2">
                <p className="text-xs text-[var(--color-sidebar-muted)]">Ticket médio</p>
                <p className="font-display text-xl font-semibold">R$ 168</p>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </DashboardShell>
  );
}
