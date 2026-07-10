# Vercel Setup — Schritt für Schritt

## Warum 404 / 500?

| URL | Erwartung |
|-----|-----------|
| `/` | War 404 (normal) → leitet jetzt zu `/admin` weiter |
| `/admin` | **500** = Datenbank oder Umgebungsvariablen fehlen |

Payload CMS braucht auf Vercel **PostgreSQL** — SQLite funktioniert dort nicht. Ab dem letzten Fix wird Postgres automatisch erkannt, wenn `DATABASE_URL` oder `POSTGRES_URL` gesetzt ist (Neon/Vercel Postgres).

---

## Projekt 1: CMS (`photographer-portfolio-cms`)

### Einstellungen → General

| Feld | Wert |
|------|------|
| **Root Directory** | `cms` |
| Framework | Next.js |

### Storage → Postgres anlegen

1. Vercel Dashboard → dein CMS-Projekt → **Storage**
2. **Create Database** → **Postgres** → Create
3. Mit dem CMS-Projekt verbinden (Connect to Project)

Vercel setzt `DATABASE_URL` automatisch.

### Settings → Environment Variables

| Variable | Wert | Pflicht? |
|----------|------|----------|
| `PAYLOAD_SECRET` | z. B. Ausgabe von `openssl rand -base64 32` | **Ja** |
| `DATABASE_URL` | *(automatisch von Vercel Postgres/Neon)* | **Ja** |
| `PAYLOAD_PUBLIC_SERVER_URL` | `https://photographer-portfolio-cms.vercel.app` (später `https://cms.svenmagnus.com`) | Empfohlen |
| `CORS_ORIGINS` | `https://svenmagnus.com,https://www.svenmagnus.com` | Empfohlen |
| `DATABASE_ADAPTER` | `postgres` | Optional (Auto-Erkennung) |

Optional für Bild-Uploads:

| Variable | Wert |
|----------|------|
| `BLOB_READ_WRITE_TOKEN` | Von Vercel Blob Storage |

### Redeploy

Nach dem Setzen der Variablen: **Deployments → … → Redeploy**

Der Build führt automatisch `payload migrate` aus und legt die Datenbank-Tabellen an.

### Test

- https://photographer-portfolio-cms.vercel.app/admin
- Beim ersten Besuch: Admin-Benutzer anlegen

---

## Projekt 2: Portfolio-Frontend (noch anlegen!)

Du hast bisher nur das **CMS**-Projekt. Die öffentliche Website braucht ein **zweites** Vercel-Projekt:

1. **Add New → Project** → gleiches GitHub-Repo
2. **Root Directory:** `web`
3. **Environment Variables:**

| Variable | Wert |
|----------|------|
| `PUBLIC_PAYLOAD_URL` | `https://photographer-portfolio-cms.vercel.app` |
| `PUBLIC_SITE_URL` | `https://svenmagnus.com` |

4. Domain: `svenmagnus.com` + `www.svenmagnus.com`

---

## Checkliste

- [ ] CMS: Root Directory = `cms`
- [ ] CMS: Postgres-Datenbank verbunden
- [ ] CMS: `PAYLOAD_SECRET` gesetzt (ohne diesen Wert → 500)
- [ ] CMS: Postgres-Variablen von Vercel/Neon verbunden
- [ ] CMS: `PAYLOAD_PUBLIC_SERVER_URL` = deine CMS-URL
- [ ] CMS: `/admin` lädt ohne Fehler
- [ ] Frontend: zweites Projekt mit Root `web`
- [ ] Strato DNS: A + CNAME (siehe DOMAIN-STRATO.md)
