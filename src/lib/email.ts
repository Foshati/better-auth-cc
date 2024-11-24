import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async ({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html: string;
  text: string;
}) => {
  try {
    const data = await resend.emails.send({
      from: 'Your App <onboarding@resend.dev>', // Update with your verified domain
      to,
      subject,
      html,
      text,
    });
    return { data };
  } catch (error) {
    return { error };
  }
};