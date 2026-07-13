import { Link } from 'react-router-dom';
import { ROUTES } from '@app/router/paths';
import { CLINIC } from '../data/clinic';

export function HomeFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-brand-950)] text-[var(--color-brand-100)]">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2">
            <p className="font-display text-2xl font-semibold text-white">{CLINIC.name}</p>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-[var(--color-brand-200)]">
              {CLINIC.tagline}. Cuidado veterinário com excelência, carinho e
              confiança para toda a família.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-brand-300)]">
              Links
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a href="#inicio" className="home-footer-link">
                  Início
                </a>
              </li>
              <li>
                <a href="#sobre" className="home-footer-link">
                  Sobre
                </a>
              </li>
              <li>
                <Link to={ROUTES.agendamento} className="home-footer-link">
                  Agendamento
                </Link>
              </li>
              <li>
                <Link to={ROUTES.login} className="home-footer-link">
                  Área do Cliente
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-brand-300)]">
              Contato
            </p>
            <ul className="mt-4 space-y-2 text-sm text-[var(--color-brand-200)]">
              <li>{CLINIC.phoneDisplay}</li>
              <li>{CLINIC.email}</li>
              <li>{CLINIC.address}</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-[var(--color-brand-300)] sm:flex-row">
          <p>© {year} {CLINIC.name}. Todos os direitos reservados.</p>
          <p>Desenvolvido com carinho para pets e tutores.</p>
        </div>
      </div>
    </footer>
  );
}
