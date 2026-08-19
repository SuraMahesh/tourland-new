/**
 * WhatsApp Integration Utilities
 */

import type { BookingDetails } from '../types';

export const WHATSAPP_NUMBER = '+94776546377';
export const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, '')}`;

interface WhatsAppMessageOptions {
  phone?: string;
  message: string;
}

/**
 * Opens WhatsApp with a pre-filled message
 */
export function openWhatsApp({ phone = WHATSAPP_NUMBER, message }: WhatsAppMessageOptions) {
  const encodedMessage = encodeURIComponent(message);
  const phoneNumber = phone.replace(/\D/g, '');
  const url = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  window.open(url, '_blank');
}

/**
 * Creates a WhatsApp message for trip inquiry
 */
export function createTripInquiryMessage(tripData: {
  duration: number;
  travelers: { adults: number; children: number };
  regions: string[];
  startDate: string;
  vehicle?: string;
}): string {
  const { duration, travelers, regions, startDate, vehicle } = tripData;
  return `Hi! 👋 I'm interested in a ${duration}-day Sri Lanka tour starting ${startDate}.\n\nTravellers: ${travelers.adults} adult(s)${travelers.children > 0 ? `, ${travelers.children} child(ren)` : ''}\nRegions: ${regions.join(', ')}${vehicle ? `\nVehicle: ${vehicle}` : ''}\n\nCould you send me more details and pricing? I'd also like to know about guide, accommodation and meal options.`;
}

/**
 * Creates a WhatsApp message for a confirmed booking
 */
export function createBookingMessage(b: BookingDetails): string {
  const { tourist, travellers } = b;
  return `🎉 NEW TOUR BOOKING\n\n👤 ${tourist.name} · ${tourist.country}\n📧 ${tourist.email}\n📞 ${tourist.phone}\n\n🗓 ${b.startDate} → ${b.endDate} (${b.days} day${b.days > 1 ? 's' : ''})\n👥 ${travellers.adults} adult(s)${travellers.children > 0 ? `, ${travellers.children} child(ren)` : ''}\n🚗 ${b.vehicleName} — $${b.vehiclePerDay}/day\n📍 ${b.regions.join(', ')}\n📏 ~${b.routeKm.toLocaleString()} km est. (${b.includedKm.toLocaleString()} km incl.)\n\n💵 Total estimate: $${b.total.toLocaleString()} USD\n💳 Advance (10%): $${b.advance.toLocaleString()} — due by ${b.advanceDueDate}\n\nPlease confirm availability and send payment instructions.`;
}

/**
 * Creates a WhatsApp message for activity inquiry
 */
export function createActivityMessage(activityName: string): string {
  return `Hi! 👋 I'm interested in "${activityName}". Could you provide more details and availability?`;
}

/**
 * Creates a WhatsApp message for general inquiry
 */
export function createGeneralMessage(name: string, message: string): string {
  return `Hi! 👋 My name is ${name}.\n\n${message}\n\nLooking forward to hearing from you!`;
}

/**
 * Opens WhatsApp with contact info
 */
export function contactViaWhatsApp(message: string = "Hi! I'd like to know more about your tour planning services.") {
  openWhatsApp({ message });
}
