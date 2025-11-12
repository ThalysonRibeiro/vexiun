import { BRANDING } from "@/lib/constants/branding";
import { Hr, Link, Section, Text } from "@react-email/components";
import { FaGithub, FaLinkedin, FaXTwitter } from "react-icons/fa6";

export function EmailFooter() {
  return (
    <>
      <Hr style={hr} />
      <Section style={footer}>
        <Text style={footerText}>
          <strong>{BRANDING.name}</strong> - The AI-powered project manager that reads your code
        </Text>

        <Text style={footerLinks}>
          <Link href="https://catalystpm.app" style={link}>
            {BRANDING.domain}
          </Link>
          {" · "}
          <Link href="mailto:support@catalystpm.app" style={link}>
            {BRANDING.emails.support}
          </Link>
        </Text>

        <Text style={socialLinks}>
          <Link href={BRANDING.social.twitter.url} style={socialLink}>
            <FaXTwitter />
          </Link>
          <Link href={BRANDING.social.linkedin.url} style={socialLink}>
            <FaLinkedin />
          </Link>
          <Link href={BRANDING.social.github.url} style={socialLink}>
            <FaGithub />
          </Link>
        </Text>
      </Section>

      <Text style={copyright}>
        © {new Date().getFullYear()} {BRANDING.name}. Todos os direitos reservados.
      </Text>
    </>
  );
}

const hr = {
  borderColor: "#e5e7eb",
  margin: "32px 0"
};

const footer = {
  textAlign: "center" as const
};

const footerText = {
  fontSize: "14px",
  color: "#9ca3af",
  marginBottom: "8px"
};

const footerLinks = {
  fontSize: "12px",
  color: "#9ca3af",
  marginBottom: "16px"
};

const socialLinks = {
  fontSize: "18px",
  color: "#9ca3af",
  gap: "8px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center" as const
};

const link = {
  color: "#3b82f6",
  textDecoration: "none"
};

const socialLink = {
  color: "#9ca3af",
  textDecoration: "none"
};

const copyright = {
  textAlign: "center" as const,
  fontSize: "12px",
  color: "#9ca3af",
  marginTop: "24px"
};
