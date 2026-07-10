# Portfolio Sven Magnus

Fotografen-Portfolio mit **Astro** (Frontend) und **Payload CMS** (Backend/Admin).

## Architektur

```
├── cms/     Payload CMS + Next.js  →  Admin unter /admin, REST API unter /api
└── web/     Astro + Tailwind CSS   →  Statisches Portfolio-Frontend
```

| Dienst | Zweck | Empfohlenes Hosting |
|--------|-------|---------------------|
| `cms/` | Bilder hochladen & verwalten | [Vercel](https://vercel.com) oder [Railway](https://railway.app) |
| `web/` | Öffentliche Portfolio-Seite | [Vercel](https://vercel.com) oder [GitHub Pages](https://pages.github.com) |

## Lokale Entwicklung

### Voraussetzungen

- Node.js ≥ 20.9
- npm

### Installation

```bash
npm install
```

### CMS starten (Port 3000)

```bash
npm run dev:cms
```

Beim ersten Start: [http://localhost:3000/admin](http://localhost:3000/admin) öffnen und Admin-Benutzer anlegen.

### Frontend starten (Port 4321)

```bash
npm run dev:web
```

Portfolio: [http://localhost:4321](http://localhost:4321)

## Fotos verwalten

### Ordner-Import (empfohlen)

1. Im Admin unter **Ordner-Import** öffnen: [http://localhost:3000/admin/collections/photos/bulk-import](http://localhost:3000/admin/collections/photos/bulk-import)
2. Kategorie und Datum wählen
3. Einen **ganzen Ordner** mit Bildern auswählen
4. Auf **Ordner importieren** klicken

Alle Bilder werden automatisch hochgeladen und als Photo-Einträge angelegt (Titel aus Dateiname).

Alternativ findest du den Link auch oben in der **Photos**-Liste.

### Einzeln hochladen

Im Admin-Panel unter `/admin`:

1. **Media** – Bilder hochladen (auch per Bulk-Upload in der Media-Liste)
2. **Photos** – Eintrag mit Titel, Kategorie, Bild und Datum anlegen

### Kategorien

hollywood · fashion clicks · black & white · beauty pics · runway · miscellaneous · alaïa collection · advertorial · film editor · motion · insta · publications

## Deployment

Ausführliche Vercel-Anleitung: [docs/VERCEL-SETUP.md](docs/VERCEL-SETUP.md)

### CMS auf Vercel

1. Neues Vercel-Projekt mit Root Directory `cms`
2. Umgebungsvariablen setzen:

```
DATABASE_ADAPTER=postgres
DATABASE_URL=postgresql://...
PAYLOAD_SECRET=<langer-zufälliger-string>
PAYLOAD_PUBLIC_SERVER_URL=https://ihr-cms.vercel.app
CORS_ORIGINS=https://ihre-domain.com
```

3. PostgreSQL-Datenbank anbinden (Vercel Postgres, Neon oder Supabase)
4. **Vercel Blob Storage** hinzufügen (Storage → Blob) für Bild-Uploads

### CMS auf Railway

1. Repo verbinden, Root Directory `cms`
2. PostgreSQL-Plugin hinzufügen
3. Variablen setzen (siehe `cms/.env.example`)

### Frontend auf Vercel

1. Neues Projekt mit Root Directory `web`
2. Build Command: `npm run build`
3. Umgebungsvariablen:

```
PUBLIC_PAYLOAD_URL=https://ihr-cms.vercel.app
PUBLIC_SITE_URL=https://ihre-domain.com
```

### Frontend auf GitHub Pages

1. Repository → Settings → Pages → Source: **GitHub Actions**
2. Repository-Variable `PUBLIC_PAYLOAD_URL` setzen (Settings → Secrets and variables → Actions → Variables)
3. Bei Unterverzeichnis-Deployment: `PUBLIC_BASE_PATH=/repo-name/` setzen

## Umgebungsvariablen

Siehe `cms/.env.example` und `web/.env.example`.

## Domain verbinden (Strato)

Ausführliche Anleitung: [docs/DOMAIN-STRATO.md](docs/DOMAIN-STRATO.md)

**Kurzfassung für Strato:**
1. **Webserver-Tab:** Externe Umleitung auf Format **löschen**
2. **DNS-Tab:** A-Record `@` → `76.76.21.21` (Vercel), CNAME `www` + `cms` → `cname.vercel-dns.com`
3. Login unter **https://svenmagnus.com/log-in**

Einstellungen im CMS: **Einstellungen** (Globals) → Domain, E-Mail, Social, SEO


- [Payload CMS 3](https://payloadcms.com) – Headless CMS mit Admin-Panel
- [Astro](https://astro.build) – Statisches Frontend
- [Tailwind CSS](https://tailwindcss.com) – Styling
- [Sharp](https://sharp.pixelplumbing.com) – Bildoptimierung
