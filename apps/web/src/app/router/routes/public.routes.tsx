import { Route } from 'react-router-dom';
import {
  AboutPage,
  BookingPage,
  ContactPage,
  LandingPage,
  ProductsPage,
  ServicesPage,
} from '@modules/landing';
import { ROUTES } from '../paths';
import { RoutePlaceholder } from '../placeholders/RoutePlaceholder';

export const publicRoutes = (
  <>
    <Route path={ROUTES.home} element={<LandingPage />} />
    <Route path={ROUTES.sobre} element={<AboutPage />} />
    <Route path={ROUTES.servicos} element={<ServicesPage />} />
    <Route path={ROUTES.produtos} element={<ProductsPage />} />
    <Route path={ROUTES.equipe} element={<RoutePlaceholder title="Equipe" />} />
    <Route path={ROUTES.contato} element={<ContactPage />} />
    <Route path={ROUTES.agendamento} element={<BookingPage />} />
  </>
);
