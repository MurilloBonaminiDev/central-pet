import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import {
  Alert,
  Button,
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Text,
} from '@central-pet/ui';
import { authApi } from '../api';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [devToken, setDevToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setDevToken(null);
    setLoading(true);
    try {
      const result = await authApi.forgotPassword(email);
      setMessage(result.message);
      if (result.reset_token) setDevToken(result.reset_token);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao solicitar redefinição');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)] px-4 py-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Esqueci minha senha</CardTitle>
          <CardDescription>
            Informe o e-mail da conta. Se existir, enviaremos o link de redefinição.
          </CardDescription>
        </CardHeader>

        {error && (
          <Alert variant="danger" className="mb-4">
            {error}
          </Alert>
        )}
        {message && (
          <Alert variant="success" className="mb-4">
            {message}
          </Alert>
        )}
        {devToken && (
          <Alert variant="info" title="Token de desenvolvimento" className="mb-4">
            <Text size="sm" className="break-all">
              {devToken}
            </Text>
            <Text size="sm" muted className="mt-2">
              Em produção este token seria enviado por e-mail.
            </Text>
            <Link
              to={`/redefinir-senha?token=${encodeURIComponent(devToken)}`}
              className="mt-2 inline-block text-sm text-[var(--color-fg-link)]"
            >
              Ir para redefinir senha
            </Link>
          </Alert>
        )}

        <form className="space-y-4" onSubmit={onSubmit}>
          <div>
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <Button type="submit" fullWidth disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar instruções'}
          </Button>
          <Text size="sm" muted className="text-center">
            <Link to="/login" className="text-[var(--color-fg-link)]">
              Voltar ao login
            </Link>
          </Text>
        </form>
      </Card>
    </div>
  );
}
