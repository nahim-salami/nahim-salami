// Tout le contenu du profil est ici. Modifier, puis lancer `npm run build`.
// (Si une capture ou une vidéo change : `npm run capture` puis `npm run media` d'abord.)

export const GITHUB_USER = 'nahim-salami';
export const HOME_URL = 'https://ahime.net';

/* ----------------------------- Projets phares ---------------------------- */
// `video` : démo animée (fichier dans media/src). `shot` : capture fixe (media/shots).

export const FEATURED = [
  {
    id: 'mesura', name: 'Mesura',
    url: 'https://mesura.ahime.net/produit', demo: 'https://mesura.ahime.net/configurateur',
    bar: 'mesura.ahime.net/configurateur',
    video: { file: 'marque_videos_mesura-fenetre.mp4', q: 55, fps: 10 },
    stack: ['TypeScript', 'React 18', 'Three.js', 'PHP', 'WooCommerce'],
    fr: {
      tagline: 'Configurateur 2D/3D en marque blanche pour les fabricants sur mesure',
      desc: 'Menuisiers, storistes, agenceurs : leurs clients composent le produit eux-mêmes, voient le dessin coté et la vue 3D, et le prix est calculé au centime avec les règles du fabricant. Le devis approuvé devient commande, fiche d\'atelier, puis facture.',
      points: [
        '40 familles de produits : fenêtres, portes, volets, portails, pergolas, meubles, photovoltaïque',
        'Un seul moteur pour le dessin 2D, la géométrie 3D, les règles de fabrication et le prix, recalculé côté serveur',
        'Web component embarquable, extension WooCommerce, calcul possible hors ligne',
      ],
      alt: 'Démo animée de Mesura : une fenêtre deux vantaux configurée en 2D puis en 3D, avec le prix mis à jour',
    },
    en: {
      tagline: 'White-label 2D/3D configurator for made-to-measure manufacturers',
      desc: 'Joiners, blind makers, fitters: their customers build the product themselves, see the dimensioned drawing and the 3D view, and the price is computed to the cent with the manufacturer\'s own rules. The approved quote becomes an order, a workshop sheet, then an invoice.',
      points: [
        '40 product families: windows, doors, shutters, gates, pergolas, furniture, solar',
        'One engine for the 2D drawing, the 3D geometry, the manufacturing rules and the price, recomputed server-side',
        'Embeddable web component, WooCommerce extension, pricing that also runs offline',
      ],
      alt: 'Animated Mesura demo: a two-leaf window configured in 2D then 3D, with the price updating live',
    },
  },
  {
    id: 'neon-light', name: 'Neon Light Configurator',
    url: 'https://neon-light.ahime.net/', demo: 'https://neon-light.ahime.net/demo',
    bar: 'neon-light.ahime.net/demo',
    video: { file: 'marque_videos_neon-light.mp4', q: 50, fps: 10 },
    stack: ['PHP', 'WordPress', 'WooCommerce', 'JavaScript', 'Three.js'],
    fr: {
      tagline: 'Extension WooCommerce pour vendre des enseignes néon sur mesure, sans devis',
      desc: 'Le client écrit son texte, choisit la police, la couleur et la taille, et voit son enseigne s\'allumer en 2D et en 3D. Le prix suit la longueur de tube réellement mesurée sur le tracé des lettres, puis il est recalculé sur le serveur avant l\'ajout au panier.',
      points: [
        'Trois produits, trois moteurs de calcul : néons LED, panneaux découpés, caissons lumineux',
        '12 interfaces, 5 thèmes complets et 33 polices pré-mesurées',
        'Configurateurs d\'enseignes livrés à sept boutiques en Belgique, en Suisse, aux Pays-Bas et en France',
      ],
      alt: 'Démo animée de Neon Light : le texte « Café Lumière » change de police et de couleur, le prix suit',
    },
    en: {
      tagline: 'WooCommerce extension to sell custom neon signs, without quotes',
      desc: 'The customer types their text, picks the font, colour and size, and watches the sign light up in 2D and 3D. The price follows the tube length actually measured along the letter outlines, then it is recomputed on the server before the item reaches the cart.',
      points: [
        'Three products, three pricing engines: LED neon, cut panels, light boxes',
        '12 interfaces, 5 complete themes and 33 pre-measured fonts',
        'Sign configurators delivered to seven shops in Belgium, Switzerland, the Netherlands and France',
      ],
      alt: 'Animated Neon Light demo: the text "Café Lumière" changes font and colour while the price follows',
    },
  },
  {
    id: 'wezon', name: 'Wézon',
    url: 'https://wezon.ahime.net/', shot: 'wezon',
    stack: ['TypeScript', 'React', 'Hono', 'PostgreSQL', 'Flutter', 'KKiaPay'],
    fr: {
      tagline: 'Agent WhatsApp pour les commerçants, avec paiement Mobile Money',
      desc: 'Un agent WhatsApp qui répond aux clients jour et nuit, prend les commandes et encaisse par Mobile Money. Le commerçant suit ses messages, ses commandes et ses encaissements depuis un tableau de bord web et une application Android.',
      points: [
        'Catalogue, commande et paiement sans quitter la conversation WhatsApp',
        'Deux offres : menu à boutons, ou agent IA qui passe la main au commerçant dès qu\'une demande sort de son rôle',
        'Marché public des boutiques, avec une fiche trouvable par les assistants IA',
      ],
      alt: 'Page d\'accueil de Wézon : « Votre boutique répond toute seule », avec une conversation WhatsApp sur téléphone',
    },
    en: {
      tagline: 'WhatsApp agent for shopkeepers, with Mobile Money payment',
      desc: 'A WhatsApp agent that answers customers day and night, takes orders and collects payment by Mobile Money. The shopkeeper follows messages, orders and takings from a web dashboard and an Android app.',
      points: [
        'Catalogue, order and payment without leaving the WhatsApp conversation',
        'Two plans: a button menu, or an AI agent that hands over to the shopkeeper when a request is outside its role',
        'Public marketplace of shops, each with a page AI assistants can find',
      ],
      alt: 'Wézon home page: "Your shop answers by itself", with a WhatsApp conversation on a phone',
    },
  },
  {
    id: 'su', name: 'Su POS',
    url: 'https://su.ahime.net/', shot: 'su',
    stack: ['Flutter', 'Dart', 'Laravel', 'PostgreSQL', 'Redis'],
    fr: {
      tagline: 'Caisse, stock et facturation normalisée, même hors connexion',
      desc: 'Logiciel de caisse conçu au Bénin : encaissement, stock et factures normalisées e-MECeF, même quand la connexion tombe. Un serveur local relie les postes de la boutique, et tout se synchronise avec le cloud dès que le réseau revient.',
      points: [
        'Offline-first : données chiffrées sur place, synchronisation dès le retour du réseau',
        '17 métiers couverts : boutique, restaurant, salon, hôtel, garage, école, distribution',
        'Windows, Android et Linux, abonnement payé par Mobile Money',
      ],
      alt: 'Page d\'accueil de Su POS : « La caisse qui tient boutique avec vous », avec une facture normalisée',
    },
    en: {
      tagline: 'Point of sale, stock and certified invoicing, even offline',
      desc: 'Point-of-sale software designed in Benin: checkout, stock and certified e-MECeF invoices, even when the connection drops. A local server links the shop\'s terminals, and everything syncs with the cloud once the network is back.',
      points: [
        'Offline-first: data encrypted on site, synced when the network returns',
        '17 trades covered: shop, restaurant, salon, hotel, garage, school, wholesale',
        'Windows, Android and Linux, subscription paid by Mobile Money',
      ],
      alt: 'Su POS home page: "The till that runs the shop with you", with a certified invoice',
    },
  },
  {
    id: 'hin', name: 'Hin',
    url: 'https://hin.ahime.net/', shot: 'hin',
    stack: ['React', 'Tauri', 'Capacitor', 'Laravel', 'Gemini'],
    fr: {
      tagline: 'Espace de travail pour les équipes : tâches, CRM, documents',
      desc: 'Tâches, documents, CRM, réunions et tableau blanc au même endroit, avec génération de tâches par IA. Une alternative abordable à Asana, ClickUp et Trello, disponible sur le web, macOS, Windows, Linux, iOS, Android et en extension Chrome.',
      points: [
        '8 vues : liste, board, calendrier, Gantt, timeline, charge, Eisenhower, tableau',
        'Tableaux de bord : burndown, vélocité, charge de l\'équipe',
        'Sécurité : double authentification, journal d\'audit, 13 rôles',
      ],
      alt: 'Page d\'accueil de Hin : « Le Work OS qui réunit votre équipe »',
    },
    en: {
      tagline: 'Team workspace: tasks, CRM, documents',
      desc: 'Tasks, documents, CRM, meetings and a whiteboard in one place, with AI task generation. An affordable alternative to Asana, ClickUp and Trello, available on the web, macOS, Windows, Linux, iOS, Android and as a Chrome extension.',
      points: [
        '8 views: list, board, calendar, Gantt, timeline, workload, Eisenhower, table',
        'Dashboards: burndown, velocity, team workload',
        'Security: two-factor authentication, audit log, 13 roles',
      ],
      alt: 'Hin home page: "The Work OS that brings your team together"',
    },
  },
  {
    id: 'douke', name: 'Douke',
    url: 'https://douke.ahime.net/', demo: 'https://entree.douke.ahime.net/demonstration',
    bar: 'douke.ahime.net',
    // Film d'accueil du site, enregistré par `node src/film.mjs douke` : une boucle complète, un peu accélérée.
    video: { file: 'douke-film.webm', from: 2.2, to: 48.4, speed: 1.4, fps: 6, q: 42 },
    stack: ['Python', 'SQLite', 'Cloudflare Workers', 'D1', 'Claude API'],
    fr: {
      tagline: 'Agent de prospection pour les indépendants et les petites entreprises',
      desc: 'Douke cherche les entreprises qui ont besoin de vous, écrit à chacune un message à votre nom et relance. Rien ne part sans votre accord : vous relisez, vous modifiez ou vous refusez. Il prépare ensuite le rendez-vous, le devis, la facture et la demande d\'avis, et montre chaque lundi les vrais chiffres de la semaine.',
      points: [
        'Un message écrit pour chaque entreprise, avec la raison de lui écrire maintenant : site absent, recrutement, ouverture récente',
        'Garde-fous intégrés : 20 messages par jour au plus, deux relances, puis Douke s\'arrête',
        'Trois formules (Solo, Local, Pro) : un abonnement et une part plafonnée sur les ventes apportées ; résultats de tous les comptes publiés, zéros compris',
      ],
      alt: 'Film d\'accueil de Douke : le lundi vous décrivez votre métier, Douke cherche des entreprises, écrit à chacune, vous validez, on vous répond, puis le bilan de la semaine',
    },
    en: {
      tagline: 'Prospecting agent for freelancers and small businesses',
      desc: 'Douke looks for the companies that need you, writes each one a message in your name and follows up. Nothing is sent without your approval: you review, edit or reject. It then prepares the meeting, the quote, the invoice and the review request, and shows the real figures of the week every Monday.',
      points: [
        'A message written for each company, with the reason to contact it now: no website, hiring, recently opened',
        'Built-in limits: 20 messages a day at most, two follow-ups, then Douke stops',
        'Three plans (Solo, Local, Pro): a subscription and a capped share of the sales it brings; results of every account published, zeros included',
      ],
      alt: 'Douke intro film (in French): on Monday you describe your trade, Douke finds companies, writes to each one, you approve, they reply, then the weekly figures',
    },
  },
];

