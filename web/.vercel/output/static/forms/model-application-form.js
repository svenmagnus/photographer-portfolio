/**
 * ============================================================================
 * MODEL-BEWERBUNGSFORMULAR — Vanilla JavaScript
 * ============================================================================
 *
 * Wiederverwendbare Logik für Validierung, Altersberechnung, Bild-Vorschau
 * und Formular-Absendung (multipart/form-data mit Foto-Uploads).
 *
 * VERWENDUNG:
 *   initModelApplicationForm({
 *     form: '#model-application-form',          // CSS-Selektor oder DOM-Element
 *     apiUrl: 'https://cms.example.com/api/model-application',
 *     successMessage: 'Vielen Dank für deine Bewerbung!',
 *   })
 *
 * ANPASSUNG:
 *   - Texte/Fehlermeldungen: MODEL_FORM_MESSAGES unten
 *   - Upload-Limits: MODEL_FORM_LIMITS unten
 *   - Farben/Styling: über CSS-Variablen in model-application-form.css
 *     oder Tailwind-Klassen im HTML
 * ============================================================================
 */

/* --------------------------------------------------------------------------
 * KONFIGURATION — Grenzwerte für Uploads (hier anpassen)
 * -------------------------------------------------------------------------- */
const MODEL_FORM_LIMITS = {
  /** Max. Dateigröße pro Foto in Bytes (Standard: 8 MB) */
  maxFileSizeBytes: 8 * 1024 * 1024,
  /** Erlaubte Bild-MIME-Typen */
  allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'],
  /** Erlaubte Dateiendungen (zusätzliche Prüfung) */
  allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp', '.heic', '.heif'],
}

/* --------------------------------------------------------------------------
 * TEXTE — Validierungs- und Statusmeldungen (über options.messages überschreibbar)
 * -------------------------------------------------------------------------- */
const DEFAULT_MODEL_FORM_MESSAGES = {
  required: 'Bitte dieses Pflichtfeld ausfüllen.',
  invalidEmail: 'Bitte eine gültige E-Mail-Adresse angeben.',
  invalidPhone: 'Bitte eine gültige Telefonnummer angeben.',
  invalidAge: 'Bitte ein gültiges Alter zwischen 14 und 99 angeben.',
  invalidNumber: 'Bitte eine gültige Zahl angeben.',
  privacyRequired: 'Bitte der Datenschutzerklärung zustimmen.',
  photoRequired: 'Bitte ein Foto hochladen.',
  photoTooLarge: 'Die Datei ist zu groß (max. 8 MB).',
  photoInvalidType: 'Bitte nur JPG, PNG oder WebP hochladen.',
  sending: 'Wird gesendet …',
  sendError: 'Senden fehlgeschlagen. Bitte später erneut versuchen.',
  networkError: 'Verbindungsfehler. Bitte Internetverbindung prüfen.',
  validationSummary: 'Bitte alle markierten Felder prüfen.',
}

/**
 * Berechnet das Alter aus einem ISO-Datum (YYYY-MM-DD).
 * @param {string} birthDate
 * @returns {number|null}
 */
function calculateAgeFromBirthDate(birthDate) {
  if (!birthDate) return null
  const birth = new Date(birthDate)
  if (Number.isNaN(birth.getTime())) return null

  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age -= 1
  }
  return age
}

/**
 * Zeigt oder versteckt eine Fehlermeldung unter einem Feld.
 * @param {HTMLElement|null} fieldWrapper
 * @param {string|null} message
 */
function setFieldError(fieldWrapper, message) {
  if (!fieldWrapper) return
  const errorEl = fieldWrapper.querySelector('[data-field-error]')
  fieldWrapper.classList.toggle('maf-field--error', Boolean(message))
  if (errorEl) {
    errorEl.textContent = message || ''
    errorEl.hidden = !message
  }
}

/**
 * Liest einen String-Wert aus FormData.
 * @param {FormData} formData
 * @param {string} name
 */
function getTrimmed(formData, name) {
  return String(formData.get(name) || '').trim()
}

