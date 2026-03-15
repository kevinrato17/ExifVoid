/**
 * ExifVoid Metadata Stripper
 * Removes metadata from images entirely client-side
 *
 * For JPEG: Binary excision of APP1/APP2 segments (zero quality loss)
 * For PNG: Removes text chunks
 * For others: Canvas re-encoding fallback
 */

/**
 * Strip all metadata from a file
 * @param {File} file - The image file to clean
 * @returns {Promise<{blob: Blob, method: string, originalSize: number, cleanedSize: number}>}
 */
export async function stripMetadata(file) {
  const arrayBuffer = await file.arrayBuffer()
  const bytes = new Uint8Array(arrayBuffer)
  const type = file.type.toLowerCase()

  // Read orientation BEFORE stripping metadata
  const orientation = await readOrientation(bytes)
  const needsRotation = orientation && orientation > 1

  if ((type === 'image/jpeg' || type === 'image/jpg') && !needsRotation) {
    // No rotation needed — use fast binary excision (zero quality loss)
    return stripJpegMetadata(bytes, file)
  } else if (type === 'image/png') {
    return stripPngMetadata(bytes, file)
  } else {
    // Needs rotation OR unsupported format — use canvas (applies correct orientation)
    return stripViaCanvas(file, orientation)
  }
}

/**
 * Read EXIF orientation from JPEG bytes
 * Returns orientation value (1-8) or null
 */
function readOrientation(bytes) {
  // Only works for JPEG
  if (bytes[0] !== 0xFF || bytes[1] !== 0xD8) return null

  let offset = 2
  while (offset < bytes.length - 1) {
    if (bytes[offset] !== 0xFF) return null
    const marker = bytes[offset + 1]

    // APP1 marker (EXIF)
    if (marker === 0xE1) {
      const segLen = (bytes[offset + 2] << 8) | bytes[offset + 3]
      // Check for "Exif\0\0"
      if (bytes[offset + 4] === 0x45 && bytes[offset + 5] === 0x78 &&
          bytes[offset + 6] === 0x69 && bytes[offset + 7] === 0x66) {
        return parseOrientationFromExif(bytes, offset + 10, segLen - 8)
      }
      offset += segLen + 2
    } else if (marker === 0xDA) {
      // SOS — stop
      return null
    } else if (marker >= 0xD0 && marker <= 0xD9) {
      offset += 2
    } else {
      if (offset + 3 >= bytes.length) return null
      const len = (bytes[offset + 2] << 8) | bytes[offset + 3]
      offset += len + 2
    }
  }
  return null
}

/**
 * Parse orientation value from TIFF/EXIF data
 */
function parseOrientationFromExif(bytes, tiffStart, maxLen) {
  try {
    // Check byte order
    const bigEndian = bytes[tiffStart] === 0x4D && bytes[tiffStart + 1] === 0x4D
    const read16 = (off) => bigEndian
      ? (bytes[off] << 8) | bytes[off + 1]
      : bytes[off] | (bytes[off + 1] << 8)

    // IFD0 offset
    const ifdOffset = bigEndian
      ? (bytes[tiffStart + 4] << 24) | (bytes[tiffStart + 5] << 16) | (bytes[tiffStart + 6] << 8) | bytes[tiffStart + 7]
      : bytes[tiffStart + 4] | (bytes[tiffStart + 5] << 8) | (bytes[tiffStart + 6] << 16) | (bytes[tiffStart + 7] << 24)

    const ifdStart = tiffStart + ifdOffset
    const entryCount = read16(ifdStart)

    for (let i = 0; i < entryCount; i++) {
      const entryOffset = ifdStart + 2 + (i * 12)
      const tag = read16(entryOffset)
      if (tag === 0x0112) { // Orientation tag
        return read16(entryOffset + 8)
      }
    }
  } catch (e) {
    // Ignore parse errors
  }
  return null
}

/**
 * JPEG Binary Excision
 * Surgically removes APP1 (EXIF/XMP), APP2 (ICC/FlashPix), and COM segments
 * without re-encoding. Zero quality loss.
 */
