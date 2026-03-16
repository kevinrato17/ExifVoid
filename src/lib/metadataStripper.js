/**
 * ExifVoid Metadata Stripper
 * Removes metadata from images entirely client-side
 *
 * Uses canvas re-encoding for all formats.
 * Modern browsers automatically apply EXIF orientation when drawing
 * to canvas, so the output is always correctly oriented.
 * Quality is set to 0.95 for JPEG — visually indistinguishable from original.
 */

import JSZip from 'jszip'

/**
 * Strip all metadata from a file
 * @param {File} file - The image file to clean
 * @returns {Promise<{blob: Blob, method: string, originalSize: number, cleanedSize: number}>}
 */
export async function stripMetadata(file) {
  return new Promise((resolve) => {
    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight

      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

      // Use original file type, default to JPEG
      const outputType = file.type === 'image/png' ? 'image/png' : 'image/jpeg'
      const quality = outputType === 'image/jpeg' ? 0.95 : undefined

      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(url)
          resolve({
            blob,
            method: 'Clean & Re-encoded (Metadata Stripped)',
            originalSize: file.size,
            cleanedSize: blob.size,
          })
        },
        outputType,
        quality
      )
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      resolve({
        blob: file,
        method: 'Failed — Original returned',
        originalSize: file.size,
        cleanedSize: file.size,
      })
    }

    img.src = url
  })
}

/**
 * Generate a clean filename
 */
export function getCleanFilename(originalName) {
  const dotIndex = originalName.lastIndexOf('.')
  if (dotIndex === -1) return originalName + '_clean'
  const name = originalName.substring(0, dotIndex)
  const ext = originalName.substring(dotIndex)
  return `${name}_clean${ext}`
}

/**
 * Trigger download of cleaned file
 */
export function downloadCleanFile(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/**
 * Download multiple cleaned files as a ZIP archive
 * @param {Array<{blob: Blob, filename: string}>} files - Array of cleaned file objects
 */
export async function downloadAllAsZip(files) {
  const zip = new JSZip()

  files.forEach(({ blob, filename }) => {
    zip.file(filename, blob)
  })

  const zipBlob = await zip.generateAsync({ type: 'blob' })
  downloadCleanFile(zipBlob, 'exifvoid_cleaned.zip')
}