/**
 * Prüft, ob eine Datei ein erlaubtes Bildformat hat.
 * @param {File} file
 */
function isAllowedImageFile(file) {
  if (!file || !file.name) return false
  const lowerName = file.name.toLowerCase()
  const hasAllowedExt = MODEL_FORM_LIMITS.allowedExtensions.some((ext) => lowerName.endsWith(ext))
  const hasAllowedMime =
    !file.type || MODEL_FORM_LIMITS.allowedMimeTypes.includes(file.type.toLowerCase())
  return hasAllowedExt && hasAllowedMime
}

/**
 * Entfernt Vorschau und setzt ein Upload-Feld zurück.
 * @param {HTMLElement} uploadBox
 */
function clearUploadBox(uploadBox) {
  const input = uploadBox.querySelector('input[type="file"]')
  const preview = uploadBox.querySelector('[data-upload-preview]')
  const placeholder = uploadBox.querySelector('[data-upload-placeholder]')
  const removeBtn = uploadBox.querySelector('[data-upload-remove]')

  if (input instanceof HTMLInputElement) {
    input.value = ''
  }

  if (preview instanceof HTMLImageElement) {
    preview.hidden = true
    if (preview.src.startsWith('blob:')) {
      URL.revokeObjectURL(preview.src)
    }
    preview.removeAttribute('src')
    preview.alt = ''
  }

  uploadBox.classList.remove('maf-upload--filled', 'maf-upload--dragover', 'maf-upload--error')

  if (placeholder instanceof HTMLElement) {
    placeholder.hidden = false
  }
  if (removeBtn instanceof HTMLElement) {
    removeBtn.hidden = true
  }

  setFieldError(uploadBox.closest('[data-field]'), null)
}

/**
 * Initialisiert Drag & Drop und Klick-Upload für ein Pola-Feld.
 * @param {HTMLElement} uploadBox — Container mit data-upload-box
 */
function initUploadBox(uploadBox) {
  const input = uploadBox.querySelector('input[type="file"]')
  const preview = uploadBox.querySelector('[data-upload-preview]')
  const placeholder = uploadBox.querySelector('[data-upload-placeholder]')
  const removeBtn = uploadBox.querySelector('[data-upload-remove]')

  if (!(input instanceof HTMLInputElement)) return

  /** Aktualisiert die Vorschau nach Dateiauswahl */
  function showPreview(file) {
    if (!file || !preview || !(preview instanceof HTMLImageElement)) return

    if (preview.src.startsWith('blob:')) {
      URL.revokeObjectURL(preview.src)
    }

    const objectUrl = URL.createObjectURL(file)
    preview.src = objectUrl
    preview.alt = file.name
    preview.hidden = false
    uploadBox.classList.add('maf-upload--filled')

    if (placeholder) placeholder.hidden = true
    if (removeBtn) removeBtn.hidden = false
  }

  input.addEventListener('change', () => {
    const file = input.files?.[0]
    if (file) showPreview(file)
    else clearUploadBox(uploadBox)
  })

  if (removeBtn) {
    removeBtn.addEventListener('click', (event) => {
      event.preventDefault()
      event.stopPropagation()
      clearUploadBox(uploadBox)
    })
  }

  /** Drag & Drop Events */
  ;['dragenter', 'dragover'].forEach((eventName) => {
    uploadBox.addEventListener(eventName, (event) => {
      event.preventDefault()
      uploadBox.classList.add('maf-upload--dragover')
    })
  })

  ;['dragleave', 'drop'].forEach((eventName) => {
    uploadBox.addEventListener(eventName, (event) => {
      event.preventDefault()
      uploadBox.classList.remove('maf-upload--dragover')
    })
  })

  uploadBox.addEventListener('drop', (event) => {
    const file = event.dataTransfer?.files?.[0]
    if (!file) return

    const dataTransfer = new DataTransfer()
    dataTransfer.items.add(file)
    input.files = dataTransfer.files
    showPreview(file)
  })

  /** Klick auf die Box öffnet den Datei-Dialog (außer Remove-Button) */
  uploadBox.addEventListener('click', (event) => {
    if (event.target instanceof HTMLElement && event.target.closest('[data-upload-remove]')) return
    input.click()
  })
}

