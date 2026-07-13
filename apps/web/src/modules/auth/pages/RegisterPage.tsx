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
  Text,
} from '@central-pet/ui';
import { useAuth } from '../AuthProvider';

export function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [clinicName, setClinicName] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }
    if (password.length < 8) {
      setError('A senha deve ter pelo menos 8 caracteres');
      return;
    }

    setLoading(true);
    try {
      await register({
        clinicName,
        fullName,
        email,
        password,
      });
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao criar conta');
    } finally {
      setLoading(false);
    }
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
          <CardTitle>Criar conta</CardTitle>
          <CardDescription>
            Cadastre sua clínica e comece como administrador.
          </CardDescription>
        </CardHeader>

        {error && (
          <Alert variant="danger" title="Não foi possível criar a conta" className="mb-4">
            {error}
          </Alert>
        )}

        <form className="space-y-4" onSubmit={onSubmit}>
          <div>
            <Label htmlFor="clinicName">Nome da clínica</Label>
            <Input
              id="clinicName"
              autoComplete="organization"
              value={clinicName}
              onChange={(e) => setClinicName(e.target.value)}
              required
              minLength={2}
            />
          </div>
          <div>
            <Label htmlFor="fullName">Seu nome</Label>
            <Input
              id="fullName"
              autoComplete="name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              minLength={2}
            />
          </div>
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
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
          </div>
          <div>
            <Label htmlFor="confirmPassword">Confirmar senha</Label>
            <Input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
            />
          </div>
          <Button type="submit" fullWidth disabled={loading}>
            {loading ? 'Criando conta...' : 'Criar conta'}
          </Button>
          <Text size="sm" muted className="text-center">
            Já tem conta?{' '}
            <Link to="/login" className="text-[var(--color-fg-link)]">
              Entrar
            </Link>
          </Text>
        </form>
      </Card>
    </div>
  );
}
