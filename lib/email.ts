import "server-only";

import { Resend } from "resend";

let resendClient: Resend | null = null;

export function getResend() {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    return null;
  }

  if (!resendClient) {
    resendClient = new Resend(apiKey);
  }

  return resendClient;
}

export function getDeliveryEmailFrom() {
  return process.env.RESEND_FROM_EMAIL ?? "Wemplate <deliveries@wemplate.co>";
}
