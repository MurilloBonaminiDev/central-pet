import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
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

function onlyDigits(value: string) {
  return value.replace(/\D/g, '');
}

function formatCpf(value: string) {
  const digits = onlyDigits(value).slice(0, 11);
  return digits
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

function formatPhone(value: string) {
  const digits = onlyDigits(value).slice(0, 11);
  if (digits.length <= 10) {
    return digits
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2');
  }
  return digits
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2');
}

export function CadastroPage() {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSuccess(false);

    if (nome.trim().length < 2) {
      setError('Informe o nome completo');
      return;
    }
    if (onlyDigits(cpf).length !== 11) {
      setError('Informe um CPF válido com 11 dígitos');
      return;
    }
    if (onlyDigits(telefone).length < 10) {
      setError('Informe um telefone válido');
      return;
    }
    if (!email.includes('@')) {
      setError('Informe um e-mail válido');
      return;
    }
    if (senha.length < 8) {
      setError('A senha deve ter pelo menos 8 caracteres');
      return;
    }
    if (senha !== confirmarSenha) {
      setError('As senhas não coincidem');
      return;
    }

    // UI only — no backend connection
    setSuccess(true);
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
          <CardTitle>Cadastro</CardTitle>
          <CardDescription>
            Crie sua conta de tutor para acessar a área do cliente.
          </CardDescription>
        </CardHeader>

        {error && (
          <Alert variant="danger" title="Não foi possível criar a conta" className="mb-4">
            {error}
          </Alert>
        )}

        {success && (
          <Alert variant="success" title="Conta pronta (demonstração)" className="mb-4">
            Formulário validado localmente. A conexão com o backend será feita depois.
          </Alert>
        )}

        <form className="space-y-4" onSubmit={onSubmit}>
          <div>
            <Label>Nome</Label>
            <Input
              id="nome"
              autoComplete="name"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              minLength={2}
            />
          </div>

          <div>
            <Label>CPF</Label>
            <Input
              id="cpf"
              inputMode="numeric"
              autoComplete="off"
              placeholder="000.000.000-00"
              value={cpf}
              onChange={(e) => setCpf(formatCpf(e.target.value))}
              required
            />
          </div>

          <div>
            <Label>Telefone</Label>
            <Input
              id="telefone"
              type="tel"
              autoComplete="tel"
              placeholder="(11) 99999-9999"
              value={telefone}
              onChange={(e) => setTelefone(formatPhone(e.target.value))}
              required
            />
          </div>

          <div>
            <Label>Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
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
              autoComplete="new-password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              minLength={8}
            />
          </div>

          <div>
            <Label>Confirmar senha</Label>
            <Input
              id="confirmar-senha"
              type="password"
              autoComplete="new-password"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              required
              minLength={8}
            />
          </div>

          <Button type="submit" fullWidth>
            Criar Conta
          </Button>

          <Text size="sm" muted className="text-center">
            Já tem conta?{' '}
            <Link to={ROUTES.login} className="text-[var(--color-fg-link)]">
              Entrar
            </Link>
          </Text>
        </form>
      </Card>
    </div>
  );
}
