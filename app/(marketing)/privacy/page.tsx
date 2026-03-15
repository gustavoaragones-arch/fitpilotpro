import { LegalPageLayout } from "@/components/marketing/LegalPageLayout";

export const metadata = {
  title: "Privacy Policy — FitPilot Pro",
  description: "Privacy Policy for FitPilot Pro by Albor Digital LLC.",
};

export default function PrivacyPage() {
  return (
    <LegalPageLayout
      title="Privacy Policy"
      subtitle="Effective Date: January 1, 2026"
      lastUpdated="Last Updated: January 1, 2026"
    >
      <h2>1. Introduction</h2>
      <p>
        Albor Digital LLC (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or
        &ldquo;our&rdquo;) respects your privacy. This Privacy Policy explains
        how we collect, use, disclose, and safeguard information when you use
        FitPilot Pro or any other digital property operated by Albor Digital.
      </p>
      <p>By using our products, you consent to the practices described in this policy.</p>

      <h2>2. Information We Collect</h2>
      <p>
        <strong>Information you provide directly:</strong> Name, email address,
        business name, payment information, client data you enter into FitPilot
        Pro (including client names, contact information, fitness metrics,
        progress photos, and session records), and any other data you submit
        when creating an account, subscribing, or contacting us.
      </p>

      <p>
        <strong>Usage data:</strong> Pages visited, features used, time spent,
        device type, browser type, IP address, and referring URLs.
      </p>

      <p>
        <strong>Cookies and tracking data:</strong> See our Cookie Notice for
        full details.
      </p>

      <p>
        <strong>AI interaction data:</strong> Where applicable, inputs you
        provide to AI-powered features within FitPilot Pro (such as the AI
        Scheduler). This data may be used to improve product functionality. AI
        features are powered by Anthropic&rsquo;s Claude API. Inputs are subject
        to Anthropic&rsquo;s data handling policies.
      </p>

      <p>
        <strong>Client data you manage:</strong> As a personal trainer using
        FitPilot Pro, you may enter data about your clients. You are the data
        controller for your clients&rsquo; personal information. We process it
        solely to provide the service. You are responsible for obtaining
        appropriate consent from your clients and complying with applicable
        privacy laws in your jurisdiction.
      </p>

      <h2>3. How We Use Your Information</h2>
      <p>We use collected information to:</p>
      <ul>
        <li>Provide, operate, and maintain FitPilot Pro;</li>
        <li>Process payments and manage subscriptions;</li>
        <li>Respond to inquiries and support requests;</li>
        <li>Send transactional communications (receipts, account notices);</li>
        <li>Improve and develop our products;</li>
        <li>Detect and prevent fraud or misuse; and</li>
        <li>Comply with legal obligations.</li>
      </ul>
      <p>
        We do not sell your personal information to third parties. We do not use
        your data for targeted advertising on behalf of third parties.
      </p>

      <h2>4. Legal Basis for Processing (GDPR)</h2>
      <p>
        If you are located in the European Economic Area, our legal bases for
        processing your personal data include: performance of a contract (to
        provide our services), compliance with legal obligations, our legitimate
        interests in operating and improving our products, and — where
        required — your consent.
      </p>

      <h2>5. Sharing of Information</h2>
      <p>We may share your information with:</p>
      <ul>
        <li>
          <strong>Service providers</strong> who assist in operating FitPilot Pro,
          including Supabase (database and authentication), Stripe (payment
          processing), Google Maps (route optimization), Anthropic (AI features),
          and Resend (transactional email). These providers operate under
          confidentiality agreements;
        </li>
        <li>
          <strong>Law enforcement or regulatory bodies</strong> when required by
          applicable law; and
        </li>
        <li>
          <strong>A successor entity</strong> in the event of a merger,
          acquisition, or sale of assets.
        </li>
      </ul>

      <h2>6. Data Retention</h2>
      <p>
        We retain personal data for as long as necessary to fulfill the purposes
        outlined in this policy, or as required by law. Account data is retained
        for the duration of your account and for a reasonable period thereafter.
        Client data you enter into FitPilot Pro is retained until you delete it
        or close your account. You may request deletion of your data at any time.
      </p>

      <h2>7. Your Rights</h2>
      <p>Depending on your jurisdiction, you may have the right to:</p>
      <ul>
        <li>Access the personal data we hold about you;</li>
        <li>Request correction of inaccurate data;</li>
        <li>Request deletion of your data;</li>
        <li>Object to or restrict our processing;</li>
        <li>Withdraw consent at any time; and</li>
        <li>Receive your data in a portable format.</li>
      </ul>
      <p>
        To exercise any of these rights, contact us at{" "}
        <a href="mailto:contact@albor.digital">contact@albor.digital</a>. We
        will respond within 30 days.
      </p>

      <h2>8. Children&rsquo;s Privacy</h2>
      <p>
        FitPilot Pro is not directed to children under the age of 13. We do not
        knowingly collect personal information from children under 13. If we
        become aware that we have inadvertently collected such data, we will
        delete it promptly.
      </p>

      <h2>9. Data Security</h2>
      <p>
        We implement reasonable administrative, technical, and physical
        safeguards to protect your data, including encrypted data transmission
        (TLS), secure database access controls via Supabase Row Level Security,
        and access-limited API keys. However, no method of transmission over the
        internet or electronic storage is 100% secure. We cannot guarantee
        absolute security.
      </p>

      <h2>10. International Transfers</h2>
      <p>
        Your information may be transferred to and processed in countries other
        than your own, including the United States and Canada. We take steps to
        ensure that appropriate safeguards are in place for such transfers in
        compliance with applicable law.
      </p>

      <h2>11. Third-Party Links</h2>
      <p>
        Our products may contain links to third-party websites or services. We
        are not responsible for the privacy practices of those third parties and
        encourage you to review their privacy policies.
      </p>

      <h2>12. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy periodically. Changes will be posted
        with a revised effective date. Continued use of our products after
        changes constitutes acceptance of the updated policy.
      </p>

      <h2>13. Contact</h2>
      <p>
        For privacy-related questions or requests:{" "}
        <a href="mailto:contact@albor.digital">contact@albor.digital</a>
      </p>
    </LegalPageLayout>
  );
}
