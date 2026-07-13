import { Link } from 'react-router-dom';
import { ROUTES } from '@app/router/paths';
import { CLINIC } from '../data/clinic';
import { ClinicLogo } from './ClinicLogo';

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-brand-950)] text-[var(--color-brand-100)]">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2">
            <ClinicLogo size="md" variant="light" />
            <p className="mt-4 max-w-md text-sm leading-relaxed text-[var(--color-brand-200)]">
              {CLINIC.tagline}. Cuidado veterinário com excelência, carinho e confiança para
              toda a família em São Paulo.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-brand-300)]">
              Navegação
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link to={ROUTES.home} className="home-footer-link">
                  Início
                </Link>
              </li>
              <li>
                <Link to={ROUTES.sobre} className="home-footer-link">
                  Sobre a clínica
                </Link>
              </li>
              <li>
                <Link to={ROUTES.servicos} className="home-footer-link">
                  Serviços
                </Link>
              </li>
              <li>
                <Link to={ROUTES.produtos} className="home-footer-link">
                  Produtos
                </Link>
              </li>
              <li>
                <Link to={ROUTES.contato} className="home-footer-link">
                  Contato
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
              <li>{CLINIC.fullAddress}</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-[var(--color-brand-300)] sm:flex-row">
          <p>
            © {year} {CLINIC.name}. Todos os direitos reservados.
          </p>
          <p>Medicina veterinária com carinho e responsabilidade.</p>
        </div>
      </div>
    </footer>
  );
}