/**
 * Validiert alle Formularfelder clientseitig.
 * @param {HTMLFormElement} form
 * @returns {{ ok: true, formData: FormData } | { ok: false }}
 */
function validateModelApplicationForm(form, messages) {
  const formData = new FormData(form)
  let isValid = true

  /** Honeypot-Feld (Spam-Schutz) — muss leer bleiben */
  if (getTrimmed(formData, 'website')) {
    return { ok: false }
  }

  /** Pflicht-Textfelder */
  const requiredFields = [
    'firstName',
    'lastName',
    'birthDate',
    'location',
    'email',
    'phone',
    'heightCm',
    'bustCm',
    'waistCm',
    'hipsCm',
    'clothingSize',
    'shoeSize',
    'hairColor',
    'eyeColor',
  ]

  requiredFields.forEach((name) => {
    const wrapper = form.querySelector(`[data-field="${name}"]`)
    const value = getTrimmed(formData, name)
    if (!value) {
      setFieldError(wrapper, messages.required)
      isValid = false
    } else {
      setFieldError(wrapper, null)
    }
  })

  /** E-Mail */
  const emailWrapper = form.querySelector('[data-field="email"]')
  const email = getTrimmed(formData, 'email')
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    setFieldError(emailWrapper, messages.invalidEmail)
    isValid = false
  }

  /** Alter — optional manuell, wird sonst aus Geburtsdatum berechnet */
  const ageWrapper = form.querySelector('[data-field="age"]')
  const ageValue = getTrimmed(formData, 'age')
  const birthDate = getTrimmed(formData, 'birthDate')
  const computedAge = calculateAgeFromBirthDate(birthDate)
  const ageNumber = ageValue ? Number.parseInt(ageValue, 10) : computedAge

  if (ageNumber == null || Number.isNaN(ageNumber) || ageNumber < 14 || ageNumber > 99) {
    setFieldError(ageWrapper, messages.invalidAge)
    isValid = false
  } else {
    setFieldError(ageWrapper, null)
  }

  /** Zahlenfelder (Körpermaße) */
  ;['heightCm', 'bustCm', 'waistCm', 'hipsCm', 'shoeSize'].forEach((name) => {
    const wrapper = form.querySelector(`[data-field="${name}"]`)
    const raw = getTrimmed(formData, name)
    const num = Number.parseFloat(raw.replace(',', '.'))
    if (raw && (Number.isNaN(num) || num <= 0)) {
      setFieldError(wrapper, messages.invalidNumber)
      isValid = false
    }
  })

  /** Pflicht-Fotos */
  ;[
    { name: 'polaFront', label: 'Ganzkörper vorne' },
    { name: 'polaBack', label: 'Ganzkörper hinten' },
    { name: 'polaProfile', label: 'Profil' },
    { name: 'polaPortrait', label: 'Porträt' },
  ].forEach(({ name }) => {
    const wrapper = form.querySelector(`[data-field="${name}"]`)
    const input = form.querySelector(`input[name="${name}"]`)
    const file = input instanceof HTMLInputElement ? input.files?.[0] : null

    if (!file) {
      setFieldError(wrapper, messages.photoRequired)
      isValid = false
      return
    }

    if (file.size > MODEL_FORM_LIMITS.maxFileSizeBytes) {
      setFieldError(wrapper, messages.photoTooLarge)
      isValid = false
      return
    }

    if (!isAllowedImageFile(file)) {
      setFieldError(wrapper, messages.photoInvalidType)
      isValid = false
      return
    }

    setFieldError(wrapper, null)
  })

  /** DSGVO-Checkbox */
  const privacyWrapper = form.querySelector('[data-field="privacyConsent"]')
  const privacyChecked = formData.get('privacyConsent') === 'on'
  if (!privacyChecked) {
    setFieldError(privacyWrapper, messages.privacyRequired)
    isValid = false
  } else {
    setFieldError(privacyWrapper, null)
  }

  if (!isValid) return { ok: false }
  return { ok: true, formData }
}

