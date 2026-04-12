import type { Resend } from "resend";

/** When `RESEND_FROM` is unset, Resend uses this verified sender (override in `.env`). */
export const DEFAULT_RESEND_FROM = "Assessment <assessment@nearly.id0.uk>";

const CACHE_TTL_MS = 5 * 60 * 1000;
const cache = new Map<
  string,
  { result: { ok: true } | { ok: false; message: string }; expires: number }
>();

/** Extract the domain from a From header like `Name <user@domain.com>` or `user@domain.com`. */
export function parseSenderDomain(fromHeader: string): string | null {
  const trimmed = fromHeader.trim();
  const angle = trimmed.match(/<([^>]+)>/);
  const addr = (angle?.[1] ?? trimmed).trim();
  const at = addr.lastIndexOf("@");
  if (at === -1) return null;
  return addr.slice(at + 1).toLowerCase();
}

/**
 * Blocks sends when the From domain is not verified in Resend (SPF/DKIM missing → spam).
 * Skipped for @resend.dev test addresses or RESEND_SKIP_DOMAIN_CHECK=true.
 */
export async function assertResendSendingDomainVerified(
  resend: Resend,
  senderDomain: string
): Promise<{ ok: true } | { ok: false; message: string }> {
  if (
    senderDomain === "resend.dev" ||
    senderDomain.endsWith(".resend.dev")
  ) {
    return { ok: true };
  }
  if (process.env.RESEND_SKIP_DOMAIN_CHECK === "true") {
    return { ok: true };
  }

  const now = Date.now();
  const hit = cache.get(senderDomain);
  if (hit && hit.expires > now) {
    return hit.result;
  }

  const { data, error } = await resend.domains.list({ limit: 100 });
  if (error || !data?.data) {
    console.warn("[resend] domains.list failed:", error?.message ?? "unknown");
    return { ok: true };
  }

  const domain = data.data.find(
    (d) => d.name.toLowerCase() === senderDomain
  );

  let result: { ok: true } | { ok: false; message: string };

  if (!domain) {
    result = {
      ok: false,
      message: `Domain "${senderDomain}" is not in your Resend account. Add it in the Resend dashboard (Domains) and use a From address on that domain.`,
    };
  } else if (domain.status !== "verified") {
    result = {
      ok: false,
      message: `Domain "${senderDomain}" is not verified (status: ${domain.status}). In Resend → Domains, copy every DNS record (SPF, DKIM) into your DNS host and wait until the domain shows Verified.`,
    };
  } else {
    result = { ok: true };
  }

  cache.set(senderDomain, { result, expires: now + CACHE_TTL_MS });
  return result;
}

/** RFC-friendly Reply-To with display name (reduces "mismatched identity" signals). */
export function formatReplyTo(name: string, email: string): string {
  const cleaned = name
    .replace(/[\r\n<>]/g, " ")
    .trim()
    .slice(0, 200);
  if (!cleaned) return email;
  const escaped = cleaned.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  const needsQuotes = /[,;<>()[\]@]/.test(cleaned);
  const display = needsQuotes ? `"${escaped}"` : escaped;
  return `${display} <${email}>`;
}
