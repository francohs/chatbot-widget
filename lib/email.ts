import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendUrlAlert({
  sessionId,
  sourceUrl,
}: {
  sessionId: string;
  sourceUrl: string;
}) {
  await resend.emails.send({
    from: process.env.ALERT_EMAIL_FROM!,
    to: process.env.ALERT_EMAIL_TO!,
    subject: `Someone is chatting with ${new URL(sourceUrl).hostname}`,
    html: `
      <p>A new chat session just started.</p>
      <p><strong>URL analyzed:</strong> <a href="${sourceUrl}">${sourceUrl}</a></p>
      <p><strong>Session ID:</strong> ${sessionId}</p>
    `,
  });
}
