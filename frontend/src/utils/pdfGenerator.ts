import jsPDF from 'jspdf'
import { PredictionResult } from '../App'
import logo from '../assets/500x500.png'

/**
 * Generates a premium, professional PDF security report
 * @param result - The prediction result to include in the PDF
 */
export const generatePDFReport = (result: PredictionResult): void => {
  const pdf = new jsPDF()
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  const margin = 20
  const contentWidth = pageWidth - 2 * margin
  let yPosition = margin

  // Generate report ID
  const reportId = `CS-${Date.now().toString().slice(-8)}`
  const currentDate = new Date()

  // ============================================================================
  // HEADER SECTION - Premium Branding
  // ============================================================================

  // Background gradient
  pdf.setFillColor(248, 250, 252)
  pdf.rect(0, 0, pageWidth, pageHeight, 'F')

  // Header background with gradient effect
  pdf.setFillColor(59, 130, 246)
  pdf.rect(0, 0, pageWidth, 45, 'F')

  // Add subtle pattern overlay
  pdf.setFillColor(255, 255, 255)
  pdf.setGState(new (pdf as any).GState({ opacity: 0.1 }))
  for (let i = 0; i < pageWidth; i += 20) {
    pdf.rect(i, 0, 10, 45, 'F')
  }
  pdf.setGState(new (pdf as any).GState({ opacity: 1 }))

  // ClickShield Logo
  try {
    pdf.addImage(logo, 'PNG', margin, 8, 30, 30)
  } catch (error) {
    console.warn('Could not load logo for PDF:', error)
    // Premium logo placeholder
    pdf.setFillColor(255, 255, 255)
    pdf.rect(margin, 8, 30, 30, 'F')
    pdf.setFillColor(59, 130, 246)
    pdf.rect(margin + 3, 11, 24, 24, 'F')
    pdf.setFillColor(255, 255, 255)
    pdf.rect(margin + 6, 14, 18, 18, 'F')
  }

  // Company branding
  pdf.setTextColor(255, 255, 255)
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(20)
  pdf.text('ClickShield', margin + 40, 20)

  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(10)
  pdf.text('Advanced Cybersecurity Solutions', margin + 40, 28)

  // Report metadata (top right)
  pdf.setFontSize(8)
  pdf.text(`Report ID: ${reportId}`, pageWidth - margin - 60, 15)
  pdf.text(`Generated: ${currentDate.toLocaleDateString()}`, pageWidth - margin - 60, 22)
  pdf.text(`${currentDate.toLocaleTimeString()}`, pageWidth - margin - 60, 29)

  yPosition = 55

  // ============================================================================
  // EXECUTIVE SUMMARY SECTION
  // ============================================================================

  // Section header with icon
  pdf.setFillColor(34, 197, 94)
  pdf.rect(margin, yPosition, 4, 15, 'F')

  pdf.setTextColor(15, 23, 42)
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(14)
  pdf.text('EXECUTIVE SUMMARY', margin + 10, yPosition + 10)

  yPosition += 25

  // Summary box
  pdf.setFillColor(248, 250, 252)
  pdf.setDrawColor(226, 232, 240)
  pdf.setLineWidth(0.5)
  pdf.roundedRect(margin, yPosition, contentWidth, 35, 3, 3, 'FD')

  // Status indicator
  const statusConfig = getStatusConfig(result)
  pdf.setFillColor(statusConfig.color[0], statusConfig.color[1], statusConfig.color[2])
  pdf.circle(margin + 15, yPosition + 17.5, 6, 'F')

  pdf.setTextColor(255, 255, 255)
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(8)
  // Center the text on the circle
  const textWidth = pdf.getTextWidth(statusConfig.status)
  const centeredX = margin + 15 - (textWidth / 2)
  pdf.text(statusConfig.status, centeredX, yPosition + 21)

  // Summary text
  pdf.setTextColor(15, 23, 42)
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(10)
  const summaryText = `Security analysis completed for ${result.url}. ${statusConfig.message}`
  const summaryLines = pdf.splitTextToSize(summaryText, contentWidth - 40)
  pdf.text(summaryLines, margin + 30, yPosition + 12)

  yPosition += 50

  // ============================================================================
  // SCAN DETAILS SECTION
  // ============================================================================

  // Section header
  pdf.setFillColor(59, 130, 246)
  pdf.rect(margin, yPosition, 4, 15, 'F')

  pdf.setTextColor(15, 23, 42)
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(14)
  pdf.text('SCAN DETAILS', margin + 10, yPosition + 10)

  yPosition += 25

  // Details grid
  const details = [
    ['Target URL', result.url],
    ['Scan Date', currentDate.toLocaleString()],
    ['Threat Level', statusConfig.status],
    ['Confidence Score', result.confidence || 'N/A'],
    ['SSL Status', result.ssl_verified !== undefined ? (result.ssl_verified ? 'Valid' : 'Invalid') : 'Not Checked'],
    ['Platform Type', result.platform_type || 'Unknown']
  ]

  details.forEach(([label, value], index) => {
    const rowY = yPosition + (index * 8)

    // Alternating row colors
    if (index % 2 === 0) {
      pdf.setFillColor(248, 250, 252)
      pdf.rect(margin, rowY - 3, contentWidth, 8, 'F')
    }

    pdf.setTextColor(71, 85, 105)
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(9)
    pdf.text(label + ':', margin + 5, rowY + 2)

    pdf.setTextColor(15, 23, 42)
    pdf.setFont('helvetica', 'normal')
    // Ensure value text fits within available space
    const maxValueWidth = contentWidth - 80
    const valueText = pdf.splitTextToSize(value, maxValueWidth)
    pdf.text(valueText, margin + 45, rowY + 2)
  })

  yPosition += details.length * 8 + 25

  // ============================================================================
  // SECURITY ANALYSIS SECTION
  // ============================================================================

  if (result.threat_description || result.recommendation) {
    // Section header
    pdf.setFillColor(245, 158, 11)
    pdf.rect(margin, yPosition, 4, 15, 'F')

    pdf.setTextColor(15, 23, 42)
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(14)
    pdf.text('SECURITY ANALYSIS', margin + 10, yPosition + 10)

    yPosition += 25

    if (result.threat_description) {
      // Threat description box
      pdf.setFillColor(254, 242, 242)
      pdf.setDrawColor(252, 165, 165)
      pdf.setLineWidth(0.5)
      pdf.roundedRect(margin, yPosition, contentWidth, 30, 3, 3, 'FD')

      pdf.setTextColor(127, 29, 29)
      pdf.setFont('helvetica', 'bold')
      pdf.setFontSize(10)
      pdf.text('Threat Description:', margin + 5, yPosition + 8)

      pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(8)
      pdf.setTextColor(127, 29, 29)
      const threatLines = pdf.splitTextToSize(result.threat_description, contentWidth - 10)
      // Ensure text fits within the 30-unit box (accounting for header)
      const maxLinesInBox = Math.floor((30 - 10) / 4) // Rough line height calculation
      const displayLines = threatLines.slice(0, maxLinesInBox)
      pdf.text(displayLines, margin + 5, yPosition + 15)

      yPosition += 35
    }

    if (result.recommendation) {
      // Recommendation box
      pdf.setFillColor(240, 253, 244)
      pdf.setDrawColor(34, 197, 94)
      pdf.setLineWidth(0.5)
      pdf.roundedRect(margin, yPosition, contentWidth, 30, 3, 3, 'FD')

      pdf.setTextColor(21, 128, 61)
      pdf.setFont('helvetica', 'bold')
      pdf.setFontSize(10)
      pdf.text('Security Recommendation:', margin + 5, yPosition + 8)

      pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(8)
      const recLines = pdf.splitTextToSize(result.recommendation, contentWidth - 10)
      // Ensure text fits within the 30-unit box (accounting for header)
      const maxLinesInBox = Math.floor((30 - 10) / 4) // Rough line height calculation
      const displayLines = recLines.slice(0, maxLinesInBox)
      pdf.text(displayLines, margin + 5, yPosition + 15)

      yPosition += 35
    }
  }

  // ============================================================================
  // DETECTED THREATS SECTION
  // ============================================================================

  if (result.matches && result.matches.length > 0) {
    // Section header
    pdf.setFillColor(239, 68, 68)
    pdf.rect(margin, yPosition, 4, 15, 'F')

    pdf.setTextColor(15, 23, 42)
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(14)
    pdf.text('DETECTED THREATS', margin + 10, yPosition + 10)

    yPosition += 25

    // Threats list
    result.matches.slice(0, 3).forEach((match: any, index: number) => {
      pdf.setFillColor(255, 255, 255)
      pdf.setDrawColor(239, 68, 68)
      pdf.setLineWidth(0.5)
      pdf.roundedRect(margin, yPosition, contentWidth, 15, 2, 2, 'FD')

      pdf.setTextColor(239, 68, 68)
      pdf.setFont('helvetica', 'bold')
      pdf.setFontSize(9)
      pdf.text(`${index + 1}.`, margin + 5, yPosition + 8)

      pdf.setTextColor(15, 23, 42)
      pdf.setFont('helvetica', 'normal')
      const threatText = `${match.threatType || 'Unknown Threat'} - ${match.platformType || 'Unknown Platform'}`
      pdf.text(threatText, margin + 15, yPosition + 8)

      yPosition += 18
    })

    if (result.matches.length > 3) {
      pdf.setTextColor(107, 114, 128)
      pdf.setFont('helvetica', 'italic')
      pdf.setFontSize(8)
      pdf.text(`... and ${result.matches.length - 3} additional threats detected`, margin + 5, yPosition)
      yPosition += 10
    }
  }

  // ============================================================================
  // RISK METRICS SECTION
  // ============================================================================

  // Calculate risk score (0-100)
  const riskScore = calculateRiskScore(result)

  // Ensure we have enough space before footer (footer starts at pageHeight - 25)
  const minMetricsY = yPosition + 10
  const maxMetricsY = pageHeight - 50 // Leave space for footer
  const metricsY = Math.min(minMetricsY, maxMetricsY - 35) // 35 is metrics box height

  // If we don't have enough space, add a new page (but for now, just position it)
  if (metricsY + 35 > pageHeight - 25) {
    // Content would overlap footer - this shouldn't happen with our calculations
    console.warn('PDF content may overlap footer')
  }

  // Risk metrics box
  pdf.setFillColor(248, 250, 252)
  pdf.setDrawColor(59, 130, 246)
  pdf.setLineWidth(1)
  pdf.roundedRect(margin, metricsY, contentWidth, 35, 3, 3, 'FD')

  // Risk score visualization
  pdf.setFillColor(riskScore > 70 ? 239 : riskScore > 40 ? 245 : 34,
                   riskScore > 70 ? 68 : riskScore > 40 ? 158 : 197,
                   riskScore > 70 ? 68 : riskScore > 40 ? 11 : 94)
  pdf.rect(margin + 5, metricsY + 5, (contentWidth - 10) * (riskScore / 100), 8, 'F')

  pdf.setTextColor(15, 23, 42) // Dark color for better contrast
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(12) // Increased from 10 to 12
  pdf.text(`Risk Score: ${riskScore}/100`, margin + contentWidth/2 - 30, metricsY + 11)

  // Metrics
  pdf.setTextColor(15, 23, 42)
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(8)
  pdf.text(`Variations Analyzed: ${result.checked_variations || 1}`, margin + 5, metricsY + 25)
  pdf.text(`Cache Status: ${result.cached ? 'Used' : 'Fresh Scan'}`, margin + contentWidth/2 + 10, metricsY + 25)

  // ============================================================================
  // FOOTER SECTION
  // ============================================================================

  const footerHeight = 25
  const footerY = pageHeight - footerHeight

  // Final check: ensure no content overlaps footer
  if (metricsY + 35 > footerY) {
    console.warn('PDF content extends into footer area - layout may be compromised')
  }

  // Footer background
  pdf.setFillColor(15, 23, 42)
  pdf.rect(0, footerY, pageWidth, footerHeight, 'F')

  // Footer content - Left side
  pdf.setTextColor(255, 255, 255)
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(7)
  pdf.text('ClickShield Professional Security Report', margin, footerY + 6)
  pdf.text('Powered by Google Safe Browsing API | Report ID: ' + reportId, margin, footerY + 12)

  // Disclaimer text - split into two lines for better fit
  pdf.setFontSize(6)
  pdf.setTextColor(156, 163, 175)
  const disclaimerLine1 = 'This report is confidential and intended for the recipient only.'
  const disclaimerLine2 = 'ClickShield is not liable for decisions made based on this analysis.'
  pdf.text(disclaimerLine1, margin, footerY + 18)
  pdf.text(disclaimerLine2, margin, footerY + 22)

  // Contact info - Right side
  pdf.setTextColor(255, 255, 255)
  pdf.setFontSize(7)
  const contactX = pageWidth - margin - 120
  pdf.text('© 2025 ClickShield. All rights reserved.', contactX, footerY + 6)

  // Save the PDF
  const fileName = `ClickShield_Professional_Report_${reportId}.pdf`
  pdf.save(fileName)
}

// Helper function to get status configuration
const getStatusConfig = (result: PredictionResult) => {
  if (result.safe) {
    return {
      status: 'SECURE',
      color: [34, 197, 94],
      message: 'No security threats detected. The website appears safe for browsing.'
    }
  } else if (result.warning) {
    return {
      status: 'CAUTION',
      color: [245, 158, 11],
      message: 'Additional verification recommended before proceeding.'
    }
  } else {
    return {
      status: 'THREAT',
      color: [239, 68, 68],
      message: 'Security risk detected. Exercise extreme caution.'
    }
  }
}

// Helper function to calculate risk score
const calculateRiskScore = (result: PredictionResult): number => {
  let score = 0

  // Only add points for actual security issues, not for safe sites
  if (!result.safe) score += 40
  if (result.warning) score += 20
  if (result.threat_type && result.threat_type !== 'NONE') score += 20  // Fixed: don't add points for 'NONE'

  // SSL issues are less critical for sites that are otherwise safe
  if (!result.ssl_verified && !result.safe) score += 10  // Only penalize SSL if site is not safe

  if (result.matches && result.matches.length > 0) score += result.matches.length * 5

  // Cap at 100 and ensure minimum of 0
  return Math.min(100, Math.max(0, score))
}