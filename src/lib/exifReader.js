import exifr from 'exifr'

/**
 * Read all metadata from an image file
 * Returns structured metadata organized by category
 */
export async function readMetadata(file) {
  try {
    // Parse all available metadata
    const allData = await exifr.parse(file, {
      tiff: true,
      xmp: true,
      icc: true,
      iptc: true,
      jfif: true,
      ihdr: true,
      gps: true,
      exif: true,
      translateKeys: true,
      translateValues: true,
      reviveValues: true,
      mergeOutput: false,
    })

    // Get GPS coordinates specifically
    const gps = await exifr.gps(file).catch(() => null)

    // Get thumbnail if available
    const thumbnail = await exifr.thumbnail(file).catch(() => null)

    // Organize into categories
    const organized = organizeMetadata(allData, gps)

    return {
      raw: allData,
      organized,
      gps,
      thumbnail: thumbnail ? URL.createObjectURL(new Blob([thumbnail])) : null,
      hasMetadata: allData && Object.keys(allData).length > 0,
    }
  } catch (error) {
    console.error('Metadata reading error:', error)
    return {
      raw: null,
      organized: {},
      gps: null,
      thumbnail: null,
      hasMetadata: false,
      error: error.message,
    }
  }
}

/**
 * Organize raw metadata into human-readable categories
 */
function organizeMetadata(data, gps) {
  if (!data) return {}

  const categories = {
    location: { label: 'Location Data', icon: '📍', items: [], threat: 'high' },
    camera: { label: 'Camera Info', icon: '📷', items: [], threat: 'medium' },
    settings: { label: 'Camera Settings', icon: '⚙️', items: [], threat: 'low' },
    datetime: { label: 'Date & Time', icon: '🕐', items: [], threat: 'medium' },
    software: { label: 'Software & Device', icon: '💻', items: [], threat: 'medium' },
    image: { label: 'Image Properties', icon: '🖼️', items: [], threat: 'low' },
    identifiers: { label: 'Unique Identifiers', icon: '🔑', items: [], threat: 'high' },
    other: { label: 'Other Metadata', icon: '📋', items: [], threat: 'low' },
  }

  // Flatten all data sections
  const flat = {}
  if (data) {
    Object.entries(data).forEach(([section, values]) => {
      if (typeof values === 'object' && values !== null && !Array.isArray(values)) {
        Object.entries(values).forEach(([key, value]) => {
          flat[key] = value
        })
      }
    })
    // Also merge top-level if data was merged
    Object.entries(data).forEach(([key, value]) => {
      if (typeof value !== 'object' || value === null || value instanceof Date) {
        flat[key] = value
      }
    })
  }

  // GPS / Location fields
  const locationKeys = ['GPSLatitude', 'GPSLongitude', 'GPSAltitude', 'GPSLatitudeRef',
    'GPSLongitudeRef', 'GPSAltitudeRef', 'GPSTimeStamp', 'GPSDateStamp',
    'GPSSpeed', 'GPSImgDirection', 'latitude', 'longitude']

  // Camera identification
  const cameraKeys = ['Make', 'Model', 'LensModel', 'LensMake', 'LensInfo',
    'BodySerialNumber', 'LensSerialNumber', 'InternalSerialNumber',
    'SerialNumber', 'CameraSerialNumber']

  // Camera settings
  const settingsKeys = ['ExposureTime', 'FNumber', 'ISO', 'ISOSpeedRatings',
    'ShutterSpeedValue', 'ApertureValue', 'BrightnessValue',
    'ExposureBiasValue', 'MaxApertureValue', 'MeteringMode',
    'Flash', 'FocalLength', 'FocalLengthIn35mmFormat', 'WhiteBalance',
    'ExposureMode', 'ExposureProgram', 'SceneCaptureType']

  // Date/time fields
  const dateKeys = ['DateTimeOriginal', 'DateTimeDigitized', 'DateTime',
    'CreateDate', 'ModifyDate', 'OffsetTime', 'OffsetTimeOriginal',
    'GPSDateStamp', 'SubSecTimeOriginal']

  // Software/device
  const softwareKeys = ['Software', 'HostComputer', 'ProcessingSoftware',
    'Creator', 'Artist', 'Copyright', 'Rights', 'CameraOwnerName',
    'OwnerName', 'Author']

  // Image properties
  const imageKeys = ['ImageWidth', 'ImageHeight', 'XResolution', 'YResolution',
    'ResolutionUnit', 'ColorSpace', 'BitsPerSample', 'Compression',
    'Orientation', 'PixelXDimension', 'PixelYDimension']

  // Unique identifiers
  const identifierKeys = ['ImageUniqueID', 'DocumentID', 'InstanceID',
    'OriginalDocumentID', 'BodySerialNumber', 'LensSerialNumber',
    'SerialNumber', 'InternalSerialNumber']

  // Add GPS data
  if (gps) {
    categories.location.items.push(
      { key: 'Latitude', value: gps.latitude?.toFixed(6) },
      { key: 'Longitude', value: gps.longitude?.toFixed(6) },
    )
  }

  // Categorize each field
  Object.entries(flat).forEach(([key, value]) => {
    if (value === undefined || value === null) return

    const displayValue = formatValue(key, value)
    const item = { key: formatKey(key), value: displayValue, rawKey: key }

    if (locationKeys.includes(key)) {
      categories.location.items.push(item)
    } else if (identifierKeys.includes(key)) {
      categories.identifiers.items.push(item)
    } else if (cameraKeys.includes(key)) {
      categories.camera.items.push(item)
    } else if (settingsKeys.includes(key)) {
      categories.settings.items.push(item)
    } else if (dateKeys.includes(key)) {
      categories.datetime.items.push(item)
    } else if (softwareKeys.includes(key)) {
      categories.software.items.push(item)
    } else if (imageKeys.includes(key)) {
      categories.image.items.push(item)
    } else {
      categories.other.items.push(item)
    }
  })

  // Remove empty categories
  const filtered = {}
  Object.entries(categories).forEach(([key, cat]) => {
    if (cat.items.length > 0) {
      // Deduplicate items by key
      const seen = new Set()
      cat.items = cat.items.filter(item => {
        const k = item.key
        if (seen.has(k)) return false
        seen.add(k)
        return true
      })
      filtered[key] = cat
    }
  })

  return filtered
}

function formatKey(key) {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, s => s.toUpperCase())
    .replace(/G P S/g, 'GPS')
    .replace(/I S O/g, 'ISO')
    .replace(/X M P/g, 'XMP')
    .trim()
}

function formatValue(key, value) {
  if (value instanceof Date) {
    return value.toLocaleString()
  }
  if (typeof value === 'number') {
    if (key.includes('Latitude') || key.includes('Longitude')) {
      return value.toFixed(6) + '°'
    }
    if (key === 'ExposureTime' && value < 1) {
      return `1/${Math.round(1 / value)}s`
    }
    if (key === 'FNumber') {
      return `f/${value}`
    }
    if (key.includes('FocalLength')) {
      return `${value}mm`
    }
    return value.toString()
  }
  if (Array.isArray(value)) {
    return value.join(', ')
  }
  if (typeof value === 'object') {
    return JSON.stringify(value)
  }
  return String(value)
}

/**
 * Count total metadata fields found
 */
export function countMetadata(organized) {
  let total = 0
  Object.values(organized).forEach(cat => {
    total += cat.items.length
  })
  return total
}
