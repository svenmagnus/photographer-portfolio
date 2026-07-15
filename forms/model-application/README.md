# Model-Bewerbungsformular

Modulares Bewerbungsformular für ein kostenloses Model-Fotoshooting — mit Pola-Upload, Validierung und E-Mail-Versand.

## Dateien in diesem Ordner

| Datei | Zweck |
|-------|--------|
| `standalone.html` | Komplette HTML-Seite mit **Tailwind CDN** — zum Kopieren in WordPress, Webflow, Custom HTML |
| `model-application-form.js` | Vanilla JavaScript: Validierung, Altersberechnung, Bild-Vorschau, Drag & Drop |
| `model-application-form.css` | Alternative ohne Tailwind — Farben über CSS-Variablen (`--maf-*`) |

## Integration in **diese Website** (Astro + Payload CMS)

Das Formular ist bereits ins Projekt eingebunden:

1. **CMS-Block:** `Model-Bewerbungsformular` unter Seiten → Layout hinzufügen
2. **Frontend:** `web/src/components/blocks/ModelApplicationForm.astro`
3. **API:** `POST /api/model-application` (multipart, 4 Fotos als E-Mail-Anhang)
4. **JavaScript:** `web/public/forms/model-application-form.js`

### Neue Seite anlegen

Die Seite wird beim CMS-Start automatisch angelegt:

- **URL:** `/model-bewerbung`
- **Slug:** `model-bewerbung`
- **Menü:** standardmäßig ausgeblendet — im CMS unter Seiten → „In Navigation anzeigen“ aktivieren oder im Menü-Editor verlinken

Falls die Seite fehlt: CMS neu deployen (onInit legt sie an).

### Felder & Texte anpassen

| Was | Wo |
|-----|-----|
| Einleitung, Button, Erfolgsmeldung, Datenschutz-Link | CMS-Block-Einstellungen |
| Feld-Labels, Pola-Richtlinien, Dropdown-Optionen | `ModelApplicationForm.astro` (Abschnitte kommentiert) |
| Validierungs-Texte, Upload-Limits | `model-application-form.js` → `MODEL_FORM_MESSAGES` / `MODEL_FORM_LIMITS` |
| Farben | CSS-Variablen in `ModelApplicationForm.astro` `<style>` oder `model-application-form.css` |

### E-Mail-Empfänger

Wie beim Kontaktformular: **Website-Einstellungen → Kontakt-E-Mail** (oder Professional E-Mail).  
SMTP muss in Vercel konfiguriert sein (`SMTP_*`).

---

## Standalone-Nutzung (andere Systeme)

1. Ordner `forms/model-application/` auf den Server kopieren
2. In `standalone.html` den `apiUrl`-Wert anpassen
3. Seite aufrufen oder HTML-Inhalt in ein Widget einfügen

**Ohne Tailwind:** Zeile mit CDN-Script entfernen, stattdessen `model-application-form.css` einbinden, Klassen `maf-*` aus dem CSS nutzen.

---

## Formularstruktur

1. **Einleitung** — Polas reichen, keine Profi-Fotos nötig  
2. **Persönliche Daten** — Name, Geburtsdatum, Alter, Wohnort, Kontakt, Social Media  
3. **Körpermaße** — Raster mit cm-Angaben, Konfektion, Schuhgröße, Haar/Augen  
4. **Polas** — 4 Upload-Felder mit Vorschau (vorne, hinten, Profil, Porträt)  
5. **DSGVO + Absenden**

---

## Technische Hinweise

- **Spam-Schutz:** Honeypot-Feld `website` (muss leer bleiben)
- **Max. Dateigröße:** 8 MB pro Foto (in JS und Server identisch)
- **Formate:** JPG, PNG, WebP, HEIC
- **CORS:** Frontend-Domain muss in `CORS_ORIGINS` (CMS) eingetragen sein
