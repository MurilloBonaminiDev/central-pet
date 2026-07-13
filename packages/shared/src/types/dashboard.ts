/** Admin dashboard stats from API (no mock data). */
export type ChartPoint = {
  label: string;
  value: number;
};

export type DashboardKpis = {
  pending_appointments: number;
  today_appointments: number;
  total_clients: number;
  completed_services: number;
  monthly_revenue_cents: number;
};

export type DashboardStats = {
  kpis: DashboardKpis;
  attendances_by_month: ChartPoint[];
  top_services: ChartPoint[];
  revenue_by_month: ChartPoint[];
};
