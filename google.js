// Google Apps Script - Code.gs

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = JSON.parse(e.postData.contents);
    
    // Add headers if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Timestamp',
        'Booking ID',
        'Villa Type',
        'Price/Night',
        'Full Name',
        'Email',
        'Phone',
        'Guests',
        'Check-in',
        'Check-out',
        'Special Requests',
        'Payment Method',
        'Transaction ID',
        'Total Amount',
        'Status'
      ]);
    }
    
    // Append booking data
    sheet.appendRow([
      data.timestamp,
      data.bookingId,
      data.villa,
      data.villaPrice,
      data.fullName,
      data.email,
      data.phone,
      data.guests,
      data.checkIn,
      data.checkOut,
      data.specialRequests,
      data.paymentMethod,
      data.transactionId,
      data.totalAmount,
      'Pending'
    ]);
    
    // Send confirmation email to customer
    sendConfirmationEmail(data);
    
    // Send notification to owner
    sendOwnerNotification(data);
    
    return ContentService
      .createTextOutput(JSON.stringify({status: 'success', bookingId: data.bookingId}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({status: 'error', message: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function sendConfirmationEmail(data) {
  const subject = `Booking Confirmation - ${data.bookingId}`;
  const body = `
Dear ${data.fullName},

Thank you for booking with Paradise Villa Retreat!

BOOKING DETAILS
---------------
Booking ID: ${data.bookingId}
Villa: ${data.villa.charAt(0).toUpperCase() + data.villa.slice(1)}
Check-in: ${data.checkIn}
Check-out: ${data.checkOut}
Guests: ${data.guests}
Total Amount: ₹${data.totalAmount}

Payment Method: ${data.paymentMethod.toUpperCase()}
${data.paymentMethod === 'cash' ? 'Please pay at the villa during check-in.' : `Transaction ID: ${data.transactionId}`}

${data.specialRequests ? `Special Requests: ${data.specialRequests}` : ''}

Check-in time: 2:00 PM
Check-out time: 11:00 AM

For any queries, contact us at: +91-XXXXXXXXXX

Best regards,
Paradise Villa Retreat
  `;
  
  MailApp.sendEmail(data.email, subject, body);
}

function sendOwnerNotification(data) {
  const ownerEmail = 'owner@example.com'; // Replace with actual owner email
  const subject = `🏨 New Booking - ${data.bookingId}`;
  const body = `
NEW BOOKING RECEIVED!

Booking ID: ${data.bookingId}
Customer: ${data.fullName}
Email: ${data.email}
Phone: ${data.phone}

Villa: ${data.villa.charAt(0).toUpperCase() + data.villa.slice(1)}
Check-in: ${data.checkIn}
Check-out: ${data.checkOut}
Guests: ${data.guests}
Total: ₹${data.totalAmount}

Payment: ${data.paymentMethod.toUpperCase()}
Transaction ID: ${data.transactionId}

Special Requests: ${data.specialRequests || 'None'}

View all bookings: [Google Sheets Link]
  `;
  
  MailApp.sendEmail(ownerEmail, subject, body);
}

function doGet(e) {
  return ContentService.createTextOutput('Villa Booking API is running');
}
