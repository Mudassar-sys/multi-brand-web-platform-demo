/** Mural concept artworks available to page data (see MuralArt.astro). */
export const artVariants = ['sunrise', 'botanical', 'geo', 'wave', 'city', 'abstract'] as const;
export type ArtVariant = (typeof artVariants)[number];
