import { LegalPageLayout } from "@/components/marketing/LegalPageLayout";

export const metadata = {
  title: "Cookie Notice — FitPilot Pro",
  description: "Cookie Notice for FitPilot Pro by Albor Digital LLC.",
};

export default function CookiesPage() {
  return (
    <LegalPageLayout
      title="Cookie Notice"
      subtitle="Effective Date: January 1, 2026"
      lastUpdated="Last Updated: January 1, 2026"
    >
      <h2>1. What Are Cookies</h2>
      <p>
        Cookies are small text files stored on your device when you visit a
        website. They help websites function properly, remember your
        preferences, and provide analytical information to operators. Similar
        technologies — such as local storage, session storage, and tracking
        pixels — may also be used.
      </p>

      <h2>2. How We Use Cookies</h2>
      <p>Albor Digital LLC uses cookies and similar technologies to:</p>
      <ul>
        <li>Ensure FitPilot Pro functions correctly (strictly necessary cookies);</li>
        <li>Remember your preferences and settings (language, sidebar state);</li>
        <li>Maintain your authenticated session securely via Supabase; and</li>
        <li>
          Analyze how users interact with our products so we can improve them.
        </li>
      </ul>

      <h2>3. Types of Cookies We Use</h2>

      <table className="legal-table">
        <thead>
          <tr>
            <th>Type</th>
            <th>Purpose</th>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Strictly Necessary</strong></td>
            <td>
              Core product functionality, authentication session management
              (Supabase), and security.
            </td>
            <td>Session</td>
          </tr>
          <tr>
            <td><strong>Functional</strong></td>
            <td>
              User preferences, language settings, sidebar state, and saved UI
              states.
            </td>
            <td>Up to 1 year</td>
          </tr>
          <tr>
            <td><strong>Analytics</strong></td>
            <td>
              Aggregate usage data to understand how trainers use FitPilot Pro
              and improve the product. Data is anonymized where possible.
            </td>
            <td>Up to 2 years</td>
          </tr>
        </tbody>
      </table>

      <p>
        FitPilot Pro does not currently use advertising cookies. If this changes,
        this notice will be updated and you will be notified.
      </p>

      <h2>4. Third-Party Cookies</h2>
      <p>Some cookies on FitPilot Pro are placed by third-party services, including:</p>
      <ul>
        <li><strong>Supabase</strong> — authentication and session management;</li>
        <li><strong>Stripe</strong> — payment processing and fraud prevention; and</li>
        <li><strong>Google Maps</strong> — route optimization feature (when used).</li>
      </ul>
      <p>
        These third parties have their own cookie policies and we encourage you
        to review them independently.
      </p>

      <h2>5. Your Choices</h2>
      <p>You can control and manage cookies in several ways:</p>
      <ul>
        <li>Through your browser settings, where you can block or delete cookies;</li>
        <li>
          Through opt-out mechanisms provided by third-party services (for
          example, Google&rsquo;s opt-out tools); and
        </li>
        <li>
          By contacting us at{" "}
          <a href="mailto:contact@albor.digital">contact@albor.digital</a> to
          request data deletion.
        </li>
      </ul>
      <p>
        Please note that disabling strictly necessary cookies — particularly
        those used for authentication — will prevent you from logging into
        FitPilot Pro.
      </p>

      <h2>6. Do Not Track</h2>
      <p>
        Some browsers include a &ldquo;Do Not Track&rdquo; (DNT) feature.
        FitPilot Pro does not currently respond to DNT signals, as there is no
        industry-standard approach to honoring them. We continue to monitor
        developments in this area.
      </p>

      <h2>7. Updates to This Notice</h2>
      <p>
        We may update this Cookie Notice as FitPilot Pro evolves or regulations
        change. Updates will be posted with a revised effective date.
      </p>

      <h2>8. Contact</h2>
      <p>
        For questions about our use of cookies:{" "}
        <a href="mailto:contact@albor.digital">contact@albor.digital</a>
      </p>
    </LegalPageLayout>
  );
}
