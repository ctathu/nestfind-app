/**
 * Centralized data-testid selectors for NestFind E2E tests.
 * Prefer these over CSS/text selectors to reduce flakiness.
 */
export const testIds = {
  navbar: "navbar",
  mobileMenuToggle: "mobile-menu-toggle",
  mobileNav: "mobile-nav",
  heroSection: "hero-section",
  homePage: "home-page",
  searchBar: "search-bar",
  searchLocation: "search-location",
  searchSubmit: "search-submit",
  categoryChips: "category-chips",
  categoryChip: (id: string) => `category-chip-${id}`,
  featuredListings: "featured-listings",
  featuredListingsGrid: "featured-listings-grid",
  listingsPage: "listings-page",
  listingsGrid: "listings-grid",
  propertyCard: "property-card",
  propertyCardLink: "property-card-link",
  propertyCardTitle: "property-card-title",
  listingDetail: "listing-detail",
  loadingGrid: "loading-grid",
  emptyState: "empty-state",
  errorState: "error-state",
  errorRetry: "error-retry",
  aiSearchAssistant: "ai-search-assistant",
  aiSearchInput: "ai-search-input",
  aiSearchSubmit: "ai-search-submit",
  aiSearchResult: "ai-search-result",
  aiSearchError: "ai-search-error",
} as const;

export function byTestId(id: string) {
  return `[data-testid="${id}"]`;
}
