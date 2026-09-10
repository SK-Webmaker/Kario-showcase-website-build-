import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const GATEWAY_URL = "https://connector-gateway.lovable.dev/resend";
const TO = "kairobooking18@gmail.com";

export const enquirySchema = z.object({
  name: z.string().trim().min(1, "Please tell us your name").max(100),
  business: z.string().trim().max(120).optional().or(z.literal("")),
  email: z.string().trim().email("Please enter a valid email").max(254),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  message: z.string().trim().min(1, "Tell us a little about the business").max(2000),

  // Extra context gathered by the /get-in-touch experience. All optional so
  // the short form on the home page keeps working unchanged.
  businessType: z.string().trim().max(80).optional().or(z.literal("")),
  teamSize: z.string().trim().max(40).optional().or(z.literal("")),
  currentSoftware: z.string().trim().max(40).optional().or(z.literal("")),
  softwareName: z.string().trim().max(120).optional().or(z.literal("")),
  monthlySpend: z.string().trim().max(60).optional().or(z.literal("")),
  frustration: z.array(z.string().max(80)).max(12).optional(),
  timeline: z.string().trim().max(60).optional().or(z.literal("")),
  intent: z.string().trim().max(60).optional().or(z.literal("")),

  // honeypot — real people never fill this
  company: z.string().max(0).optional().or(z.literal("")),
});

export type Enquiry = z.infer<typeof enquirySchema>;

const escape = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export const sendEnquiry = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => enquirySchema.parse(data))
  .handler(async ({ data }) => {
    if (data.company) return { ok: true as const };

    const lovableKey = process.env["LOVABLE_API_KEY"];
    const resendKey = process.env["RESEND_API_KEY"];
    if (!lovableKey || !resendKey) {
      throw new Error("Email is not configured yet. Please email us directly.");
    }

    const rows: Array<[string, string]> = [
      ["Name", data.name],
      ["Business", data.business || "—"],
      ["Type", data.businessType || "—"],
      ["Team size", data.teamSize || "—"],
      ["Email", data.email],
      ["Phone", data.phone || "—"],
      ["Uses software", data.currentSoftware || "—"],
      ["Which one", data.softwareName || "—"],
      ["Spends now", data.monthlySpend || "—"],
      ["Pain points", (data.frustration ?? []).join(", ") || "—"],
      ["Timeline", data.timeline || "—"],
      ["Wants", data.intent || "—"],
    ];

    const html = `
      <div style="font-family:-apple-system,Segoe UI,Arial,sans-serif;font-size:15px;color:#111">
        <h2 style="margin:0 0 16px">New Kairo enquiry</h2>
        <table style="border-collapse:collapse;margin-bottom:18px">
          ${rows
            .map(
              ([k, v]) =>
                `<tr><td style="padding:4px 16px 4px 0;color:#666">${k}</td><td style="padding:4px 0"><strong>${escape(v)}</strong></td></tr>`,
            )
            .join("")}
        </table>
        <div style="white-space:pre-wrap;border-left:3px solid #3b82f6;padding-left:12px">${escape(data.message)}</div>
      </div>`;

    const response = await fetch(`${GATEWAY_URL}/emails`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${lovableKey}`,
        "X-Connection-Api-Key": resendKey,
      },
      body: JSON.stringify({
        from: "Kairo <enquiries@kairobookings.com>",
        to: [TO],
        reply_to: data.email,
        subject: `Kairo enquiry — ${data.name}${data.business ? ` (${data.business})` : ""}`,
        html,
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      console.error(`Resend send failed [${response.status}]: ${body}`);
      throw new Error("We couldn't send that just now. Please try again, or email us directly.");
    }

    return { ok: true as const };
  });
