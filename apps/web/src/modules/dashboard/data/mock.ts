export type DashboardKpis = {
  consultasHoje: number;
  banhosHoje: number;
  vacinasHoje: number;
  receitaDia: number;
  receitaMensal: number;
  clientes: number;
  pets: number;
};

export type AgendaItem = {
  id: string;
  time: string;
  title: string;
  pet: string;
  tutor: string;
  type: 'consulta' | 'banho' | 'vacina' | 'retorno';
};

export type AttendanceItem = {
  id: string;
  pet: string;
  tutor: string;
  service: string;
  professional: string;
  time: string;
  status: 'concluido' | 'em_andamento' | 'aguardando';
};

export type ChartPoint = {
  label: string;
  value: number;
};

export type Shortcut = {
  id: string;
  label: string;
  description: string;
  tone: 'brand' | 'accent' | 'info' | 'success';
};

export type CalendarDay = {
  date: number;
  inMonth: boolean;
  isToday: boolean;
  hasEvent: boolean;
};

function formatBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

export const dashboardFormatters = { formatBRL };

export const dashboardKpis: DashboardKpis = {
  consultasHoje: 18,
  banhosHoje: 11,
  vacinasHoje: 7,
  receitaDia: 4280.5,
  receitaMensal: 86420.75,
  clientes: 1248,
  pets: 1893,
};

export const kpiSparks = {
  consultas: [12, 14, 13, 16, 15, 17, 18],
  banhos: [6, 8, 7, 9, 10, 9, 11],
  vacinas: [4, 5, 3, 6, 5, 6, 7],
  receitaDia: [2.1, 2.8, 3.2, 3.0, 3.6, 4.0, 4.3],
  receitaMensal: [62, 68, 71, 74, 78, 82, 86],
  clientes: [1180, 1195, 1210, 1222, 1230, 1240, 1248],
  pets: [1760, 1785, 1810, 1835, 1855, 1875, 1893],
};

export const financeSeries: ChartPoint[] = [
  { label: 'Seg', value: 3200 },
  { label: 'Ter', value: 4100 },
  { label: 'Qua', value: 3800 },
  { label: 'Qui', value: 5200 },
  { label: 'Sex', value: 6100 },
  { label: 'Sáb', value: 4700 },
  { label: 'Dom', value: 2900 },
];

export const appointmentsSeries: ChartPoint[] = [
  { label: 'Seg', value: 14 },
  { label: 'Ter', value: 18 },
  { label: 'Qua', value: 16 },
  { label: 'Qui', value: 22 },
  { label: 'Sex', value: 25 },
  { label: 'Sáb', value: 19 },
  { label: 'Dom', value: 8 },
];

export const agendaToday: AgendaItem[] = [
  {
    id: '1',
    time: '08:30',
    title: 'Consulta clínica',
    pet: 'Thor',
    tutor: 'Ana Souza',
    type: 'consulta',
  },
  {
    id: '2',
    time: '09:15',
    title: 'Banho e tosa',
    pet: 'Luna',
    tutor: 'Carlos Lima',
    type: 'banho',
  },
  {
    id: '3',
    time: '10:00',
    title: 'Vacina V10',
    pet: 'Mel',
    tutor: 'Beatriz Nunes',
    type: 'vacina',
  },
  {
    id: '4',
    time: '11:20',
    title: 'Retorno pós-cirurgia',
    pet: 'Bob',
    tutor: 'Diego Alves',
    type: 'retorno',
  },
  {
    id: '5',
    time: '14:00',
    title: 'Consulta dermatológica',
    pet: 'Nina',
    tutor: 'Helena Costa',
    type: 'consulta',
  },
  {
    id: '6',
    time: '15:40',
    title: 'Banho higiênico',
    pet: 'Max',
    tutor: 'Igor Santos',
    type: 'banho',
  },
];

export const recentAttendances: AttendanceItem[] = [
  {
    id: 'a1',
    pet: 'Fred',
    tutor: 'Juliana Rocha',
    service: 'Consulta geral',
    professional: 'Dra. Marina',
    time: 'há 12 min',
    status: 'concluido',
  },
  {
    id: 'a2',
    pet: 'Pipoca',
    tutor: 'Paulo Mendes',
    service: 'Banho completo',
    professional: 'Equipe Tosa',
    time: 'há 28 min',
    status: 'em_andamento',
  },
  {
    id: 'a3',
    pet: 'Amora',
    tutor: 'Renata Dias',
    service: 'Vacina antirrábica',
    professional: 'Dr. Felipe',
    time: 'há 45 min',
    status: 'concluido',
  },
  {
    id: 'a4',
    pet: 'Ziggy',
    tutor: 'Sérgio Prado',
    service: 'Consulta ortopédica',
    professional: 'Dra. Marina',
    time: 'há 1 h',
    status: 'aguardando',
  },
  {
    id: 'a5',
    pet: 'Jade',
    tutor: 'Tatiane Melo',
    service: 'Tosa higiênica',
    professional: 'Equipe Tosa',
    time: 'há 1 h 20',
    status: 'concluido',
  },
];

export const quickShortcuts: Shortcut[] = [
  {
    id: 's1',
    label: 'Nova consulta',
    description: 'Abrir agenda clínica',
    tone: 'brand',
  },
  {
    id: 's2',
    label: 'Banho e tosa',
    description: 'Enfileirar pet',
    tone: 'accent',
  },
  {
    id: 's3',
    label: 'Registrar vacina',
    description: 'Protocolo rápido',
    tone: 'success',
  },
  {
    id: 's4',
    label: 'Receber pagamento',
    description: 'Caixa do dia',
    tone: 'info',
  },
];

export function buildMonthCalendar(base = new Date()): CalendarDay[] {
  const year = base.getFullYear();
  const month = base.getMonth();
  const first = new Date(year, month, 1);
  const startWeekday = (first.getDay() + 6) % 7; // Monday-first
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();
  const today = new Date();
  const eventDays = new Set([3, 7, 12, 15, 18, 22, 27]);

  const cells: CalendarDay[] = [];

  for (let i = startWeekday - 1; i >= 0; i -= 1) {
    cells.push({
      date: prevMonthDays - i,
      inMonth: false,
      isToday: false,
      hasEvent: false,
    });
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const isToday =
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear();
    cells.push({
      date: day,
      inMonth: true,
      isToday,
      hasEvent: eventDays.has(day),
    });
  }

  while (cells.length % 7 !== 0) {
    cells.push({
      date: cells.length - (startWeekday + daysInMonth) + 1,
      inMonth: false,
      isToday: false,
      hasEvent: false,
    });
  }

  return cells;
}

export const monthLabel = new Intl.DateTimeFormat('pt-BR', {
  month: 'long',
  year: 'numeric',
}).format(new Date());
