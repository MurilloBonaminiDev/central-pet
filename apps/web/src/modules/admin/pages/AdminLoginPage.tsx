import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Alert,
  Button,
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  Heading,
  Input,
  Label,
  Text,
} from '@central-pet/ui';
import { ROUTES } from '@app/router/paths';
import { ROLE_LABELS, useAuth, type TenantOption } from '@modules/auth';

export function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, pendingTenants, clearPendingTenants } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const from =
    (location.state as { from?: string } | null)?.from &&
    String((location.state as { from?: string }).from).startsWith('/admin')
      ? String((location.state as { from?: string }).from)
      : ROUTES.admin.dashboard;

  async function completeLogin(tenantId?: string) {
    setError(null);
    setSubmitting(true);
    try {
      const outcome = await login(email.trim(), password, tenantId);
      if (outcome === 'tenant_selection') {
        return;
      }
      clearPendingTenants();
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível entrar');
    } finally {
      setSubmitting(false);
    }
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!email.includes('@')) {
      setError('Informe um e-mail válido');
      return;
    }
    if (password.length < 1) {
      setError('Informe a senha');
      return;
    }
    await completeLogin();
  }

  async function onSelectTenant(tenant: TenantOption) {
    await completeLogin(tenant.id);
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 10% 20%, color-mix(in srgb, var(--color-brand-400) 22%, transparent), transparent), radial-gradient(ellipse 70% 50% at 90% 80%, color-mix(in srgb, var(--color-accent-400) 18%, transparent), transparent), var(--color-bg)',
        }}
      />

      <Card className="relative z-10 w-full max-w-md">
        <CardHeader>
          <Heading level={1} className="text-3xl">
            Central Pet
          </Heading>
          <CardTitle>Área administrativa</CardTitle>
          <CardDescription>
            Acesso restrito à equipe da clínica. Entre com seu e-mail e senha autorizados.
          </CardDescription>
        </CardHeader>

        {error ? (
          <Alert variant="danger" title="Não foi possível entrar" className="mb-4">
            {error}
          </Alert>
        ) : null}

        {pendingTenants.length > 0 ? (
          <div className="space-y-3">
            <Text size="sm" muted>
              Selecione a clínica para continuar:
            </Text>
            <ul className="space-y-2">
              {pendingTenants.map((tenant) => (
                <li key={tenant.id}>
                  <Button
                    type="button"
                    variant="secondary"
                    fullWidth
                    disabled={submitting}
                    onClick={() => void onSelectTenant(tenant)}
                  >
                    {tenant.name} · {ROLE_LABELS[tenant.role]}
                  </Button>
                </li>
              ))}
            </ul>
            <Button
              type="button"
              variant="ghost"
              fullWidth
              onClick={() => {
                clearPendingTenants();
                setPassword('');
              }}
            >
              Voltar
            </Button>
          </div>
        ) : (
          <form className="space-y-4" onSubmit={(e) => void onSubmit(e)}>
            <div>
              <Label htmlFor="admin-email">E-mail</Label>
              <Input
                id="admin-email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="admin-password">Senha</Label>
              <Input
                id="admin-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" fullWidth disabled={submitting}>
              {submitting ? 'Entrando...' : 'Entrar'}
            </Button>

            <Text size="sm" muted className="text-center">
              <Link to={ROUTES.home} className="text-[var(--color-fg-link)]">
                Voltar ao site
              </Link>
            </Text>
          </form>
        )}
      </Card>
    </div>
  );
}
