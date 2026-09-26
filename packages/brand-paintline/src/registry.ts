import CtaBand from './sections/CtaBand.astro';
import Faq from './sections/Faq.astro';
import Gallery from './sections/Gallery.astro';
import Hero from './sections/Hero.astro';
import Packages from './sections/Packages.astro';
import PageHeader from './sections/PageHeader.astro';
import ProcessSteps from './sections/ProcessSteps.astro';
import QuoteForm from './sections/QuoteForm.astro';
import RichText from './sections/RichText.astro';
import ServiceCards from './sections/ServiceCards.astro';
import SurfaceGuide from './sections/SurfaceGuide.astro';
import type { sectionDefinitions } from './schemas';

type SectionType = (typeof sectionDefinitions)[number]['type'];

/** Maps each section `type` in page data to its component. */
export const registry = {
  hero: Hero,
  pageHeader: PageHeader,
  serviceCards: ServiceCards,
  processSteps: ProcessSteps,
  gallery: Gallery,
  surfaceGuide: SurfaceGuide,
  packages: Packages,
  faq: Faq,
  ctaBand: CtaBand,
  quoteForm: QuoteForm,
  richText: RichText,
} satisfies Record<SectionType, unknown>;
