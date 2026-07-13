import '../styles/landing.css';
import { SiteLayout } from '../components/SiteLayout';
import { HomeAbout } from '../components/HomeAbout';
import { HomeDifferentiators } from '../components/HomeDifferentiators';
import { HomeHero } from '../components/HomeHero';
import { HomeScheduleCta } from '../components/HomeScheduleCta';

export function LandingPage() {
  return (
    <SiteLayout>
      <div className="home-page">
        <HomeHero />
        <HomeAbout />
        <HomeDifferentiators />
        <HomeScheduleCta />
      </div>
    </SiteLayout>
  );
}
