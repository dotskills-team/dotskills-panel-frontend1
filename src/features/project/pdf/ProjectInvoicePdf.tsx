
import { Document, Page, Text, View, StyleSheet, Font, Image } from "@react-pdf/renderer";
import type { IProject } from "@/types/project.types";
import { formatDate } from "@/features/project/utils/project.utils";

// Bengali font needed for the ৳ (Taka) sign — default PDF fonts (Helvetica) can't render it.
Font.register({
    family: "NotoBengali",
    fonts: [
        { src: "/fonts/NotoSansBengali-Regular.ttf", fontWeight: 400 },
        { src: "/fonts/NotoSansBengali-Bold.ttf", fontWeight: 700 },
    ],
});

// Local currency formatter for the invoice only — doesn't touch the shared
// formatCurrency util used elsewhere in the app (which still shows $).
const formatTaka = (amount?: number | null) => {
    if (amount === undefined || amount === null || Number.isNaN(Number(amount))) return "৳0";
    return `৳${Number(amount).toLocaleString("en-US")}`;
};

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontSize: 10,
        fontFamily: "Helvetica",
        color: "#1e293b",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 24,
        paddingBottom: 16,
        borderBottom: "2 solid #4f46e5",
    },
    logo: {
        width: 90,
        height: 90,
        objectFit: "contain",
    },
    invoiceTitle: {
        fontSize: 13,
        fontWeight: 700,
        textAlign: "right",
        color: "#0f172a",
    },
    invoiceMeta: {
        fontSize: 9,
        color: "#64748b",
        textAlign: "right",
        marginTop: 4,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 9,
        fontWeight: 700,
        textTransform: "uppercase",
        color: "#64748b",
        marginBottom: 6,
        letterSpacing: 0.5,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 3,
    },
    label: {
        color: "#64748b",
    },
    value: {
        fontWeight: 700,
        color: "#0f172a",
    },
    taka: {
        fontFamily: "NotoBengali",
    },
    twoCol: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    col: {
        width: "48%",
    },
    table: {
        marginTop: 6,
    },
    tableHeaderRow: {
        flexDirection: "row",
        backgroundColor: "#4f46e5",
        paddingVertical: 6,
        paddingHorizontal: 8,
        borderRadius: 2,
    },
    tableRow: {
        flexDirection: "row",
        paddingVertical: 7,
        paddingHorizontal: 8,
        borderBottom: "1 solid #e2e8f0",
    },
    tableRowAlt: {
        backgroundColor: "#f8fafc",
    },
    thText: {
        color: "#ffffff",
        fontSize: 9,
        fontWeight: 700,
    },
    tdText: {
        fontSize: 9,
        color: "#334155",
    },
    colInstallment: { width: "34%" },
    colDate: { width: "22%" },
    colPct: { width: "14%", textAlign: "right" },
    colAmount: { width: "18%", textAlign: "right" },
    colStatus: { width: "12%", textAlign: "right" },
    totalRow: {
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
        marginTop: 10,
        paddingTop: 8,
        borderTop: "2 solid #0f172a",
    },
    totalLabel: {
        fontSize: 11,
        fontWeight: 700,
        marginRight: 12,
        color: "#0f172a",
    },
    totalValue: {
        fontSize: 12,
        fontWeight: 700,
        color: "#4f46e5",
    },
    footer: {
        position: "absolute",
        bottom: 30,
        left: 40,
        right: 40,
        fontSize: 8,
        color: "#94a3b8",
        textAlign: "center",
        borderTop: "1 solid #e2e8f0",
        paddingTop: 10,
    },
});

interface ProjectInvoicePdfProps {
    project: IProject;
    logoSrc?: string;
}

export function ProjectInvoicePdf({ project, logoSrc = "/logo.png" }: ProjectInvoicePdfProps) {
    const clientName = `${project.client?.firstName ?? ""} ${project.client?.lastName ?? ""}`.trim();
    const schedule = project.paymentSchedule ?? [];
    const totalPaid = (project.payments ?? []).reduce((sum, p) => sum + (p.amount || 0), 0);

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <Image src={logoSrc} style={styles.logo} />
                    <View>
                        <Text style={styles.invoiceTitle}>INVOICE</Text>
                        <Text style={styles.invoiceMeta}>
                            Date: {formatDate(new Date().toISOString())}
                        </Text>
                    </View>
                </View>

                <View style={styles.twoCol}>
                    <View style={styles.col}>
                        <Text style={styles.sectionTitle}>Billed To</Text>
                        <Text style={{ fontSize: 11, fontWeight: 700, marginBottom: 2 }}>
                            {clientName || "—"}
                        </Text>
                        <Text style={{ color: "#64748b" }}>{project.client?.email ?? ""}</Text>
                    </View>
                    <View style={[styles.col, { alignItems: "flex-end" }]}>
                        <Text style={styles.sectionTitle}>Project</Text>
                        <Text style={{ fontSize: 11, fontWeight: 700, marginBottom: 2 }}>
                            {project.name}
                        </Text>
                        <Text style={{ color: "#64748b" }}>
                            {formatDate(project.startDate)}
                            {project.endDate ? ` — ${formatDate(project.endDate)}` : ""}
                        </Text>
                    </View>
                </View>

                {schedule.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Payment Schedule</Text>
                        <View style={styles.table}>
                            <View style={styles.tableHeaderRow}>
                                <Text style={[styles.thText, styles.colInstallment]}>Installment</Text>
                                <Text style={[styles.thText, styles.colDate]}>Projection Date</Text>
                                <Text style={[styles.thText, styles.colPct]}>%</Text>
                                <Text style={[styles.thText, styles.colAmount]}>Amount</Text>
                                <Text style={[styles.thText, styles.colStatus]}>Status</Text>
                            </View>
                            {schedule.map((installment, index) => (
                                <View
                                    key={installment._id ?? index}
                                    style={[
                                        styles.tableRow,
                                        ...(index % 2 === 1 ? [styles.tableRowAlt] : []),
                                    ]}
                                >
                                    <Text style={[styles.tdText, styles.colInstallment]}>
                                        {installment.installmentNo}
                                    </Text>
                                    <Text style={[styles.tdText, styles.colDate]}>
                                        {formatDate(installment.projectionDate)}
                                    </Text>
                                    <Text style={[styles.tdText, styles.colPct]}>
                                        {installment.paymentPercentage}%
                                    </Text>
                                    <Text style={[styles.tdText, styles.colAmount, styles.taka]}>
                                        {formatTaka(installment.amount)}
                                    </Text>
                                    <Text style={[styles.tdText, styles.colStatus]}>
                                        {installment.isCompleted ? "Paid" : "Pending"}
                                    </Text>
                                </View>
                            ))}
                        </View>

                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>Total Project Value</Text>
                            <Text style={[styles.totalValue, styles.taka]}>
                                {formatTaka(project.budget)}
                            </Text>
                        </View>
                    </View>
                )}

                <View style={styles.section}>
                    <View style={styles.row}>
                        <Text style={styles.label}>Total Paid</Text>
                        <Text style={[styles.value, styles.taka]}>{formatTaka(totalPaid)}</Text>
                    </View>
                    {project.budget !== undefined && (
                        <View style={styles.row}>
                            <Text style={styles.label}>Amount Due</Text>
                            <Text style={[styles.value, styles.taka]}>
                                {formatTaka(Math.max((project.budget ?? 0) - totalPaid, 0))}
                            </Text>
                        </View>
                    )}
                </View>

                <Text style={styles.footer}>
                    DotSkills · This is a system-generated invoice for {project.name}.
                </Text>
            </Page>
        </Document>
    );
}