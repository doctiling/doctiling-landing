import type { Metadata } from 'next';
import { FAQ_KEYS } from './components/faq-keys';
import { LANDING_MESSAGES, toLandingLocale, type LandingLocale } from './i18n';
import { LANDING_HOME_SLUG, type LandingSlug } from './routes';

// Search-engine surface of every landing page: metadata (title, description,
// canonical + hreflang, Open Graph, Twitter) and the JSON-LD graphs. Server
// side by design — the host's page files call these and render the result, so
// crawlers see it in the initial HTML.

interface PageCopy {
  title: string;
  description: string;
  ogAlt: string;
  keywords: readonly string[];
}

type LocalizedCopy = Record<LandingLocale, PageCopy>;

export const LANDING_SEO_COPY: Record<LandingSlug, LocalizedCopy> = {
  landing: {
    en: {
      title: 'Doctiling — Knowledge curated by experts, worked by AI agents',
      description:
        'More than document storage or vector search: Doctiling is where your team gathers sources, structures them into documents, tables and graphs, curates them with domain experts and works them with AI agents that produce cited analyses, charts, diagrams and code. Share it or connect it over MCP. Free to start, no credit card.',
      ogAlt: 'Doctiling — knowledge curated by experts, worked by AI agents',
      keywords: [
        'knowledge base AI',
        'knowledge base management',
        'knowledge management',
        'knowledge curation',
        'RAG as a product',
        'shared knowledge base',
        'MCP knowledge base',
        'enterprise AI knowledge',
        'AI workspace',
        'document AI',
        'AI with citations',
        'retrieval augmented generation',
        'NotebookLM alternative',
        'AI agent',
        'consultant knowledge base',
        'second brain',
      ],
    },
    es: {
      title: 'Doctiling — Conocimiento curado por expertos, trabajado por agentes de IA',
      description:
        'Más que guardar documentos o buscar vectores: Doctiling es donde tu equipo reúne sus fuentes, las estructura en documentos, tablas y grafos, las cura con expertos del dominio y las trabaja con agentes de IA que producen análisis citados, gráficas, diagramas y código. Compártela o conéctala por MCP. Gratis para empezar, sin tarjeta.',
      ogAlt: 'Doctiling — conocimiento curado por expertos, trabajado por agentes de IA',
      keywords: [
        'base de conocimiento IA',
        'gestión de bases de conocimiento',
        'gestión del conocimiento',
        'curación de conocimiento',
        'RAG como producto',
        'base de conocimiento compartida',
        'MCP base de conocimiento',
        'IA empresarial conocimiento',
        'IA documentos',
        'IA con citas',
        'recuperación aumentada por generación',
        'alternativa a NotebookLM',
        'agente IA',
        'base de conocimiento consultor',
        'AI workspace',
        'segundo cerebro',
      ],
    },
  },
  documents: {
    en: {
      title: 'Document types in Doctiling — text, tables and graphs',
      description:
        'Text, table and graph documents in one knowledge base: blocks cut at headings, PDF tables rebuilt by geometry, graphs queried by neighbourhood — and charts, diagrams and mind maps the agent draws from them.',
      ogAlt: 'Doctiling document types — text, tables and graphs',
      keywords: [
        'document types AI',
        'graph document',
        'table document AI',
        'knowledge management',
        'PDF table extraction',
        'block level citations',
        'AI generated diagrams',
        'mind map AI',
      ],
    },
    es: {
      title: 'Tipos de documento en Doctiling — texto, tablas y grafos',
      description:
        'Documentos de texto, tabla y grafo en una sola base de conocimiento: bloques por encabezado, tablas de PDF reconstruidas por geometría, grafos consultados por vecindad — y los gráficos, diagramas y mapas mentales que el agente dibuja con ellos.',
      ogAlt: 'Tipos de documento de Doctiling — texto, tablas y grafos',
      keywords: [
        'tipos de documento IA',
        'documento de grafo',
        'documento de tabla IA',
        'gestión del conocimiento',
        'extracción de tablas PDF',
        'citas a nivel de bloque',
        'diagramas generados por IA',
        'mapa mental IA',
      ],
    },
  },
  connect: {
    en: {
      title: 'Connect Doctiling over MCP — apps, chats and coding agents',
      description:
        'Expose a knowledge base as an MCP endpoint with a scoped, revocable token: the mobile app, a team chat, a terminal agent or an internal system query it and get cited answers. Roles, security and self-hosting included.',
      ogAlt: 'Doctiling MCP connections — apps, chats and agents querying a knowledge base',
      keywords: [
        'MCP endpoint',
        'Model Context Protocol',
        'knowledge base API',
        'AI integrations',
        'shared knowledge base',
        'self-hosted AI knowledge base',
        'cited answers',
      ],
    },
    es: {
      title: 'Conecta Doctiling por MCP — apps, chats y agentes de código',
      description:
        'Expón una base de conocimiento como endpoint MCP con token acotado y revocable: la app móvil, un chat de equipo, un agente de terminal o un sistema interno la consultan y reciben respuestas citadas. Roles, seguridad y self-hosting incluidos.',
      ogAlt: 'Conexiones MCP de Doctiling — apps, chats y agentes consultando una base de conocimiento',
      keywords: [
        'endpoint MCP',
        'Model Context Protocol',
        'API base de conocimiento',
        'integraciones IA',
        'base de conocimiento compartida',
        'IA self-hosted',
        'respuestas citadas',
      ],
    },
  },
  verticals: {
    en: {
      title: 'Doctiling for your field — solutions by sector with cited answers',
      description:
        'How Doctiling grounds AI in your own documents for legal, healthcare, finance, accounting, research and consulting teams. Every answer cites the source — never guesses.',
      ogAlt: 'Doctiling solutions by field — cited answers grounded in your documents',
      keywords: [
        'AI for lawyers',
        'AI for healthcare',
        'AI for finance',
        'AI for accounting',
        'AI for research',
        'AI for consulting',
        'document AI by industry',
        'cited AI answers',
        'RAG by vertical',
        'contract review AI',
        'literature review AI',
        'data room AI',
      ],
    },
    es: {
      title: 'Doctiling para tu sector — soluciones con respuestas citadas',
      description:
        'Cómo Doctiling fundamenta la IA en tus propios documentos para equipos legales, de salud, finanzas, contabilidad, investigación y consultoría. Cada respuesta cita la fuente — nunca conjetura.',
      ogAlt: 'Soluciones de Doctiling por sector — respuestas citadas en tus documentos',
      keywords: [
        'IA para abogados',
        'IA para salud',
        'IA para finanzas',
        'IA para contabilidad',
        'IA para investigación',
        'IA para consultoría',
        'IA documental por industria',
        'respuestas IA con citas',
        'RAG por vertical',
        'revisión de contratos IA',
        'revisión de literatura IA',
        'data room IA',
      ],
    },
  },
};

