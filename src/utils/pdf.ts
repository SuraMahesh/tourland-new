/**
 * PDF Generation Utilities
 */

interface TripData {
  startDate: string;
  days: number;
  travellers: { adults: number; children: number };
  regions: string[];
  activities: string[];
  transfer: string;
  pickupAirport: boolean;
  style: string;
}

interface ItineraryDay {
  day: number;
  date: string;
  region: string;
  title: string;
  activities: string[];
}

/**
 * Generates a PDF from the trip planner data
 */
export async function generateTripPDF(
  trip: TripData,
  itinerary: ItineraryDay[],
  fileName: string = 'tourland-trip.pdf'
) {
  try {
    const html2pdf = (await import('html2pdf.js')).default;

    // Create HTML content for the PDF
    const htmlContent = createTripHTML(trip, itinerary);

    // Create a temporary container
    const element = document.createElement('div');
    element.innerHTML = htmlContent;
    element.style.padding = '20px';
    element.style.fontFamily = '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif';
    element.style.fontSize = '12px';
    element.style.color = '#333';

    // PDF options
    const options: any = {
      margin: 10,
      filename: fileName,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' },
    };

    // Generate PDF
    await html2pdf().set(options).from(element).save();
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    return false;
  }
}

/**
 * Creates HTML content for trip PDF
 */
function createTripHTML(trip: TripData, itinerary: ItineraryDay[]): string {
  const startDate = new Date(trip.startDate);
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + trip.days - 1);

  const formatDate = (d: Date) =>
    d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  // Calculate pricing
  const base = trip.days * 165 * trip.travellers.adults + trip.days * 95 * trip.travellers.children;
  const transferAdd = trip.transfer === 'suv' ? 280 : trip.transfer === 'ev' ? 190 : 0;
  const pickup = trip.pickupAirport ? 35 : 0;
  const activityAdd = trip.activities.length * 65;
  const total = base + transferAdd + pickup + activityAdd;

  return `
    <div style="font-family: Arial, sans-serif;">
      <h1 style="color: #2c3e50; text-align: center; border-bottom: 3px solid #d97742; padding-bottom: 10px;">
        🌴 TourLand Trip Itinerary
      </h1>

      <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h2 style="color: #2c3e50; margin-top: 0;">Trip Summary</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="background: #ecf0f1;">
            <td style="padding: 8px; border: 1px solid #bdc3c7; font-weight: bold;">Duration</td>
            <td style="padding: 8px; border: 1px solid #bdc3c7;">${trip.days} days</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #bdc3c7; font-weight: bold;">Dates</td>
            <td style="padding: 8px; border: 1px solid #bdc3c7;">${formatDate(startDate)} → ${formatDate(endDate)}</td>
          </tr>
          <tr style="background: #ecf0f1;">
            <td style="padding: 8px; border: 1px solid #bdc3c7; font-weight: bold;">Travellers</td>
            <td style="padding: 8px; border: 1px solid #bdc3c7;">${trip.travellers.adults} adult(s)${trip.travellers.children > 0 ? `, ${trip.travellers.children} child(ren)` : ''}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #bdc3c7; font-weight: bold;">Trip Style</td>
            <td style="padding: 8px; border: 1px solid #bdc3c7; text-transform: capitalize;">${trip.style}</td>
          </tr>
          <tr style="background: #ecf0f1;">
            <td style="padding: 8px; border: 1px solid #bdc3c7; font-weight: bold;">Regions</td>
            <td style="padding: 8px; border: 1px solid #bdc3c7;">${trip.regions.join(', ')}</td>
          </tr>
        </table>
      </div>

      <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h2 style="color: #2c3e50; margin-top: 0;">Day-by-Day Itinerary</h2>
        ${itinerary
          .map(
            (day) => `
          <div style="background: white; padding: 12px; margin: 10px 0; border-left: 4px solid #d97742; border-radius: 3px;">
            <div style="font-weight: bold; color: #2c3e50; font-size: 14px;">
              Day ${String(day.day).padStart(2, '0')} (${day.date})
            </div>
            <div style="color: #555; margin-top: 5px; font-size: 13px;">
              <strong>${day.title}</strong>
            </div>
            <div style="color: #777; margin-top: 3px; font-size: 12px;">
              <strong>Activities:</strong>
              <ul style="margin: 5px 0; padding-left: 20px;">
                ${day.activities.map((a) => `<li>${a}</li>`).join('')}
              </ul>
            </div>
          </div>
        `
          )
          .join('')}
      </div>

      <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h2 style="color: #2c3e50; margin-top: 0;">Estimated Pricing</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px; border: 1px solid #bdc3c7;">Land arrangements</td>
            <td style="padding: 8px; border: 1px solid #bdc3c7; text-align: right; font-weight: bold;">$${base.toLocaleString()}</td>
          </tr>
          <tr style="background: #ecf0f1;">
            <td style="padding: 8px; border: 1px solid #bdc3c7;">Experiences (×${trip.activities.length})</td>
            <td style="padding: 8px; border: 1px solid #bdc3c7; text-align: right; font-weight: bold;">$${activityAdd}</td>
          </tr>
          ${transferAdd > 0 ? `
          <tr>
            <td style="padding: 8px; border: 1px solid #bdc3c7;">Transfer upgrade (${trip.transfer})</td>
            <td style="padding: 8px; border: 1px solid #bdc3c7; text-align: right; font-weight: bold;">$${transferAdd}</td>
          </tr>
          ` : ''}
          ${pickup > 0 ? `
          <tr style="background: #ecf0f1;">
            <td style="padding: 8px; border: 1px solid #bdc3c7;">Airport pickup</td>
            <td style="padding: 8px; border: 1px solid #bdc3c7; text-align: right; font-weight: bold;">$${pickup}</td>
          </tr>
          ` : ''}
          <tr style="background: #d97742; color: white;">
            <td style="padding: 12px; border: 1px solid #c26436; font-weight: bold; font-size: 14px;">TOTAL ESTIMATE</td>
            <td style="padding: 12px; border: 1px solid #c26436; text-align: right; font-weight: bold; font-size: 14px;">$${total.toLocaleString()} USD</td>
          </tr>
        </table>
        <div style="margin-top: 10px; padding: 10px; background: white; border-radius: 3px; font-size: 11px; color: #666;">
          <strong>Note:</strong> This is an estimate. Final pricing will be confirmed by our team after reviewing availability and any custom requests.
        </div>
      </div>

      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #bdc3c7; font-size: 11px; color: #777; text-align: center;">
        <p>Generated by TourLand • Sri Lanka Tour Planning</p>
        <p>📞 +94 77 200 8000 | 📧 hello@tourland.lk</p>
        <p style="margin-top: 10px; font-style: italic;">Free cancellation up to 30 days before departure</p>
      </div>
    </div>
  `;
}
