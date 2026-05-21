/**
 * WhatsApp Integration Utilities
 */

export const WHATSAPP_NUMBER = '+94772008000';
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
}): string {
  const { duration, travelers, regions, startDate } = tripData;
  return `Hi! 👋 I'm interested in a ${duration}-day Sri Lanka tour starting ${startDate}.\n\nTravellers: ${travelers.adults} adult(s)${travelers.children > 0 ? `, ${travelers.children} child(ren)` : ''}\nRegions: ${regions.join(', ')}\n\nCould you send me more details and pricing?`;
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
