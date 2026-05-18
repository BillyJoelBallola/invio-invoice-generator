"use server";

import { renderToBuffer } from "@react-pdf/renderer";
import type { DocumentProps } from "@react-pdf/renderer";
import InvoicePDF from "@/components/pdf/InvoicePDF";
import { getInvoice } from "@/actions/invoice.action";
import { createElement } from "react";

export async function generateInvoicePDF(invoiceId: string) {
  const invoice = await getInvoice(invoiceId);
  if (!invoice) return { error: "Invoice not found." };

  try {
    const element = createElement(InvoicePDF, {
      invoice,
    }) as React.ReactElement<DocumentProps>;

    const buffer = await renderToBuffer(element);

    return {
      success: true,
      buffer: Buffer.from(buffer).toString("base64"),
      filename: `${invoice.number}.pdf`,
    };
  } catch (error) {
    console.error(error);
    return { error: "An error occurred while generating PDF." };
  }
}
