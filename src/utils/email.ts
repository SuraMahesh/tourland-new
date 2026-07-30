/**
 * Email Integration Utilities
 */

import type { BookingDetails } from '../types';

export const BOOKING_EMAIL = 'hello@tourland.lk';

/**
 * Builds the booking email subject and body from a confirmed booking
 */
export function createBookingEmailContent(b: BookingDetails): { subject: string; body: string } {
  const { tourist, travellers } = b;
  const balance = b.total - b.advance;

  const subject = `Tour booking — ${tourist.name} · ${b.days} day${b.days > 1 ? 's' : ''} from ${b.startDate}`;

  const body = [
    'NEW TOUR BOOKING — TourLand',
    '',
    'TOURIST DETAILS',
    `Name: ${tourist.name}`,
    `Country: ${tourist.country}`,
    `Email: ${tourist.email}`,
    `Contact number: ${tourist.phone}`,
    '',
    'TOUR PLAN',
    `Dates: ${b.startDate} → ${b.endDate} (${b.days} day${b.days > 1 ? 's' : ''})`,
    `Travellers: ${travellers.adults} adult(s)${travellers.children > 0 ? `, ${travellers.children} child(ren)` : ''}`,
    `Vehicle: ${b.vehicleName} — $${b.vehiclePerDay}/day (per vehicle, not per person)`,
    `Route: ${b.regions.join(', ')}`,
    `Distance: ~${b.routeKm.toLocaleString()} km estimated · ${b.includedKm.toLocaleString()} km included${b.extraKmCharge > 0 ? ` · extra km charge $${b.extraKmCharge.toLocaleString()}` : ''}`,
    '',
    'PRICING',
    `Total estimate: $${b.total.toLocaleString()} USD`,
    `Advance payment (10%): $${b.advance.toLocaleString()} — due by ${b.advanceDueDate} (two weeks before the tour)`,
    `Balance: $${balance.toLocaleString()} — payable during the tour`,
    '',
    'Guide, accommodation & meals: on request, charged at cost.',
    '',
    'Please confirm availability and send advance payment instructions.',
  ].join('\n');

  return { subject, body };
}

/**
 * Opens the visitor's email client with the booking pre-filled
 */
export function openBookingEmail(b: BookingDetails) {
  const { subject, body } = createBookingEmailContent(b);
  window.location.href = `mailto:${BOOKING_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
