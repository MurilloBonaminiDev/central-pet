import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  Select,
  Text,
} from '@central-pet/ui';
import { useAuth } from '../AuthProvider';
import { ROLE_LABELS } from '../types';

export function LoginPage() {
  const navigate = useNavigate();
  const { login, pendingTenants, clearPendingTenants } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tenantId, setTenantId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const outcome = await login(email, password);
      if (outcome === 'authenticated') {
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao entrar');
    } finally {
      setLoading(false);
    }
  }

  async function onSelectTenant(event: FormEvent) {
    event.preventDefault();
    if (!tenantId) {
      setError('Selecione a empresa');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const outcome = await login(email, password, tenantId);
      if (outcome === 'authenticated') {
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao selecionar empresa');
    } finally {
      setLoading(false);
    }
  }

  const needsTenant = pendingTenants.length > 0;

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
          <CardTitle>Entrar</CardTitle>
          <CardDescription>
            Autenticação por empresa com controle de perfil.
          </CardDescription>
        </CardHeader>

        {error && (
          <Alert variant="danger" title="Não foi possível autenticar" className="mb-4">
            {error}
          </Alert>
        )}

        {!needsTenant ? (
          <form className="space-y-4" onSubmit={onSubmit}>
            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" fullWidth disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
            <Text size="sm" muted className="text-center">
              <Link to="/esqueci-senha" className="text-[var(--color-fg-link)]">
                Esqueci minha senha
              </Link>
            </Text>
          </form>
        ) : (
          <form className="space-y-4" onSubmit={onSelectTenant}>
            <Alert variant="info" title="Selecione a empresa">
              Sua conta possui acesso a mais de uma empresa.
            </Alert>
            <div>
              <Label htmlFor="tenant">Empresa</Label>
              <Select
                id="tenant"
                value={tenantId}
                onChange={(e) => setTenantId(e.target.value)}
                required
              >
                <option value="">Escolha...</option>
                {pendingTenants.map((tenant) => (
                  <option key={tenant.id} value={tenant.id}>
                    {tenant.name} — {ROLE_LABELS[tenant.role]}
                  </option>
                ))}
              </Select>
            </div>
            <Button type="submit" fullWidth disabled={loading}>
              {loading ? 'Confirmando...' : 'Continuar'}
            </Button>
            <Button
              type="button"
              variant="ghost"
              fullWidth
              onClick={() => {
                clearPendingTenants();
                setTenantId('');
              }}
            >
              Voltar
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
}
