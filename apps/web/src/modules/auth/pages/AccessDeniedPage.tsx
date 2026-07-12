import { Link } from 'react-router-dom';
import { Button, Card, CardHeader, CardTitle, Text } from '@central-pet/ui';

export function AccessDeniedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)] px-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle>Acesso negado</CardTitle>
        </CardHeader>
        <Text muted className="mb-4">
          Seu perfil nesta empresa não tem permissão para acessar este recurso.
        </Text>
        <Link to="/dashboard" className="inline-flex">
          <Button type="button">Voltar ao dashboard</Button>
        </Link>
      </Card>
    </div>
  );
}
