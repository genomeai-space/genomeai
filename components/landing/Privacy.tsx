import { LegalLayout, Section } from "./LegalLayout";
import { SITE } from "@/lib/site";

export function Privacy() {
  return (
    <LegalLayout
      page="privacy"
      eyebrow="Privacy Policy"
      title="Privacy Policy"
      intro={`How Genome AI collects, uses, and protects your information when you use our products and website.`}
    >
      <Section title="1. Overview">
        <p>
          Genome AI ({SITE.url}, "we", "us") is building tools to engineer AI behavior
          through Digital DNA. This policy explains what data we collect, why we collect
          it, and the choices you have. We aim to collect the minimum needed to run the
          product and improve it.
        </p>
      </Section>

      <Section title="2. Information we collect">
        <p>
          <strong>Account information:</strong> name and email address when you request
          early access or sign in.
        </p>
        <p>
          <strong>Genome data:</strong> the genomes, gene values, versions, and
          playground results you create. During the beta this is stored locally in your
          browser unless you choose cloud sync or share a result.
        </p>
        <p>
          <strong>Usage data:</strong> anonymized, aggregate analytics about how the
          product is used (e.g., which features are popular) to help us improve.
        </p>
      </Section>

      <Section title="3. How we use information">
        <ul>
          <li>To provide access to the workspace and your genome library.</li>
          <li>To review beta applications and communicate about access.</li>
          <li>To respond to support and partnership inquiries.</li>
          <li>To improve the product, benchmarking, and documentation.</li>
        </ul>
      </Section>

      <Section title="4. Sharing">
        <p>
          We do not sell your data. We only share information as needed to operate the
          service (for example, hosting or analytics providers under appropriate data
          agreements), or when required by law.
        </p>
      </Section>

      <Section title="5. Data retention & deletion">
        <p>
          You can delete individual genomes at any time from your DNA Library. You may
          request deletion of your account and associated data by emailing us at{" "}
          <a className="text-moss hover:underline" href={`mailto:${SITE.email}`}>
            {SITE.email}
          </a>
          . Locally stored beta data is removed when you clear your browser storage.
        </p>
      </Section>

      <Section title="6. Security">
        <p>
          We use reasonable technical and organizational measures to protect your data.
          However, no system is perfectly secure, and we cannot guarantee absolute
          security.
        </p>
      </Section>

      <Section title="7. Your rights">
        <p>
          Depending on your jurisdiction, you may have rights to access, correct,
          export, or delete your personal data. Contact us to exercise these rights.
        </p>
      </Section>

      <Section title="8. Changes to this policy">
        <p>
          We may update this policy as the product evolves. Material changes will be
          reflected by updating the effective date above.
        </p>
      </Section>
    </LegalLayout>
  );
}
