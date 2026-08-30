import { SubHero } from '../components';

export function PrivacyPolicyPage() {
  return (
    <main>
      <SubHero
        crumbs={['Modotravels', 'Privacy Policy']}
        eyebrow="Privacy"
        title="How we handle your data."
        img="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1600&q=72&auto=format&fit=crop"
      />

      <section className="container sec legal-page">
        <div className="legal-card">
          <h2>Our approach</h2>
          <p>
            Modotravels respects your privacy and only collects the information needed to plan and deliver a thoughtful Sri Lanka journey.
            We keep your details confidential and use them only to support your enquiry, trip planning, and essential communication.
          </p>
        </div>

        <div className="legal-card">
          <h2>Information we collect</h2>
          <ul>
            <li>Name, email address, phone number, and travel preferences you share during the enquiry process.</li>
            <li>Trip dates, destinations, vehicle preference, and notes about your planned itinerary.</li>
            <li>Website usage information such as pages visited, referral source, and browser/device information.</li>
          </ul>
        </div>

        <div className="legal-card">
          <h2>How we use it</h2>
          <p>
            We use your information to answer questions, build itinerary recommendations, handle booking inquiries, and keep in touch about your trip.
            We may also use aggregated website data to improve our services, content, and user experience.
          </p>
        </div>

        <div className="legal-card">
          <h2>Cookies</h2>
          <p>
            We use cookies to remember your consent preferences and to improve site performance. Essential cookies are used for basic functionality,
            while optional analytics cookies help us understand how visitors use the website.
          </p>
        </div>

        <div className="legal-card">
          <h2>Third parties</h2>
          <p>
            We may use trusted service providers for email, WhatsApp communication, website analytics, and document delivery.
            These providers process information only under strict contractual controls and for the specific purpose we require.
          </p>
        </div>

        <div className="legal-card">
          <h2>Your rights</h2>
          <p>
            You may ask us to access, correct, or delete the personal data we hold about you. Please contact us via the contact page and we will respond as promptly as possible.
          </p>
        </div>
      </section>
    </main>
  );
}