/**
 * Hauptfunktion — bindet Validierung, Altersberechnung und Absenden.
 * @param {object} options
 * @param {string|HTMLFormElement} options.form
 * @param {string} options.apiUrl — POST-Endpunkt (multipart/form-data)
 * @param {string} [options.successMessage]
 * @param {object} [options.messages] — lokalisierte Validierungs- und Statusmeldungen
 */
function initModelApplicationForm(options) {
  const messages = { ...DEFAULT_MODEL_FORM_MESSAGES, ...options.messages }

  const form =
    typeof options.form === 'string'
      ? document.querySelector(options.form)
      : options.form

  if (!(form instanceof HTMLFormElement)) {
    console.warn('[ModelApplicationForm] Formular nicht gefunden:', options.form)
    return
  }

  const statusEl = form.querySelector('[data-form-status]')
  const submitBtn = form.querySelector('[data-submit-button]')
  const submitLabel = submitBtn instanceof HTMLButtonElement ? submitBtn.textContent : 'Absenden'
  const birthDateInput = form.querySelector('input[name="birthDate"]')
  const ageInput = form.querySelector('input[name="age"]')

  /** Upload-Felder initialisieren */
  form.querySelectorAll('[data-upload-box]').forEach((box) => {
    if (box instanceof HTMLElement) initUploadBox(box)
  })

  /** Alter automatisch aus Geburtsdatum berechnen */
  if (birthDateInput instanceof HTMLInputElement && ageInput instanceof HTMLInputElement) {
    birthDateInput.addEventListener('change', () => {
      const age = calculateAgeFromBirthDate(birthDateInput.value)
      if (age != null) ageInput.value = String(age)
    })
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault()

    if (statusEl instanceof HTMLElement) {
      statusEl.textContent = ''
      statusEl.hidden = true
      statusEl.classList.remove('maf-status--error', 'maf-status--success')
    }

    const validation = validateModelApplicationForm(form, messages)
    if (!validation.ok) {
      if (statusEl instanceof HTMLElement) {
        statusEl.textContent = messages.validationSummary
        statusEl.hidden = false
        statusEl.classList.add('maf-status--error')
      }
      const firstError = form.querySelector('.maf-field--error, .maf-upload--error')
      firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    if (!(submitBtn instanceof HTMLButtonElement)) return

    submitBtn.disabled = true
    submitBtn.textContent = messages.sending

    try {
      const response = await fetch(options.apiUrl, {
        method: 'POST',
        body: validation.formData,
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(data.error || messages.sendError)
      }

      form.querySelectorAll('[data-upload-box]').forEach((box) => {
        if (box instanceof HTMLElement) clearUploadBox(box)
      })
      form.reset()
      form.classList.add('maf-form--submitted')

      const section = form.closest('.maf-section')
      section?.classList.add('maf-section--submitted')
      const pageHeading = section?.previousElementSibling
      if (pageHeading instanceof HTMLElement && pageHeading.querySelector('h1')) {
        pageHeading.hidden = true
      }

      if (statusEl instanceof HTMLElement) {
        statusEl.textContent = options.successMessage || 'Vielen Dank für deine Bewerbung!'
        statusEl.hidden = false
        statusEl.classList.add('maf-status--success')
        statusEl.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    } catch (error) {
      if (statusEl instanceof HTMLElement) {
        statusEl.textContent =
          error instanceof Error ? error.message : messages.networkError
        statusEl.hidden = false
        statusEl.classList.add('maf-status--error')
      }
    } finally {
      submitBtn.disabled = false
      submitBtn.textContent = submitLabel
    }
  })
}

/** Global verfügbar machen (für Standalone-HTML und Astro) */
window.initModelApplicationForm = initModelApplicationForm
