# Domain & Strato — svenmagnus.com verbinden

## Architektur (empfohlen)

| Adresse | Dienst | Hosting |
|---------|--------|---------|
| `svenmagnus.com` | Portfolio (Astro) | Vercel |
| `www.svenmagnus.com` | Portfolio (Astro) | Vercel |
| `cms.svenmagnus.com` | Payload CMS + Admin | Vercel |
| `svenmagnus.com/log-in` | Weiterleitung zum Admin | Astro (Vercel) |

E-Mail (`mail@svenmagnus.com`) bleibt bei **Strato** oder wird zu Google Workspace umgezogen — unabhängig von der Website.

---

## Schritt 1: Bei Strato — alte Weiterleitung entfernen

Aktuell zeigt Strato unter **Domains → svenmagnus.com → Webserver**:

> Umleitung Extern auf `http://www.svenmagnus.com/`

**Diese Umleitung muss deaktiviert werden**, sonst funktioniert keine neue Website.

1. Strato Kunden-Login → **Domains** → **svenmagnus.com**
2. Tab **Webserver**
3. Bei **„Umleitung einrichten“** → **„Umleitung löschen“** oder auf **„Intern“** / deaktiviert stellen
4. Speichern

---

## Schritt 2: Projekte auf Vercel deployen

### Frontend (`web/`)
- Root Directory: `web`
- Domain hinzufügen: `svenmagnus.com` + `www.svenmagnus.com`
- Env: `PUBLIC_PAYLOAD_URL=https://cms.svenmagnus.com`

### CMS (`cms/`)
- Root Directory: `cms`
- Domain hinzufügen: `cms.svenmagnus.com`
- Env: `PAYLOAD_PUBLIC_SERVER_URL=https://cms.svenmagnus.com`
- Env: `CORS_ORIGINS=https://svenmagnus.com,https://www.svenmagnus.com`
- PostgreSQL + Vercel Blob Storage einrichten

Vercel zeigt dir nach dem Domain-Hinzufügen die **genauen DNS-Einträge**.

---

## Schritt 3: DNS bei Strato eintragen

Strato → **Domains** → **svenmagnus.com** → Tab **DNS** (nicht Webserver!)

Typische Einträge für **Vercel**:

| Typ | Name / Host | Wert |
|-----|-------------|------|
| **A** | `@` (oder leer) | `76.76.21.21` |
| **CNAME** | `www` | `cname.vercel-dns.com` |
| **CNAME** | `cms` | `cname.vercel-dns.com.` |

> Den `cms`-Eintrag im Strato-Bereich **„Einen neuen DNS-Eintrag anlegen“** hinzufügen (Typ CNAME, Präfix `cms`, Wert `cname.vercel-dns.com.`).

> **Wichtig:** Die exakten Werte kannst du in Vercel unter *Project → Settings → Domains* ablesen. Vercel zeigt manchmal abweichende IPs — immer die Vercel-Anzeige verwenden.

### Was du **nicht** eintragen sollst
- Keine „Externe Umleitung“ auf Format oder Strato-Hosting
- Kein doppelter A-Record und gleichzeitige Umleitung

---

## Schritt 4: Login-Seite

Nach dem Deployment erreichst du dein Admin-Panel unter:

- **https://svenmagnus.com/log-in** → leitet weiter zu **https://cms.svenmagnus.com/admin**
- Direkt: **https://cms.svenmagnus.com/admin**

Die URL des CMS kannst du im Admin unter **Einstellungen → Domain & Website** anpassen.

---

## Schritt 5: E-Mail (optional, wie bei Format)

Format bot „Professional Email“ über Google Workspace an. Das ist **unabhängig** von der Website:

- **Bei Strato lassen:** MX-Records bei Strato unverändert lassen
- **Google Workspace:** MX-Records auf Google umstellen (in Strato DNS-Tab)

Im CMS unter **Einstellungen → E-Mail** kannst du Notizen und die gewünschte Adresse hinterlegen.

---

## Checkliste

- [ ] Format-Abonnement gekündigt / Domain von Format getrennt
- [ ] Strato: Externe Umleitung gelöscht
- [ ] Vercel: Frontend + CMS deployed
- [ ] Strato DNS: A + CNAME eingetragen
- [ ] `https://svenmagnus.com` zeigt Portfolio
- [ ] `https://svenmagnus.com/log-in` öffnet Admin
- [ ] Fotos im CMS hochgeladen, Frontend neu gebaut

DNS-Änderungen können **bis zu 24–48 Stunden** brauchen, meist aber weniger.
