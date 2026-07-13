import { Link } from 'react-router-dom';
import { Button, Card, CardHeader, CardTitle, Text } from '@central-pet/ui';
import { ROUTES } from '@app/router/paths';

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
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link to={ROUTES.admin.dashboard} className="inline-flex">
            <Button type="button">Área administrativa</Button>
          </Link>
          <Link to={ROUTES.home} className="inline-flex">
            <Button type="button" variant="secondary">
              Site público
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
