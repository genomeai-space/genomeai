import { LegalLayout, Section } from "./LegalLayout";
import { SITE } from "@/lib/site";

export function Terms() {
  return (
    <LegalLayout
      page="terms"
      eyebrow="Terms of Service"
      title="Terms of Service"
      intro={`The terms that govern your use of Genome AI and the Digital DNA platform.`}
    >
      <Section title="1. Acceptance of terms">
        <p>
          By accessing or using {SITE.name} ({SITE.url}), you agree to these Terms of
          Service. If you do not agree, please do not use the service.
        </p>
      </Section>

      <Section title="2. The service">
        <p>
          Genome AI provides tools to design, test, benchmark, and version AI behaviors
          represented as "Genomes" — structured sets of tunable genes. The service is
          currently offered in a free beta, with features and availability subject to
          change.
        </p>
      </Section>

      <Section title="3. Accounts & access">
        <p>
          Access is currently granted on an application basis. You are responsible for
          maintaining the confidentiality of your account and for activity under it. We
          may accept, delay, or decline applications at our discretion.
        </p>
      </Section>

      <Section title="4. Acceptable use">
        <p>You agree not to:</p>
        <ul>
          <li>Use the service to generate unlawful, harmful, or abusive content.</li>
          <li>Attempt to access, disrupt, or reverse-engineer systems you're not authorized to.</li>
          <li>Resell or misrepresent the service without permission.</li>
          <li>Infringe the intellectual property or privacy of others.</li>
        </ul>
      </Section>

      <Section title="5. Your content">
        <p>
          You retain ownership of the genomes and content you create. You grant us a
          limited license to host, process, and display that content as needed to operate
          the service for you.
        </p>
      </Section>

      <Section title="6. Intellectual property">
        <p>
          The Genome AI name, product, Genome Standard, and related materials are the
          intellectual property of Genome AI. The "Gene Catalog" and engine behavior are
          provided for your use under these terms.
        </p>
      </Section>

      <Section title="7. Disclaimers">
        <p>
          The service is provided "as is" without warranties of any kind. AI outputs are
          generated probabilistically and may be incorrect or unsuitable. You are
          responsible for reviewing and validating outputs before relying on them.
        </p>
      </Section>

      <Section title="8. Limitation of liability">
        <p>
          To the maximum extent permitted by law, Genome AI is not liable for any
          indirect, incidental, or consequential damages arising from your use of the
          service.
        </p>
      </Section>

      <Section title="9. Changes & termination">
        <p>
          We may modify, suspend, or discontinue features at any time. You may stop using
          the service at any time. We may suspend access for violations of these terms.
        </p>
      </Section>

      <Section title="10. Contact">
        <p>
          Questions about these terms? Reach us at{" "}
          <a className="text-moss hover:underline" href={`mailto:${SITE.email}`}>
            {SITE.email}
          </a>
          .
        </p>
      </Section>
    </LegalLayout>
  );
}
