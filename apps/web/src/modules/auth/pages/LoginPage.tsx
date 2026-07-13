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
import { ROUTES } from '@app/router/paths';

/** Destination after login — wire real auth here later. */
const POST_LOGIN_REDIRECT = ROUTES.cliente.root;

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState<string | null>(null);

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (!email.includes('@')) {
      setError('Informe um e-mail válido');
      return;
    }
    if (senha.length < 1) {
      setError('Informe a senha');
      return;
    }

    // No authentication yet — only prepare the future redirect.
    navigate(POST_LOGIN_REDIRECT, { replace: true });
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
          <CardTitle>Entrar</CardTitle>
          <CardDescription>Acesse a área do cliente com seu e-mail e senha.</CardDescription>
        </CardHeader>

        {error && (
          <Alert variant="danger" title="Não foi possível entrar" className="mb-4">
            {error}
          </Alert>
        )}

        <form className="space-y-4" onSubmit={onSubmit}>
          <div>
            <Label>Email</Label>
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
            <Label>Senha</Label>
            <Input
              id="senha"
              type="password"
              autoComplete="current-password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>

          <Button type="submit" fullWidth>
            Entrar
          </Button>

          <Text size="sm" muted className="text-center">
            <Link to={ROUTES.cadastro} className="text-[var(--color-fg-link)]">
              Cadastrar
            </Link>
          </Text>

          <Text size="sm" muted className="text-center">
            <Link to="/esqueci-senha" className="text-[var(--color-fg-link)]">
              Esqueci minha senha
            </Link>
          </Text>
        </form>
      </Card>
    </div>
  );
}