/* --------------------------- Autres réalisations ------------------------- */

export const OTHERS = [
  {
    id: 'wifitche', name: 'WiFiTche', url: 'https://wifitche.ahime.net/', shot: 'wifitche',
    stack: ['Flutter', 'Next.js', 'Prisma', 'FedaPay'],
    fr: { kind: 'Wi-Fi · MikroTik', desc: 'Vente d\'accès Wi-Fi par routeurs MikroTik, payée en Mobile Money. Applications client, gérant et technicien.' },
    en: { kind: 'Wi-Fi · MikroTik', desc: 'Wi-Fi access sold through MikroTik routers, paid by Mobile Money. Customer, owner and technician apps.' },
  },
  {
    id: 'imo', name: 'IMO Bénin', url: 'https://imo.ahime.net/', shot: 'imo',
    stack: ['React', 'Flutter', 'Laravel', 'KKiaPay'],
    fr: { kind: 'Immobilier', desc: 'Location immobilière conforme à la loi 2022-30 : baux, loyers, KYC, services SBEE et SONEB.' },
    en: { kind: 'Real estate', desc: 'Property rental compliant with Benin law 2022-30: leases, rent, KYC, SBEE and SONEB utilities.' },
  },
  {
    id: 'tank', name: 'Tank Configurator', url: 'http://tank-config.ziemann-holvrieka.com/', shot: 'tank',
    stack: ['React', 'Node.js', 'Three.js'],
    fr: { kind: 'Industrie · 3D', desc: 'Configurateur de cuves industrielles pour Ziemann Holvrieka (Allemagne) : géométrie, volume et plan coté.' },
    en: { kind: 'Industry · 3D', desc: 'Industrial tank configurator for Ziemann Holvrieka (Germany): geometry, volume and dimensioned drawing.' },
  },
  {
    id: 'omniscan', name: 'OmniScan3D', url: 'https://omniscan.ahime.net/', shot: 'omniscan',
    stack: ['React', 'Three.js', 'Gemini', 'Express'],
    fr: { kind: 'IA · 3D', desc: 'Scan 3D assisté par IA : reconstruction d\'objets, analyse et export multi-format.' },
    en: { kind: 'AI · 3D', desc: 'AI-assisted 3D scanning: object reconstruction, analysis and multi-format export.' },
  },
  {
    id: 'lifac', name: 'LiFAC', url: 'https://lifac.ahime.net/', shot: 'lifac',
    stack: ['Next.js', 'Prisma', 'PostgreSQL', 'FedaPay'],
    fr: { kind: 'ONG', desc: 'Site, dons et gestion d\'événements d\'une ONG, avec paiement Mobile Money.' },
    en: { kind: 'Non-profit', desc: 'Website, donations and event management for an NGO, with Mobile Money payment.' },
  },
  {
    id: 'imdf', name: 'E-learning IMDF', url: 'https://imdf.co/', shot: 'imdf',
    stack: ['Laravel', 'Blade', 'Tailwind'],
    fr: { kind: 'Formation', desc: 'Plateforme de formation en ligne : parcours, cours, quiz et suivi des apprenants.' },
    en: { kind: 'Education', desc: 'Online training platform: learning paths, courses, quizzes and learner tracking.' },
  },
];

