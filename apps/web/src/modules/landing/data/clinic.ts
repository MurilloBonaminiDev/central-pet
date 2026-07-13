export type ScheduleSlot = {
  days: string;
  hours: string;
  highlight?: boolean;
};

export type TeamMember = {
  name: string;
  role: string;
  crmv?: string;
  bio: string;
  image: string;
};

export type StructureItem = {
  title: string;
  description: string;
};

export type Specialty = {
  title: string;
  description: string;
};

export type Differentiator = {
  title: string;
  description: string;
  icon: 'care' | 'structure' | 'tech' | 'human';
};

export const CLINIC = {
  name: 'Central Pet',
  tagline: 'Clínica Veterinária & Pet Shop',
  slogan: 'Cuidado veterinário premium para quem você mais ama.',
  phone: '5511999999999',
  phoneDisplay: '(11) 99999-9999',
  email: 'contato@centralpet.com.br',
  address: 'Av. Paulista, 1000 — Bela Vista',
  city: 'São Paulo — SP',
  fullAddress: 'Av. Paulista, 1000 — Bela Vista, São Paulo — SP',
  mapQuery: 'Av.+Paulista,+1000,+São+Paulo',
  bannerImage:
    'https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=1200&q=80',
  presentation: {
    title: 'Uma clínica pensada para pets e famílias.',
    paragraphs: [
      'A Central Pet nasceu em 2012 com a missão de oferecer medicina veterinária de qualidade, conveniência e acolhimento. Atendemos cães e gatos com protocolos atualizados, diagnóstico ágil e comunicação transparente com os tutores.',
      'Do check-up de rotina à emergência, nossa equipe está preparada para cuidar do seu pet com excelência, respeito e carinho em cada detalhe.',
    ],
  },
  differentiators: [
    {
      title: 'Atendimento humanizado',
      description:
        'Cada tutor recebe orientação clara, acolhimento e acompanhamento próximo em todas as etapas.',
      icon: 'human',
    },
    {
      title: 'Estrutura completa',
      description:
        'Consultórios, centro cirúrgico, internação, laboratório e pet shop integrados no mesmo endereço.',
      icon: 'structure',
    },
    {
      title: 'Diagnóstico ágil',
      description:
        'Exames laboratoriais e de imagem com laudos rápidos para decisões seguras no tratamento.',
      icon: 'tech',
    },
    {
      title: 'Cuidado contínuo',
      description:
        'Acompanhamento pós-consulta, lembretes de vacinas e plano preventivo personalizado.',
      icon: 'care',
    },
  ] satisfies Differentiator[],
  history: {
    title: 'Nossa história',
    paragraphs: [
      'Fundada por veterinários apaixonados por animais, a Central Pet começou como uma clínica de bairro e cresceu mantendo o mesmo compromisso: tratar cada pet como membro da família.',
      'Ao longo dos anos, ampliamos nossa estrutura, investimos em equipamentos de ponta e formamos uma equipe multidisciplinar. Hoje, somos referência em São Paulo para consultas, cirurgias, internação e bem-estar animal.',
      'Continuamos evoluindo para oferecer o que há de melhor em medicina veterinária, sem perder a proximidade e o carinho que nos tornaram únicos.',
    ],
    founded: '2012',
    petsAttended: '15.000+',
    yearsExperience: '12+',
  },
  team: [
    {
      name: 'Dra. Ana Souza',
      role: 'Médica Veterinária — Diretora Clínica',
      crmv: 'CRMV-SP 12345',
      bio: 'Especialista em clínica médica de cães e gatos, com foco em medicina preventiva.',
      image:
        'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
    },
    {
      name: 'Dr. Carlos Mendes',
      role: 'Médico Veterinário — Cirurgião',
      crmv: 'CRMV-SP 23456',
      bio: 'Atua em cirurgias de tecidos moles e ortopedia, com experiência em procedimentos de alta complexidade.',
      image:
        'https://images.unsplash.com/photo-1612349317150-e413f4a5b16d?auto=format&fit=crop&w=400&q=80',
    },
    {
      name: 'Dra. Beatriz Lima',
      role: 'Médica Veterinária — Dermatologia',
      crmv: 'CRMV-SP 34567',
      bio: 'Referência em alergias, otites e doenças de pele em cães e gatos.',
      image:
        'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=400&q=80',
    },
    {
      name: 'Mariana Costa',
      role: 'Gerente de Atendimento',
      bio: 'Responsável pela experiência do tutor e coordenação da recepção e agendamentos.',
      image:
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    },
  ] satisfies TeamMember[],
  structure: [
    {
      title: 'Consultórios climatizados',
      description: 'Ambientes acolhedores para consultas, retornos e triagem.',
    },
    {
      title: 'Centro cirúrgico',
      description: 'Sala estéril equipada para procedimentos eletivos e de emergência.',
    },
    {
      title: 'Internação monitorada',
      description: 'Boxes individuais com acompanhamento 24h em casos de internação.',
    },
    {
      title: 'Laboratório e imagem',
      description: 'Coleta in-house, raio-X digital e ultrassom para diagnóstico rápido.',
    },
    {
      title: 'Banho e tosa',
      description: 'Estética profissional com produtos hipoalergênicos.',
    },
    {
      title: 'Pet shop integrado',
      description: 'Rações, medicamentos e acessórios selecionados pela equipe.',
    },
  ] satisfies StructureItem[],
  specialties: [
    {
      title: 'Clínica geral',
      description: 'Consultas, check-ups e acompanhamento de rotina para cães e gatos.',
    },
    {
      title: 'Cirurgia',
      description: 'Procedimentos eletivos, castrações e cirurgias corretivas.',
    },
    {
      title: 'Dermatologia',
      description: 'Diagnóstico e tratamento de alergias, infecções e doenças de pele.',
    },
    {
      title: 'Cardiologia',
      description: 'Avaliação cardíaca, ecocardiograma e manejo de doenças cardíacas.',
    },
    {
      title: 'Odontologia',
      description: 'Limpeza, extrações e cuidados com saúde bucal.',
    },
    {
      title: 'Emergência',
      description: 'Plantão nos finais de semana e feriados para casos urgentes.',
    },
  ] satisfies Specialty[],
  schedule: [
    { days: 'Segunda a Sexta', hours: '08:00 — 20:00' },
    { days: 'Sábado', hours: '08:00 — 14:00' },
    { days: 'Domingo & Feriados', hours: 'Plantão de emergência', highlight: true },
  ] satisfies ScheduleSlot[],
} as const;

export function whatsappUrl(message = 'Olá! Gostaria de falar com a Central Pet.') {
  return `https://wa.me/${CLINIC.phone}?text=${encodeURIComponent(message)}`;
}
