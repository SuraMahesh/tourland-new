import { useEffect, useState } from 'react';

const STORAGE_KEY = 'modotravels-cookie-consent';

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === 'accepted' || saved === 'essential') {
      setVisible(false);
      return;
    }
    setVisible(true);
  }, []);

  const saveChoice = (nextChoice: 'accepted' | 'essential') => {
    window.localStorage.setItem(STORAGE_KEY, nextChoice);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="cookie-banner" role="dialog" aria-live="polite" aria-label="Cookie settings">
      <div className="cookie-banner__content">
        <div>
          <strong>Cookies</strong>
          <p>
            We use cookies to remember your preferences and improve the site experience.
            You can accept all cookies or keep only the essentials.
          </p>
        </div>
        <div className="cookie-banner__actions">
          <button style={{display:'flex', justifyContent: 'center', alignItems: 'center'}} type="button" className="btn btn-light btn-sm" onClick={() => saveChoice('essential')}>
            Essential only
          </button>
          <button type="button" className="btn btn-primary btn-sm" onClick={() => saveChoice('accepted')}>
            Accept cookies
          </button>
        </div>
      </div>
    </div>
  );
}
