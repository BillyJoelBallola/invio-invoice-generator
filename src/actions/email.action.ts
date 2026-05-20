"use server";

import resend from "@/lib/resend";
import { getInvoice } from "@/actions/invoice.action";
import { generateInvoicePDF } from "@/actions/pdf.action";

export async function sendInvoiceEmail(invoiceId: string) {
  const invoice = await getInvoice(invoiceId);
  if (!invoice) return { error: "Invoice not found." };

  const pdf = await generateInvoicePDF(invoiceId);
  if (pdf.error || !pdf.buffer) return { error: pdf.error };

  try {
    const emailResult = await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: invoice.client.email,
      subject: `Invoice [${invoice.number}] from Invio`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #6366f1;">Invio</h1>
          <p>Hi ${invoice.client.name},</p>
          <p>Please find attached your invoice <strong>${invoice.number}</strong>.</p>
          <table style="width: 100%; border-collapse: collapse; margin: 24px 0;">
            <tr>
              <td style="padding: 8px; color: #6b7280;">Invoice Number</td>
              <td style="padding: 8px; font-weight: bold;">${invoice.number}</td>
            </tr>
            <tr style="background: #f9fafb;">
              <td style="padding: 8px; color: #6b7280;">Amount Due</td>
              <td style="padding: 8px; font-weight: bold;">₱${invoice.total.toLocaleString()}</td>
            </tr>
            <tr>
              <td style="padding: 8px; color: #6b7280;">Due Date</td>
              <td style="padding: 8px;">${new Date(
                invoice.dueDate,
              ).toLocaleDateString("en-PH", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}</td>
            </tr>
          </table>
          <p style="color: #6b7280; font-size: 14px;">
            Please make payment before the due date.
          </p>
        </div>
      `,
      attachments: [
        {
          filename: `${invoice.number}.pdf`,
          content: Buffer.from(pdf.buffer, "base64"),
        },
      ],
    });

    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "An error occurred while sending email." };
  }
}
