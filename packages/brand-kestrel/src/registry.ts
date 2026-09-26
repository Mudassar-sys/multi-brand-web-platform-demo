import ComparisonTable from './sections/ComparisonTable.astro';
import CtaBand from './sections/CtaBand.astro';
import EventDetails from './sections/EventDetails.astro';
import Faq from './sections/Faq.astro';
import FeatureGrid from './sections/FeatureGrid.astro';
import Hero from './sections/Hero.astro';
import LeadForm from './sections/LeadForm.astro';
import PageHeader from './sections/PageHeader.astro';
import ProcessSteps from './sections/ProcessSteps.astro';
import RichText from './sections/RichText.astro';
import SpecTable from './sections/SpecTable.astro';
import type { sectionDefinitions } from './schemas';

type SectionType = (typeof sectionDefinitions)[number]['type'];

/** Maps each section `type` in page data to its component. */
export const registry = {
  hero: Hero,
  pageHeader: PageHeader,
  featureGrid: FeatureGrid,
  specTable: SpecTable,
  processSteps: ProcessSteps,
  comparisonTable: ComparisonTable,
  eventDetails: EventDetails,
  faq: Faq,
  ctaBand: CtaBand,
  leadForm: LeadForm,
  richText: RichText,
} satisfies Record<SectionType, unknown>;
