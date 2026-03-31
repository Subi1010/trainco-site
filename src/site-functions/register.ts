/**
 * Site Functions Registration
 *
 * Registers all site functions on window.__siteFunctions so the voice agent
 * can invoke them via the callSiteFunction RPC.
 *
 * Convention:
 * - Each .ts file in src/site-functions/ (except register.ts, index.ts, types.ts)
 *   exports a default function
 * - The filename (camelCase) becomes the function name on window.__siteFunctions
 * - Functions receive (args: Record<string, any>) and return any
 *
 * Manifest:
 * - Each entry in `siteFunctionManifest` provides metadata alongside the function
 * - `description` is MANDATORY — used as the agent tool description
 * - `schema` is optional — JSON Schema for the function's parameters
 * - `defaults` is optional — default argument values when not provided by agent
 * - The discovery service extracts this manifest on deployment for validation
 */

import setTheme from './setTheme';
import navigateToSection from './navigateToSection';

// ─── Types ──────────────────────────────────────────────────────────────────

export type SiteFunctionEntry = {
  /** The function implementation */
  fn: (args: any) => any;
  /** MANDATORY: Agent-facing description of what this function does */
  description: string;
  /** Optional: JSON Schema describing the function's input parameters */
  schema?: Record<string, any>;
  /** Optional: Default values for parameters when not provided by the agent */
  defaults?: Record<string, any>;
};

// ─── Manifest ───────────────────────────────────────────────────────────────

/**
 * Site function manifest — the single source of truth for all registered functions.
 *
 * Each key is the camelCase function name that the agent will use to call it.
 * The discovery service reads this manifest on deployment to extract metadata
 * and validate schemas.
 *
 * Mobeus expects `site-functions/register.ts` at the **repo root** — that file
 * re-exports this module so the dashboard can discover `setTheme` + `navigateToSection`.
 */
export const siteFunctionManifest: Record<string, SiteFunctionEntry> = {
  setTheme: {
    fn: setTheme,
    description:
      'Switch the website theme between light, dark, or system preference',
    schema: {
      type: 'object',
      properties: {
        theme: {
          type: 'string',
          enum: ['light', 'dark', 'system'],
          description: 'The theme to apply',
        },
      },
      required: ['theme'],
    },
    defaults: { theme: 'system' },
  },

  navigateToSection: {
    fn: navigateToSection,
    description:
      'trAIn Career Concierge UI navigation (v2). Replaces the visible screen with one or more generative templates. ' +
      'English only. Pass a single JSON object: badge, title, subtitle (optional strings), generativeSubsections (array of { id, templateId, props, _update? }). ' +
      'Each call normally replaces the screen; Dashboard pairs with ProfileSheet, detail sheets, Job flows, etc. ' +
      'Use speech + this tool on UI-transition turns (never tool-only). TeleSpeechBubble is persistent — questions are spoken, not passed as props. ' +
      'Wait for user signals after GlassmorphicOptions, MultiSelectOptions, TextInput, RegistrationForm, CandidateSheet, CardStack, SavedJobsStack. ' +
      '_update: true merges props into the existing section with the same id/templateId. ' +
      'Omit optional props (never null). Strict JSON. ' +
      'Reserved _sessionEstablished is stripped by the frontend. ' +
      'Never pass cache-backed props: rawSkillProgression, rawJobs, rawMarketRelevance, rawCareerGrowth, requiredSkills, recommendedSkills, skillGaps, or full candidate profile fields — ' +
      'CandidateSheet: candidateId only; JobDetailSheet: jobId, title, company, fitCategory. ' +
      'Templates include: EmptyScreen, WelcomeLanding, GlassmorphicOptions, MultiSelectOptions, TextInput, RegistrationForm, LoadingGeneral, LoadingLinkedIn, CardStack, SavedJobsStack, Dashboard, ProfileSheet, SkillCoverageSheet, MarketRelevanceSheet, CareerGrowthSheet, SkillsDetail, MarketRelevanceDetail, CareerGrowthDetail, TargetRoleSheet, MyLearningSheet, JobSearchSheet, JobDetailSheet, EligibilitySheet, CloseGapSheet, JobApplicationsSheet, PastApplicationsSheet, CandidateSheet.',
    schema: {
      type: 'object',
      properties: {
        badge: { type: 'string', description: 'Context label shown in chrome' },
        title: { type: 'string', description: 'Main heading' },
        subtitle: { type: 'string', description: 'Subheading' },
        generativeSubsections: {
          type: 'array',
          description: 'Sections to render (replaces or merges per _update)',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              templateId: { type: 'string', description: 'Template id e.g. Dashboard, ProfileSheet, GlassmorphicOptions' },
              props: { type: 'object', additionalProperties: true },
              _update: { type: 'boolean', description: 'If true, merge into existing section with same id/templateId' },
            },
            required: ['templateId'],
          },
        },
      },
      required: ['generativeSubsections'],
    },
  },
};

// ─── Window registration ────────────────────────────────────────────────────

// Extend window type
declare global {
  interface Window {
    __siteFunctions: Record<string, (args: any) => any>;
  }
}

/**
 * Register all site functions on window.__siteFunctions.
 * Call this once on app initialization (e.g., in VoiceSessionProvider or layout).
 *
 * Only the `fn` from each manifest entry is registered on the window —
 * metadata (description, schema, defaults) is used by the discovery service,
 * not at runtime.
 */
export function registerSiteFunctions() {
  if (typeof window === 'undefined') return;

  window.__siteFunctions ??= {};
  for (const [name, entry] of Object.entries(siteFunctionManifest)) {
    window.__siteFunctions[name] = entry.fn;
  }
}
