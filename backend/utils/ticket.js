const { createCanvas, loadImage } = require('@napi-rs/canvas');
const QRCode = require("qrcode");
const path = require('path');

/**
 * Generates a Gen Z styled event ticket with a QR code for verification
 * @param {Object} user - User MongoDB document based on UserSchema
 * @param {Object} event - Event MongoDB document based on eventSchema
 * @param {Object} options - Additional options for ticket generation
 * @param {String} options.logoPath - Optional path to a logo image
 * @returns {Promise<Object>} - A promise that resolves to a SendGrid attachment object
 */
async function generateTicket(user, event, options = {}) {
  // Extract IDs from MongoDB documents
  const userId = user.id?.toString() || user._id?.toString() || 'user123';
  const eventId = event._id?.toString() || 'event456';

  // Ticket dimensions - wider format for modern look
  const width = 1000; // Increased width for better layout
  const height = 450; // Increased height for better spacing

  // Create canvas
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Background with subtle gradient
  const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
  bgGradient.addColorStop(0, '#ffffff');
  bgGradient.addColorStop(1, '#f0f4f8');
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, width, height);

  // Add decorative diagonal stripes in the background
  ctx.save();
  ctx.globalAlpha = 0.02; // More subtle stripes
  for (let i = -height; i < width + height; i += 40) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + height, height);
    ctx.lineWidth = 15;
    ctx.strokeStyle = '#000000';
    ctx.stroke();
  }
  ctx.restore();

  // Add vibrant border - modern gradient
  const borderGradient = ctx.createLinearGradient(0, 0, width, 0);
  borderGradient.addColorStop(0, '#6366F1'); // Indigo
  borderGradient.addColorStop(0.5, '#8B5CF6'); // Violet
  borderGradient.addColorStop(1, '#EC4899'); // Pink
  ctx.fillStyle = borderGradient;

  // Rounded corners for the ticket
  const cornerRadius = 15;

  // Draw rounded rectangle for the ticket border
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(cornerRadius, 0);
  ctx.lineTo(width - cornerRadius, 0);
  ctx.quadraticCurveTo(width, 0, width, cornerRadius);
  ctx.lineTo(width, height - cornerRadius);
  ctx.quadraticCurveTo(width, height, width - cornerRadius, height);
  ctx.lineTo(cornerRadius, height);
  ctx.quadraticCurveTo(0, height, 0, height - cornerRadius);
  ctx.lineTo(0, cornerRadius);
  ctx.quadraticCurveTo(0, 0, cornerRadius, 0);
  ctx.closePath();
  ctx.clip();

  // Top and bottom borders
  ctx.fillRect(0, 0, width, 10);
  ctx.fillRect(0, height - 10, width, 10);

  // Left and right borders
  ctx.fillRect(0, 0, 10, height);
  ctx.fillRect(width - 10, 0, 10, height);
  ctx.restore();

  // Add circular design element in the background
  ctx.save();
  const circleGradient = ctx.createRadialGradient(width - 150, height / 2, 0, width - 150, height / 2, 200);
  circleGradient.addColorStop(0, 'rgba(99, 102, 241, 0.05)');
  circleGradient.addColorStop(1, 'rgba(236, 72, 153, 0)');
  ctx.fillStyle = circleGradient;
  ctx.beginPath();
  ctx.arc(width - 150, height / 2, 200, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Create a circular mask for the event image or logo
  async function drawCircularImage(image, x, y, size) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(x + size/2, y + size/2, size/2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    // Draw image
    ctx.drawImage(image, x, y, size, size);

    // Add a subtle ring around the image
    ctx.beginPath();
    ctx.arc(x + size/2, y + size/2, size/2, 0, Math.PI * 2);
    ctx.lineWidth = 4;
    ctx.strokeStyle = borderGradient;
    ctx.stroke();

    ctx.restore();
  }

  // Event image or logo in circular frame
  const logoSize = 110;
  const logoX = 120; // Move logo to the left side
  const logoY = 40;

  if (event.image && event.image !== '/img.jpg') {
    try {
      const eventImage = await loadImage(event.image);
      await drawCircularImage(eventImage, logoX - logoSize/2, logoY, logoSize);
    } catch (error) {
      console.warn('Could not load event image:', error.message);
      if (options.logoPath) {
        try {
          const logo = await loadImage(options.logoPath);
          await drawCircularImage(logo, logoX - logoSize/2, logoY, logoSize);
        } catch (logoError) {
          console.warn('Could not load logo image:', logoError.message);
        }
      }
    }
  } else if (options.logoPath) {
    try {
      const logo = await loadImage(options.logoPath);
      await drawCircularImage(logo, logoX - logoSize/2, logoY, logoSize);
    } catch (error) {
      console.warn('Could not load logo image:', error.message);
    }
  }

  // Add event information with modern typography
  ctx.fillStyle = '#1a1a2e'; // Deep blue-black for text

  // Event title with modern font
  ctx.font = 'bold 42px Arial';
  ctx.fillText(event.title, 200, 80); // Moved to the right of the logo

  // Add a colored underline for the title
  const titleWidth = ctx.measureText(event.title).width;
  const underlineGradient = ctx.createLinearGradient(200, 0, 200 + titleWidth, 0);
  underlineGradient.addColorStop(0, '#6366F1');
  underlineGradient.addColorStop(1, '#EC4899');
  ctx.fillStyle = underlineGradient;
  ctx.fillRect(200, 90, titleWidth, 4);

  // Add perforated line with a more modern style
  ctx.strokeStyle = '#e0e0e0';
  ctx.setLineDash([8, 4]);
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(width - 280, 0); // Moved to give more space for QR code
  ctx.lineTo(width - 280, height);
  ctx.stroke();
  ctx.setLineDash([]);

  // Event details with better spacing and icons (simulated with text)
  ctx.fillStyle = '#1a1a2e';
  ctx.font = '22px Arial';

  // Location with emoji
  ctx.fillText(`📍 ${event.location}`, 200, 140);

  // Date with emoji
  ctx.fillText(`📅 ${event.date}`, 200, 180);

  // Time with emoji
  ctx.fillText(`⏰ ${event.time}`, 200, 220);

  // Category with emoji
  ctx.fillText(`🏷️ ${event.category}`, 200, 260);

  // Price with emoji
  if (event.isPaid && event.amountPerPerson > 0) {
    ctx.fillText(`💰 $${event.amountPerPerson.toFixed(2)}`, 200, 300);
  } else {
    ctx.fillText(`🆓 Free`, 200, 300);
  }

  // Add attendee name with a highlight
  ctx.font = 'bold 20px Arial';
  const attendeeText = `Attendee: ${user.name}`;
  const attendeeWidth = ctx.measureText(attendeeText).width;

  // Background highlight for attendee name
  const attendeeGradient = ctx.createLinearGradient(200, 330, 200 + attendeeWidth, 330);
  attendeeGradient.addColorStop(0, 'rgba(99, 102, 241, 0.1)');
  attendeeGradient.addColorStop(1, 'rgba(236, 72, 153, 0.1)');
  ctx.fillStyle = attendeeGradient;
  ctx.fillRect(195, 315, attendeeWidth + 10, 30);

  // Attendee name text
  ctx.fillStyle = '#1a1a2e';
  ctx.fillText(attendeeText, 200, 335);

  // Generate QR code data with MongoDB IDs
  const qrData = JSON.stringify({
    userId,
    eventId,
    userEmail: user.email || 'user@example.com',
    timestamp: Date.now()
  });

  // IMPROVED: Larger QR code with better error correction for easier scanning
  const qrCodeDataURL = await QRCode.toDataURL(qrData, {
    errorCorrectionLevel: 'H', // High error correction
    margin: 1,
    width: 200, // Larger QR code
    color: {
      dark: '#000000', // Pure black for better contrast
      light: '#ffffff'
    }
  });

  // Load QR code and draw it in a square frame with rounded corners
  const qrCodeImage = await loadImage(qrCodeDataURL);

  const qrSize = 180; // Larger QR code
  const qrX = width - 180;
  const qrY = height/2 - qrSize/2;

  // Draw white background for QR with shadow for depth
  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
  ctx.shadowBlur = 15;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 5;
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.roundRect(qrX - qrSize/2 - 15, qrY - 15, qrSize + 30, qrSize + 30, 15);
  ctx.fill();
  ctx.restore();

  // Draw QR code
  ctx.drawImage(qrCodeImage, qrX - qrSize/2, qrY, qrSize, qrSize);

  // Add border around QR code
  ctx.beginPath();
  ctx.roundRect(qrX - qrSize/2, qrY, qrSize, qrSize, 5);
  ctx.lineWidth = 4;
  ctx.strokeStyle = borderGradient;
  ctx.stroke();

  // Add "SCAN ME" text under QR code with modern styling
  ctx.font = 'bold 18px Arial';
  ctx.textAlign = 'center';

  // Create background for the scan text
  const scanText = 'SCAN TO VERIFY';
  ctx.fillStyle = '#1a1a2e';
  ctx.fillText(scanText, qrX, qrY + qrSize + 25);

  // Add event status indicator with a modern badge style
  if (event.status) {
    ctx.save();
    ctx.textAlign = 'center';
    ctx.font = 'bold 16px Arial';

    let statusText, statusColor;

    if (event.status === 'upcoming') {
      statusText = 'UPCOMING';
      statusColor = '#10B981'; // Green
    } else if (event.status === 'past') {
      statusText = 'PAST EVENT';
      statusColor = '#EF4444'; // Red
    } else {
      statusText = event.status.toUpperCase();
      statusColor = '#6366F1'; // Default color
    }

    // Draw status badge
    const badgeWidth = ctx.measureText(statusText).width + 30;
    const badgeHeight = 30;
    const badgeX = width - 150;
    const badgeY = 25;

    // Badge background with shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 3;
    ctx.fillStyle = statusColor;
    ctx.beginPath();
    ctx.roundRect(badgeX - badgeWidth/2, badgeY, badgeWidth, badgeHeight, 15);
    ctx.fill();
    ctx.shadowColor = 'transparent';

    // Badge text
    ctx.fillStyle = '#ffffff';
    ctx.fillText(statusText, badgeX, badgeY + 20);
    ctx.restore();
  }

  // Add subtle holographic effect
  ctx.save();
  ctx.globalAlpha = 0.08;
  for (let i = 0; i < 5; i++) {
    const hueRotation = i * 30;
    ctx.fillStyle = `hsl(${hueRotation}, 100%, 70%)`;
    ctx.beginPath();
    ctx.arc(width - 80, 200, 40 + i * 8, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // Add a subtle pattern of dots in the bottom left
  ctx.save();
  ctx.fillStyle = 'rgba(99, 102, 241, 0.1)';
  for (let y = height - 100; y < height - 20; y += 15) {
    for (let x = 50; x < 200; x += 15) {
      const size = Math.random() * 3 + 1;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();

  // Add ticket number at the bottom
  ctx.font = '16px Arial';
  ctx.textAlign = 'left';
  ctx.fillStyle = '#6B7280';
  ctx.fillText(`Ticket #${userId.substring(0, 8)}`, 50, height - 30);

  // Add a "valid until" date if available
  if (event.endDate) {
    ctx.textAlign = 'right';
    ctx.fillText(`Valid until: ${event.endDate}`, width - 320, height - 30);
  }

  // Get the buffer and create a Base64 string for SendGrid
  const imageBuffer = canvas.toBuffer('image/png');
  const base64Image = imageBuffer.toString('base64');

  // Create a filename based on event and user information
  const safeEventName = event.title.replace(/[^a-z0-9]/gi, '-').toLowerCase();
  const filename = `${safeEventName}-ticket-${userId}.png`;

  // Return SendGrid attachment object
  return {
    content: base64Image,
    filename: filename,
    type: 'image/png',
    disposition: 'attachment'
  };
}

module.exports = generateTicket;