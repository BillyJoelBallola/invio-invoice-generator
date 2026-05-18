import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
    fontFamily: "Helvetica",
    color: "#111",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontFamily: "Helvetica-Bold",
    color: "#6366f1",
  },
  label: {
    fontSize: 10,
    color: "#6b7280",
    marginBottom: 2,
  },
  value: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    marginBottom: 8,
    color: "#6b7280",
    textTransform: "uppercase",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f3f4f6",
    padding: "8 10",
    borderRadius: 4,
    marginBottom: 4,
  },
  tableRow: {
    flexDirection: "row",
    padding: "8 10",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  col1: { flex: 5 },
  col2: { flex: 2, textAlign: "center" },
  col3: { flex: 2, textAlign: "right" },
  total: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 2,
    borderTopColor: "#e5e7eb",
  },
  totalLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginRight: 24,
  },
  totalValue: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
  },
  notes: {
    marginTop: 32,
    padding: 12,
    backgroundColor: "#f9fafb",
    borderRadius: 4,
  },
  badge: {
    padding: "4 10",
    borderRadius: 4,
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    alignSelf: "flex-start",
  },
});

const statusColors: Record<string, string> = {
  DRAFT: "#fef9c3",
  SENT: "#dbeafe",
  PAID: "#dcfce7",
  OVERDUE: "#fee2e2",
};

type Props = {
  invoice: {
    number: string;
    status: string;
    dueDate: Date;
    total: number;
    notes: string | null;
    client: {
      name: string;
      email: string;
      phone: string | null;
      address: string | null;
    };
    items: {
      description: string;
      quantity: number;
      price: number;
    }[];
  };
};

function InvoicePDF({ invoice }: Props) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Invio</Text>
            <Text style={styles.label}>Invoice Number</Text>
            <Text style={styles.value}>{invoice.number}</Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <View
              style={[
                styles.badge,
                { backgroundColor: statusColors[invoice.status] ?? "#f3f4f6" },
              ]}
            >
              <Text>{invoice.status}</Text>
            </View>
            <Text style={[styles.label, { marginTop: 12 }]}>Due Date</Text>
            <Text style={styles.value}>
              {new Date(invoice.dueDate).toLocaleDateString("en-PH", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Text>
          </View>
        </View>

        {/* Client Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bill To</Text>
          <Text style={styles.value}>{invoice.client.name}</Text>
          <Text>{invoice.client.email}</Text>
          {invoice.client.phone && <Text>{invoice.client.phone}</Text>}
          {invoice.client.address && <Text>{invoice.client.address}</Text>}
        </View>

        {/* Items Table */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Items</Text>
          <View style={styles.tableHeader}>
            <Text style={[styles.col1, { fontSize: 10, color: "#6b7280" }]}>
              Description
            </Text>
            <Text
              style={[
                styles.col2,
                { fontSize: 10, color: "#6b7280", textAlign: "center" },
              ]}
            >
              Qty
            </Text>
            <Text
              style={[
                styles.col3,
                { fontSize: 10, color: "#6b7280", textAlign: "right" },
              ]}
            >
              Price
            </Text>
            <Text
              style={[
                styles.col3,
                { fontSize: 10, color: "#6b7280", textAlign: "right" },
              ]}
            >
              Total
            </Text>
          </View>

          {invoice.items.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.col1}>{item.description}</Text>
              <Text style={[styles.col2, { textAlign: "center" }]}>
                {item.quantity}
              </Text>
              <Text style={[styles.col3, { textAlign: "right" }]}>
                ₱{item.price.toLocaleString()}
              </Text>
              <Text style={[styles.col3, { textAlign: "right" }]}>
                ₱{(item.quantity * item.price).toLocaleString()}
              </Text>
            </View>
          ))}

          {/* Total */}
          <View style={styles.total}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>
              ₱{invoice.total.toLocaleString()}
            </Text>
          </View>
        </View>

        {/* Notes */}
        {invoice.notes && (
          <View style={styles.notes}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <Text>{invoice.notes}</Text>
          </View>
        )}
      </Page>
    </Document>
  );
}

export default InvoicePDF;