export const VERTICAL_KEYS = ['legal', 'health', 'finance', 'accounting', 'research', 'consulting'] as const;

export interface LandingSeoContext {
  /** Canonical origin, no trailing slash (`https://www.doctiling.app`). */
  siteUrl: string;
  locale: string;
}

const ogImage = (siteUrl: string, locale: LandingLocale) => `${siteUrl}/og/og-${locale}.png`;
const pageUrl = (siteUrl: string, locale: string, slug: LandingSlug) => `${siteUrl}/${locale}/${slug}`;

export function landingMetadata(slug: LandingSlug, { siteUrl, locale }: LandingSeoContext): Metadata {
  const lang = toLandingLocale(locale);
  const copy = LANDING_SEO_COPY[slug][lang];
  const canonical = pageUrl(siteUrl, lang, slug);
  const image = ogImage(siteUrl, lang);
  return {
    metadataBase: new URL(siteUrl),
    // absolute: a host title template would append the brand and duplicate it
    title: { absolute: copy.title },
    description: copy.description,
    keywords: [...copy.keywords],
    alternates: {
      canonical,
      languages: {
        en: pageUrl(siteUrl, 'en', slug),
        es: pageUrl(siteUrl, 'es', slug),
        'x-default': pageUrl(siteUrl, 'es', slug),
      },
    },
    openGraph: {
      type: 'website',
      title: copy.title,
      description: copy.description,
      url: canonical,
      siteName: 'Doctiling',
      locale: lang === 'es' ? 'es_ES' : 'en_US',
      images: [{ url: image, width: 1200, height: 630, alt: copy.ogAlt }],
    },
    twitter: {
      card: 'summary_large_image',
      title: copy.title,
      description: copy.description,
      images: [image],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
    },
  };
}

/** Organization + WebSite + SoftwareApplication + FAQPage, from the same copy the page renders. */
export function landingHomeJsonLd({ siteUrl, locale }: LandingSeoContext): Record<string, unknown> {
  const lang = toLandingLocale(locale);
  const copy = LANDING_SEO_COPY.landing[lang];
  const url = pageUrl(siteUrl, lang, LANDING_HOME_SLUG);
  const faqItems = (LANDING_MESSAGES[lang] as { landing: { faq: { items: Record<string, { q: string; a: string }> } } })
    .landing.faq.items;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${siteUrl}#org`,
        name: 'Doctiling',
        url: siteUrl,
        logo: `${siteUrl}/icon.svg`,
        sameAs: [siteUrl],
        contactPoint: [
          {
            '@type': 'ContactPoint',
            email: 'support@doctiling.app',
            contactType: 'customer support',
            availableLanguage: ['en', 'es'],
          },
        ],
      },
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}#site`,
        url: siteUrl,
        name: 'Doctiling',
        inLanguage: lang,
        publisher: { '@id': `${siteUrl}#org` },
      },
      {
        '@type': 'SoftwareApplication',
        '@id': `${siteUrl}#app`,
        name: 'Doctiling',
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web, iOS, macOS, Windows, Android',
        description: copy.description,
        url,
        image: ogImage(siteUrl, lang),
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      },
      {
        '@type': 'FAQPage',
        '@id': `${url}#faq`,
        inLanguage: lang,
        mainEntity: FAQ_KEYS.map((key) => ({
          '@type': 'Question',
          name: faqItems[key].q,
          acceptedAnswer: { '@type': 'Answer', text: faqItems[key].a },
        })),
      },
    ],
  };
}

/** BreadcrumbList + ItemList of the sectors, from the rendered copy. */
export function verticalsJsonLd({ siteUrl, locale }: LandingSeoContext): Record<string, unknown> {
  const lang = toLandingLocale(locale);
  const url = pageUrl(siteUrl, lang, 'verticals');
  const items = (LANDING_MESSAGES[lang] as { verticalsPage: { items: Record<string, { title: string; solution: string }> } })
    .verticalsPage.items;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Doctiling', item: pageUrl(siteUrl, lang, LANDING_HOME_SLUG) },
          { '@type': 'ListItem', position: 2, name: LANDING_SEO_COPY.verticals[lang].title, item: url },
        ],
      },
      {
        '@type': 'ItemList',
        '@id': `${url}#verticals`,
        name: LANDING_SEO_COPY.verticals[lang].title,
        itemListElement: VERTICAL_KEYS.map((key, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: items[key].title,
          description: items[key].solution,
        })),
      },
    ],
  };
}
