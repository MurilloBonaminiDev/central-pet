/** Central Pet — route path constants. */
export const ROUTES = {
  home: '/',
  sobre: '/sobre',
  servicos: '/servicos',
  produtos: '/produtos',
  equipe: '/equipe',
  contato: '/contato',
  agendamento: '/agendamento',
  login: '/login',
  cadastro: '/cadastro',
  cliente: {
    root: '/cliente',
    dashboard: '/cliente/dashboard',
    pets: '/cliente/pets',
    agendamentos: '/cliente/agendamentos',
    vacinas: '/cliente/vacinas',
    compras: '/cliente/compras',
    perfil: '/cliente/perfil',
  },
  admin: {
    root: '/admin',
    login: '/admin/login',
    dashboard: '/admin/dashboard',
    agendamentos: '/admin/agendamentos',
    financeiro: '/admin/financeiro',
    clientes: '/admin/clientes',
  },
} as const;

/** Staff roles allowed into the clinic admin area. */
export const ADMIN_ROLES = [
  'administrator',
  'veterinarian',
  'reception',
  'financial',
  'grooming',
] as const;
