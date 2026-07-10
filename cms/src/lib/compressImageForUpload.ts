const MAX_BYTES = 3 * 1024 * 1024
const MAX_EDGE = 2400

function withRelativePath(file: File, relativePath?: string): File {
  if (relativePath) {
    Object.defineProperty(file, 'webkitRelativePath', {
      value: relativePath,
      configurable: true,
    })
  }

  return file
}

async function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const image = new Image()

    image.onload = () => {
      URL.revokeObjectURL(url)
      resolve(image)
    }

    image.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error(`Bild konnte nicht gelesen werden: ${file.name}`))
    }

    image.src = url
  })
}

function drawScaledImage(image: HTMLImageElement, maxEdge: number): HTMLCanvasElement {
  let width = image.naturalWidth
  let height = image.naturalHeight

  if (width > maxEdge || height > maxEdge) {
    if (width > height) {
      height = Math.round((height * maxEdge) / width)
      width = maxEdge
    } else {
      width = Math.round((width * maxEdge) / height)
      height = maxEdge
    }
  }

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  const context = canvas.getContext('2d')
  if (!context) {
    throw new Error('Bildverarbeitung im Browser nicht verfügbar')
  }

  context.drawImage(image, 0, 0, width, height)
  return canvas
}

async function encodeCanvas(
  canvas: HTMLCanvasElement,
  mimeType: string,
  quality: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob)
          return
        }

        reject(new Error('Komprimierung fehlgeschlagen'))
      },
      mimeType,
      quality,
    )
  })
}

export async function prepareImageForUpload(file: File): Promise<File> {
  const relativePath = file.webkitRelativePath
  const basename = file.name.replace(/\.[^.]+$/i, '')

  if (file.size <= MAX_BYTES) {
    return file
  }

  const image = await loadImage(file)
  let maxEdge = MAX_EDGE

  for (let round = 0; round < 6; round += 1) {
    const canvas = drawScaledImage(image, maxEdge)

    for (const quality of [0.88, 0.8, 0.72, 0.64, 0.56, 0.48, 0.4]) {
      for (const mimeType of ['image/webp', 'image/jpeg'] as const) {
        const blob = await encodeCanvas(canvas, mimeType, quality)

        if (blob.size <= MAX_BYTES) {
          const extension = mimeType === 'image/webp' ? 'webp' : 'jpg'
          const compressed = new File([blob], `${basename}.${extension}`, {
            type: mimeType,
            lastModified: Date.now(),
          })

          const nextPath = relativePath
            ? relativePath.replace(/\.[^.]+$/i, `.${extension}`)
            : undefined

          return withRelativePath(compressed, nextPath)
        }
      }
    }

    maxEdge = Math.round(maxEdge * 0.82)
  }

  throw new Error(`${file.name} konnte nicht klein genug komprimiert werden`)
}
