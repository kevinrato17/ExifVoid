/**
 * Analyze metadata categories and assign threat levels
 * Returns a privacy risk score and summary
 */

export function analyzeThreat(organized) {
  const threats = []
  let totalScore = 0
  let maxScore = 0

  // Scoring weights per category
  const weights = {
    location: { weight: 40, label: 'GPS Location Exposed' },
    identifiers: { weight: 25, label: 'Unique Device IDs Found' },
    camera: { weight: 15, label: 'Camera Fingerprint Visible' },
    datetime: { weight: 10, label: 'Timestamps Embedded' },
    software: { weight: 10, label: 'Software/Owner Info Present' },
    settings: { weight: 5, label: 'Camera Settings Visible' },
    image: { weight: 3, label: 'Image Properties' },
    other: { weight: 2, label: 'Additional Metadata' },
  }

  Object.entries(weights).forEach(([key, config]) => {
    maxScore += config.weight
    if (organized[key] && organized[key].items.length > 0) {
      totalScore += config.weight
      threats.push({
        category: key,
        label: config.label,
        severity: getSeverity(config.weight),
        itemCount: organized[key].items.length,
        icon: organized[key].icon,
        description: getDescription(key, organized[key].items),
      })
    }
  })

  const riskPercentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0
  const riskLevel = getRiskLevel(riskPercentage)

  return {
    threats,
    riskPercentage,
    riskLevel,
    totalFields: Object.values(organized).reduce((acc, cat) => acc + cat.items.length, 0),
    summary: getSummary(riskLevel, threats),
  }
}

function getSeverity(weight) {
  if (weight >= 25) return 'high'
  if (weight >= 10) return 'medium'
  return 'low'
}

function getRiskLevel(percentage) {
  if (percentage >= 50) return 'critical'
  if (percentage >= 30) return 'high'
  if (percentage >= 15) return 'medium'
  if (percentage > 0) return 'low'
  return 'clean'
}

function getDescription(category, items) {
  const descriptions = {
    location: 'Your exact GPS coordinates are embedded in this photo. Anyone who downloads it can pinpoint where it was taken.',
    identifiers: 'Unique serial numbers can be used to link this photo to your specific device across multiple uploads.',
    camera: 'Camera make, model, and lens information can narrow down the equipment you own.',
    datetime: 'Exact timestamps reveal when photos were taken, potentially revealing your schedule and routines.',
    software: 'Software and device information can reveal your operating system, editing tools, and sometimes your name.',
    settings: 'Camera settings like aperture and ISO reveal shooting conditions but pose minimal privacy risk.',
    image: 'Basic image dimensions and color information. Generally low risk.',
    other: 'Additional metadata fields that may contain various information.',
  }
  return descriptions[category] || 'Metadata fields found in this category.'
}

function getSummary(riskLevel, threats) {
  const hasLocation = threats.some(t => t.category === 'location')
  const hasIdentifiers = threats.some(t => t.category === 'identifiers')

  if (riskLevel === 'critical') {
    if (hasLocation) {
      return 'Your photo contains GPS coordinates that reveal your exact location. Anyone downloading this image can find where you were.'
    }
    return 'This photo contains significant personal information that could compromise your privacy.'
  }
  if (riskLevel === 'high') {
    return 'This photo contains metadata that could be used to identify you or your device.'
  }
  if (riskLevel === 'medium') {
    return 'Some metadata is present that could reveal information about your device and habits.'
  }
  if (riskLevel === 'low') {
    return 'Minimal metadata found. Low privacy risk, but cleaning is still recommended.'
  }
  return 'No significant metadata detected. This photo appears clean.'
}

/**
 * Get color classes for threat levels
 */
export function getThreatColor(severity) {
  switch (severity) {
    case 'high':
    case 'critical':
      return {
        bg: 'bg-danger/10',
        border: 'border-danger/30',
        text: 'text-danger',
        dot: 'bg-danger',
      }
    case 'medium':
      return {
        bg: 'bg-warning/10',
        border: 'border-warning/30',
        text: 'text-warning',
        dot: 'bg-warning',
      }
    default:
      return {
        bg: 'bg-safe/10',
        border: 'border-safe/30',
        text: 'text-safe',
        dot: 'bg-safe',
      }
  }
}

export function getRiskColor(riskLevel) {
  switch (riskLevel) {
    case 'critical': return { color: 'text-danger', bg: 'bg-danger' }
    case 'high': return { color: 'text-danger', bg: 'bg-danger' }
    case 'medium': return { color: 'text-warning', bg: 'bg-warning' }
    case 'low': return { color: 'text-safe', bg: 'bg-safe' }
    case 'clean': return { color: 'text-safe', bg: 'bg-safe' }
    default: return { color: 'text-muted', bg: 'bg-muted' }
  }
}