/* ------------------------------ Stack, contact --------------------------- */
// Identifiants d'icônes : https://skillicons.dev

export const SKILLS = 'ts,js,php,python,dart,java,cs,cpp,react,nextjs,vue,flutter,tailwind,threejs,laravel,symfony,dotnet,nodejs,postgres,mysql,redis,firebase,prisma,docker,kubernetes,azure,aws,figma';

export const CONTACT = [
  { id: 'mail', label: { fr: 'M\'écrire', en: 'Email me' }, url: 'mailto:nahim.salami@ahime.net', primary: true },
  { id: 'linkedin', label: { fr: 'LinkedIn', en: 'LinkedIn' }, url: 'https://www.linkedin.com/in/nahimsalami/' },
  { id: 'whatsapp', label: { fr: 'WhatsApp', en: 'WhatsApp' }, url: 'https://wa.me/2290152533792' },
  { id: 'x', label: { fr: 'X · @salami_nahim', en: 'X · @salami_nahim' }, url: 'https://x.com/salami_nahim' },
  { id: 'ahime', label: { fr: 'ahime.net', en: 'ahime.net' }, url: 'https://ahime.net' },
];

/* --------------------------------- Textes -------------------------------- */

export const I18N = {
  fr: {
    readme: 'README.md', self: 'Français', other: { label: 'English', file: 'README.en.md' },
    avail: 'Disponible · freelance & collaborations SaaS',
    role: 'Software Architect · CEO & fondateur d\'Ahime',
    pitch: ['Configurateurs 2D/3D, SaaS et applications mobiles,', 'conçus et livrés de bout en bout.'],
    facts: ['8+ ans d\'expérience', '40+ produits en production', 'Cotonou, Bénin'],
    bannerAlt: 'Nahim Salami — Software Architect, CEO et fondateur d\'Ahime. Configurateurs 2D/3D, SaaS et applications mobiles. Cotonou, Bénin.',
    bio: 'Architecte logiciel et fondateur d\'<a href="https://ahime.net">Ahime</a>, studio basé à Cotonou. Depuis plus de huit ans, je conçois et je livre des produits complets, de la base de données à l\'application publiée sur le store : configurateurs 2D/3D pour les fabricants sur mesure, logiciels de caisse et de gestion, agents WhatsApp et applications mobiles, pour l\'Afrique de l\'Ouest et l\'Europe.',
    hFeatured: 'Projets phares',
    hOthers: 'Autres réalisations',
    othersLead: 'Une sélection parmi plus de quarante produits en production.',
    also: '<b>Et aussi :</b> <a href="https://github.com/nahim-salami/ajo-releases/releases">Ajo</a>, épargne par objectifs sur Android · Figma AI Bridge, serveur MCP et plugin pour piloter Figma depuis un assistant IA (open source, MIT) · boutiques en ligne et configurateurs pour des clients en Belgique, en Suisse, aux Pays-Bas, au Royaume-Uni et au Canada.',
    hStack: 'Stack',
    hContact: 'Contact',
    contactLead: 'Un produit à concevoir, un configurateur à intégrer, une application à livrer ? Je réponds sous 24 h, en français ou en anglais.',
    btnSite: 'Voir le site', btnDemo: 'Essayer la démo',
    foot: 'README généré par <code>src/build.mjs</code> · captures et démos issues des produits en ligne.',
  },
  en: {
    readme: 'README.en.md', self: 'English', other: { label: 'Français', file: 'README.md' },
    avail: 'Available · freelance & SaaS collaborations',
    role: 'Software Architect · CEO & founder of Ahime',
    pitch: ['2D/3D configurators, SaaS and mobile apps,', 'designed and shipped end to end.'],
    facts: ['8+ years of experience', '40+ products in production', 'Cotonou, Benin'],
    bannerAlt: 'Nahim Salami — Software Architect, CEO and founder of Ahime. 2D/3D configurators, SaaS and mobile apps. Cotonou, Benin.',
    bio: 'Software architect and founder of <a href="https://ahime.net">Ahime</a>, a studio based in Cotonou. For more than eight years I have designed and shipped complete products, from the database to the app published on the store: 2D/3D configurators for made-to-measure manufacturers, point-of-sale and management software, WhatsApp agents and mobile apps, for West Africa and Europe.',
    hFeatured: 'Featured projects',
    hOthers: 'More work',
    othersLead: 'A selection from more than forty products in production.',
    also: '<b>Also:</b> <a href="https://github.com/nahim-salami/ajo-releases/releases">Ajo</a>, goal-based savings on Android · Figma AI Bridge, an MCP server and plugin to drive Figma from an AI assistant (open source, MIT) · online shops and configurators for clients in Belgium, Switzerland, the Netherlands, the United Kingdom and Canada.',
    hStack: 'Stack',
    hContact: 'Contact',
    contactLead: 'A product to design, a configurator to integrate, an app to ship? I reply within 24 hours, in French or English.',
    btnSite: 'Visit the site', btnDemo: 'Try the demo',
    foot: 'README generated by <code>src/build.mjs</code> · screenshots and demos taken from the live products.',
  },
};
