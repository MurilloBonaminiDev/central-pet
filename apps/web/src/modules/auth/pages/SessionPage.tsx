import { Button, Card, CardDescription, CardHeader, CardTitle, Badge, Text } from '@central-pet/ui';
import { useAuth } from '../AuthProvider';
import { ROLE_LABELS } from '../types';

/** Minimal authenticated shell — not a dashboard. */
export function SessionPage() {
  const { session, logout } = useAuth();

  if (!session) return null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)] px-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Sessão autenticada</CardTitle>
          <CardDescription>
            Área protegida de autenticação. Dashboard e cadastros ainda não fazem parte desta fase.
          </CardDescription>
        </CardHeader>
        <div className="space-y-3">
          <Text>
            <strong>Usuário:</strong> {session.full_name}
          </Text>
          <Text>
            <strong>E-mail:</strong> {session.email}
          </Text>
          <Text>
            <strong>Empresa:</strong> {session.tenant_name}
          </Text>
          <div className="flex items-center gap-2">
            <Text>
              <strong>Perfil:</strong>
            </Text>
            <Badge variant="brand">{ROLE_LABELS[session.role]}</Badge>
          </div>
          <Button variant="secondary" onClick={() => void logout()}>
            Sair
          </Button>
        </div>
      </Card>
    </div>
  );
}
