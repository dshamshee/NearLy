import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
  Tailwind,
  pixelBasedPreset,
} from "@react-email/components";

interface QueryEmailTemplateProps {
  name: string;
  query: string;
}

export function QueryEmailTemplate({ name, query }: QueryEmailTemplateProps) {
  const previewText = `New inquiry from ${name}`;

  return (
    <Html lang="en">
      <Tailwind config={pixelBasedPreset}>
        <Head />
        <Preview>{previewText}</Preview>
        <Body className="m-0 bg-slate-100 font-sans text-slate-800">
          <Section className="px-4 py-10">
            <Container className="mx-auto max-w-[600px] overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm">
              <Section className="border-b border-slate-100 bg-slate-800 px-8 py-6">
                <Text className="m-0 text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
                  NearLy
                </Text>
                <Heading
                  as="h1"
                  className="m-0 mt-2 text-[22px] font-semibold leading-tight text-white"
                >
                  New contact inquiry
                </Heading>
                <Text className="m-0 mt-2 text-sm leading-relaxed text-slate-300">
                  Someone submitted a message through your site contact form.
                </Text>
              </Section>

              <Section className="px-8 py-8">
                <Text className="m-0 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  From
                </Text>
                <Text className="m-0 mt-1 text-lg font-semibold text-slate-900">
                  {name}
                </Text>

                <Hr className="my-6 border-t border-slate-200" />

                <Text className="m-0 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Message
                </Text>
                <Section className="mt-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-4">
                  <Text className="m-0 whitespace-pre-wrap text-[15px] leading-7 text-slate-700">
                    {query}
                  </Text>
                </Section>

                <Text className="m-0 mt-8 text-xs leading-relaxed text-slate-500">
                  Reply directly to this email to respond to the sender (reply-to is set to
                  their address).
                </Text>
              </Section>

              <Section className="border-t border-slate-100 bg-slate-50 px-8 py-5">
                <Text className="m-0 text-center text-xs text-slate-400">
                  This is an automated notification from NearLy.
                </Text>
              </Section>
            </Container>
          </Section>
        </Body>
      </Tailwind>
    </Html>
  );
}
