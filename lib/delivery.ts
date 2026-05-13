import "server-only";

import { getCheckoutItemById } from "@/lib/catalog";
import { getDeliveryEmailFrom, getResend } from "@/lib/email";
import { getSupabaseAdmin, TEMPLATE_ZIP_BUCKET } from "@/lib/supabase";

type DeliverPurchaseInput = {
  stripeSessionId: string;
  templateId: string;
  buyerEmail: string;
};

type DeliveryStatus = "sent" | "pending" | "failed";

const SIGNED_LINK_SECONDS = 60 * 60 * 24 * 7;

export async function deliverTemplatePurchase({
  stripeSessionId,
  templateId,
  buyerEmail,
}: DeliverPurchaseInput) {
  const template = await getCheckoutItemById(templateId);

  if (!template) {
    await recordOrder({
      stripeSessionId,
      templateId,
      buyerEmail,
      deliveryStatus: "failed",
      error: "Template not found.",
    });
    return { ok: false, error: "Template not found." };
  }

  const signedUrl = template.zipPath ? await createTemplateSignedUrl(template.zipPath) : null;
  const emailResult = await sendDeliveryEmail({
    buyerEmail,
    templateName: template.name,
    tier: template.tier,
    stack: template.stack,
    signedUrl,
  });
  const deliveryStatus: DeliveryStatus = emailResult.ok ? "sent" : "pending";

  await recordOrder({
    stripeSessionId,
    templateId: template.id,
    buyerEmail,
    deliveryStatus,
    signedLinkSentAt: emailResult.ok ? new Date().toISOString() : undefined,
    error: emailResult.error,
  });

  return {
    ok: emailResult.ok,
    downloadUrl: signedUrl ?? undefined,
    error: emailResult.error,
  };
}

async function createTemplateSignedUrl(zipPath: string) {
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase.storage
    .from(TEMPLATE_ZIP_BUCKET)
    .createSignedUrl(zipPath, SIGNED_LINK_SECONDS);

  if (error) {
    return null;
  }

  return data.signedUrl;
}

async function sendDeliveryEmail({
  buyerEmail,
  templateName,
  tier,
  stack,
  signedUrl,
}: {
  buyerEmail: string;
  templateName: string;
  tier: string;
  stack: string;
  signedUrl: string | null;
}) {
  const resend = getResend();

  if (!resend) {
    return { ok: false, error: "Resend is not configured." };
  }

  const downloadBlock = signedUrl
    ? `Download your template here: ${signedUrl}\n\nThis signed link expires in 7 days.`
    : "Your payment is confirmed. We will send the ZIP or Drive access link manually because storage is not configured yet.";

  const htmlDownloadBlock = signedUrl
    ? `<p><a href="${escapeHtml(signedUrl)}" style="display:inline-block;background:#171717;color:#f7f4ed;padding:12px 16px;border-radius:8px;text-decoration:none;font-weight:700;">Download template</a></p><p style="color:#6b665e;">This signed link expires in 7 days.</p>`
    : `<p>Your payment is confirmed. We will send the ZIP or Drive access link manually because storage is not configured yet.</p>`;
  const safeTemplateName = escapeHtml(templateName);
  const safeTier = escapeHtml(tier);
  const safeStack = escapeHtml(stack);

  try {
    await resend.emails.send({
      from: getDeliveryEmailFrom(),
      to: buyerEmail,
      subject: `Your Wemplate files: ${templateName}`,
      text: [
        `Thanks for buying ${templateName}.`,
        `Tier: ${tier}`,
        `Stack: ${stack}`,
        downloadBlock,
        "Open the README in the ZIP first. It includes setup notes, brand swap guidance, and editing tips.",
      ].join("\n\n"),
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#171717;">
          <h1 style="font-family:Georgia,serif;">${safeTemplateName}</h1>
          <p>Thanks for buying from Wemplate.</p>
          <p><strong>Tier:</strong> ${safeTier}<br /><strong>Stack:</strong> ${safeStack}</p>
          ${htmlDownloadBlock}
          <p>Open the README in the ZIP first. It includes setup notes, brand swap guidance, and editing tips.</p>
        </div>
      `,
    });

    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Email delivery failed.",
    };
  }
}

async function recordOrder({
  stripeSessionId,
  templateId,
  buyerEmail,
  deliveryStatus,
  signedLinkSentAt,
  error,
}: {
  stripeSessionId: string;
  templateId: string;
  buyerEmail: string;
  deliveryStatus: DeliveryStatus;
  signedLinkSentAt?: string;
  error?: string;
}) {
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return;
  }

  await supabase.from("orders").upsert(
    {
      stripe_session_id: stripeSessionId,
      template_id: templateId,
      buyer_email: buyerEmail,
      delivery_status: deliveryStatus,
      signed_link_sent_at: signedLinkSentAt ?? null,
      delivery_error: error ?? null,
    },
    { onConflict: "stripe_session_id" },
  );
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
