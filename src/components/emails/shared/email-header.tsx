import { BRANDING } from "@/lib/constants/branding";
import { Hr, Section, Text } from "@react-email/components";

export function EmailHeader() {
  return (
    <>
      <Section style={logoSection}>
        <Text style={logo}>{BRANDING.name}</Text>
      </Section>
      <Hr />
    </>
  );
}

const logoSection = {
  marginBottom: "32px",
  textAlign: "center" as const
};

const logo = {
  fontSize: "32px",
  fontWeight: "700",
  color: "#0f172a",
  margin: "0",
  letterSpacing: "-0.02em"
};