function stripJpegMetadata(bytes, file) {
  // Verify JPEG SOI marker
  if (bytes[0] !== 0xFF || bytes[1] !== 0xD8) {
    return stripViaCanvas(file)
  }

  const result = []

  // Keep SOI marker
  result.push(0xFF, 0xD8)

  let offset = 2

  while (offset < bytes.length - 1) {
    // Check for marker
    if (bytes[offset] !== 0xFF) {
      // Not a marker, copy rest of file (image data)
      for (let i = offset; i < bytes.length; i++) {
        result.push(bytes[i])
      }
      break
    }

    const marker = bytes[offset + 1]

    // SOS (Start of Scan) - copy everything from here to end
    if (marker === 0xDA) {
      for (let i = offset; i < bytes.length; i++) {
        result.push(bytes[i])
      }
      break
    }

    // EOI (End of Image)
    if (marker === 0xD9) {
      result.push(0xFF, 0xD9)
      break
    }

    // Markers without length (RST, SOI, EOI, TEM)
    if ((marker >= 0xD0 && marker <= 0xD7) || marker === 0xD8 || marker === 0x01) {
      result.push(0xFF, marker)
      offset += 2
      continue
    }

    // Read segment length
    if (offset + 3 >= bytes.length) break
    const segmentLength = (bytes[offset + 2] << 8) | bytes[offset + 3]
    const totalSegmentSize = segmentLength + 2 // +2 for marker bytes

    // Segments to REMOVE:
    // APP1 (0xE1) - EXIF, XMP
    // APP2 (0xE2) - ICC Profile, FlashPix
    // APP3-APP12 (0xE3-0xEC) - Various metadata
    // APP13 (0xED) - Photoshop/IPTC
    // APP14 (0xEE) - Adobe
    // COM (0xFE) - Comments
    const removeMarkers = [
      0xE1, 0xE2, 0xE3, 0xE4, 0xE5, 0xE6, 0xE7,
      0xE8, 0xE9, 0xEA, 0xEB, 0xEC, 0xED, 0xEE, 0xFE,
    ]

    if (removeMarkers.includes(marker)) {
      // Skip this segment entirely
      offset += totalSegmentSize
    } else {
      // Keep this segment (DQT, DHT, SOF, APP0/JFIF, etc.)
      for (let i = 0; i < totalSegmentSize; i++) {
        if (offset + i < bytes.length) {
          result.push(bytes[offset + i])
        }
      }
      offset += totalSegmentSize
    }
  }

  const cleanedArray = new Uint8Array(result)
  const blob = new Blob([cleanedArray], { type: 'image/jpeg' })

  return {
    blob,
    method: 'Binary Excision (Zero Quality Loss)',
    originalSize: file.size,
    cleanedSize: blob.size,
  }
}

/**
 * PNG Metadata Removal
 * Removes tEXt, iTXt, zTXt, eXIf, and other ancillary chunks
 */
function stripPngMetadata(bytes, file) {
  // Verify PNG signature
  const signature = [137, 80, 78, 71, 13, 10, 26, 10]
  for (let i = 0; i < 8; i++) {
    if (bytes[i] !== signature[i]) {
      return stripViaCanvas(file)
    }
  }

  const result = []

  // Copy PNG signature
  for (let i = 0; i < 8; i++) {
    result.push(bytes[i])
  }

  let offset = 8

  // Chunks to remove
  const removeChunks = [
    'tEXt', 'iTXt', 'zTXt', 'eXIf', 'tIME',
    'iCCP', 'sRGB', 'gAMA', 'cHRM', 'pHYs',
  ]

  while (offset < bytes.length) {
    if (offset + 8 > bytes.length) break

    // Read chunk length (4 bytes, big-endian)
    const length = (bytes[offset] << 24) | (bytes[offset + 1] << 16) |
                   (bytes[offset + 2] << 8) | bytes[offset + 3]

    // Read chunk type (4 bytes ASCII)
    const type = String.fromCharCode(
      bytes[offset + 4], bytes[offset + 5],
      bytes[offset + 6], bytes[offset + 7]
    )

    const chunkTotalSize = 4 + 4 + length + 4 // length + type + data + CRC

    if (removeChunks.includes(type)) {
      // Skip this chunk
      offset += chunkTotalSize
    } else {
      // Keep this chunk
      for (let i = 0; i < chunkTotalSize; i++) {
        if (offset + i < bytes.length) {
          result.push(bytes[offset + i])
        }
      }
      offset += chunkTotalSize
    }

    // Stop after IEND
    if (type === 'IEND') break
  }

  const cleanedArray = new Uint8Array(result)
  const blob = new Blob([cleanedArray], { type: 'image/png' })

  return {
    blob,
    method: 'Chunk Removal (Zero Quality Loss)',
    originalSize: file.size,
    cleanedSize: blob.size,
  }
}

/**
 * Canvas fallback — also handles orientation correction
 * Re-encodes via Canvas which naturally strips metadata
 * Applies EXIF orientation to ensure correct display
 */
function stripViaCanvas(file, orientation) {
  return new Promise((resolve) => {
    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      let width = img.naturalWidth
      let height = img.naturalHeight

      // Swap dimensions for 90/270 degree rotations
      const swap = orientation && [5, 6, 7, 8].includes(orientation)
      const canvasW = swap ? height : width
      const canvasH = swap ? width : height

      const canvas = document.createElement('canvas')
      canvas.width = canvasW
      canvas.height = canvasH

      const ctx = canvas.getContext('2d')

      // Apply orientation transform
      if (orientation) {
        switch (orientation) {
          case 2: ctx.transform(-1, 0, 0, 1, canvasW, 0); break
          case 3: ctx.transform(-1, 0, 0, -1, canvasW, canvasH); break
          case 4: ctx.transform(1, 0, 0, -1, 0, canvasH); break
          case 5: ctx.transform(0, 1, 1, 0, 0, 0); break
          case 6: ctx.transform(0, 1, -1, 0, canvasH, 0); break
          case 7: ctx.transform(0, -1, -1, 0, canvasH, canvasW); break
          case 8: ctx.transform(0, -1, 1, 0, 0, canvasW); break
          default: break
        }
      }

      ctx.drawImage(img, 0, 0)

      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(url)
          resolve({
            blob,
            method: orientation > 1 ? 'Canvas Re-encoding (Orientation Corrected)' : 'Canvas Re-encoding',
            originalSize: file.size,
            cleanedSize: blob.size,
          })
        },
        file.type || 'image/jpeg',
        0.95
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
