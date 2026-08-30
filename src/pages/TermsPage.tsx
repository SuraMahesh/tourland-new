import { SubHero } from '../components';

export function TermsPage() {
  return (
    <main>
      <SubHero
        crumbs={['Modotravels', 'Terms']}
        eyebrow="Terms"
        title="Booking terms and conditions."
        img="https://images.unsplash.com/photo-1544015759-237f87d55ef3?w=1600&q=72&auto=format&fit=crop"
      />

      <section className="container sec legal-page">
        <div className="legal-card">
          <h2>Scope</h2>
          <p>
            These terms apply to all trip planning, itinerary design, and travel support services provided by Modotravels.
            By contacting us or proceeding with a trip request, you agree to these terms and conditions.
          </p>
        </div>

        <div className="legal-card">
          <h2>Enquiries and quotation</h2>
          <p>
            We provide recommendations and quotations based on the information you share with us. Any quote is indicative and may change depending on dates,
            availability, route complexity, accommodation choices, and seasonal conditions.
          </p>
        </div>

        <div className="legal-card">
          <h2>Booking confirmation</h2>
          <p>
            A booking is considered confirmed only after written acceptance from Modotravels and payment of any required deposit or advance amount.
            We reserve the right to adjust plans where local conditions or supplier availability require changes.
          </p>
        </div>

        <div className="legal-card">
          <h2>Payments</h2>
          <p>
            Payment terms will be confirmed in writing before the trip is secured. Any deposit is non-refundable if the trip is cancelled after confirmation,
            except where stated otherwise in the final booking documents.
          </p>
        </div>

        <div className="legal-card">
          <h2>Changes and cancellations</h2>
          <p>
            We will do our best to accommodate reasonable changes to your itinerary. If a trip must be rescheduled, terminated, or amended due to weather,
            transport issues, or force majeure events, we will work with you to find the best practical alternative.
          </p>
        </div>

        <div className="legal-card">
          <h2>Liability</h2>
          <p>
            Modotravels acts as a travel planner and facilitator. We are not responsible for the actions, delays, losses, or service failures of third-party providers,
            including transport, guides, accommodation, or attractions, beyond our reasonable control.
          </p>
        </div>
      </section>
    </main>
  );
}
