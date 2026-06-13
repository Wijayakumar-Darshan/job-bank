package com.sljobbank.report;

import com.itextpdf.text.*;
import com.itextpdf.text.Font;
import com.itextpdf.text.pdf.*;
import com.sljobbank.repository.*;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import com.itextpdf.text.pdf.draw.LineSeparator;

import java.io.*;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final UserRepository      userRepo;
    private final JobRepository       jobRepo;
    private final PaymentRepository   paymentRepo;
    private final StudentViewRepository viewRepo;

    private static final Font TITLE_FONT  = new Font(Font.FontFamily.HELVETICA, 18, Font.BOLD,  BaseColor.DARK_GRAY);
    private static final Font HEADER_FONT = new Font(Font.FontFamily.HELVETICA, 11, Font.BOLD,  BaseColor.WHITE);
    private static final Font CELL_FONT   = new Font(Font.FontFamily.HELVETICA, 10, Font.NORMAL, BaseColor.DARK_GRAY);
    private static final Font SUB_FONT    = new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD,  BaseColor.DARK_GRAY);

    private static final BaseColor PRIMARY_COLOR = new BaseColor(10, 46, 28);   // #0A2E1C
    private static final BaseColor ACCENT_COLOR  = new BaseColor(232, 162, 0);  // #E8A200
    private static final BaseColor ROW_ALT       = new BaseColor(242, 245, 243); // #F2F5F3

    // ── User Report (PDF) ───────────────────────────────────────
    public byte[] generateUserReportPdf() throws DocumentException {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Document doc = new Document(PageSize.A4, 40, 40, 60, 40);
        PdfWriter.getInstance(doc, out);
        doc.open();

        addReportHeader(doc, "Monthly User Report", "SL Job Bank — Career Guidance Platform");

        long totalUsers   = userRepo.count();
        long students     = userRepo.findByRole(com.sljobbank.entity.Role.STUDENT).size();
        long counselors   = userRepo.findByRole(com.sljobbank.entity.Role.COUNSELOR).size();
        long paidStudents = userRepo.findAll().stream()
                .filter(u -> u.getSubscriptionType() == com.sljobbank.entity.SubscriptionType.PAID).count();

        addSummaryTable(doc, new String[][]{
                { "Total Users",         String.valueOf(totalUsers) },
                { "Students",            String.valueOf(students) },
                { "Counselors",          String.valueOf(counselors) },
                { "Paid Subscribers",    String.valueOf(paidStudents) },
                { "Free Users",          String.valueOf(students - paidStudents) },
        });

        doc.add(new Paragraph("\n"));
        addSectionTitle(doc, "User Listing");

        PdfPTable table = createTable(new String[]{
                "Name", "Email", "Role", "Subscription", "Status", "Joined"
        }, new float[]{ 3f, 4f, 2f, 2f, 1.5f, 2.5f });

        boolean alt = false;
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("dd MMM yyyy");
        for (var user : userRepo.findAll()) {
            BaseColor bg = alt ? ROW_ALT : BaseColor.WHITE;
            addRow(table, bg, CELL_FONT,
                    user.getFullName() != null ? user.getFullName() : "-",
                    user.getEmail() != null ? user.getEmail() : "-",
                    user.getRole() != null ? String.valueOf(user.getRole()) : "-",
                    user.getSubscriptionType() != null ? String.valueOf(user.getSubscriptionType()) : "-",
                    user.isActive() ? "Active" : "Inactive",
                    user.getCreatedAt() != null ? user.getCreatedAt().format(fmt) : "-"
            );
            alt = !alt;
        }
        doc.add(table);
        addFooter(doc);
        doc.close();
        return out.toByteArray();
    }

    // ── Job Report (PDF) ────────────────────────────────────────
    public byte[] generateJobReportPdf() throws DocumentException {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Document doc = new Document(PageSize.A4.rotate(), 40, 40, 60, 40);
        PdfWriter.getInstance(doc, out);
        doc.open();

        addReportHeader(doc, "Job Analytics Report", "Career listings and demand analysis");

        PdfPTable table = createTable(new String[]{
                "Job Title", "Cluster", "Salary Min (LKR)", "Salary Max (LKR)", "Demand", "Remote", "Internship"
        }, new float[]{ 3.5f, 3f, 2.5f, 2.5f, 2f, 1.5f, 1.5f });

        boolean alt = false;
        for (var job : jobRepo.findAll()) {
            BaseColor bg = alt ? ROW_ALT : BaseColor.WHITE;
            addRow(table, bg, CELL_FONT,
                    job.getTitle() != null ? job.getTitle() : "-",
                    job.getCluster() != null ? job.getCluster().getName() : "-",
                    job.getSalaryMin() != null ? String.format("%.0f", job.getSalaryMin()) : "-",
                    job.getSalaryMax() != null ? String.format("%.0f", job.getSalaryMax()) : "-",
                    job.getIndustryDemand() != null ? job.getIndustryDemand() : "-",
                    Boolean.TRUE.equals(job.getRemoteAvailable()) ? "Yes" : "No",
                    Boolean.TRUE.equals(job.getInternshipAvailable()) ? "Yes" : "No"
            );
            alt = !alt;
        }
        doc.add(table);
        addFooter(doc);
        doc.close();
        return out.toByteArray();
    }

    // ── Revenue Report (PDF) ────────────────────────────────────
    public byte[] generateRevenueReportPdf() throws DocumentException {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Document doc = new Document(PageSize.A4, 40, 40, 60, 40);
        PdfWriter.getInstance(doc, out);
        doc.open();

        addReportHeader(doc, "Revenue & Payment Report", "Subscription payments and revenue analysis");

        List<com.sljobbank.entity.Payment> payments = paymentRepo.findAll();

        // Fix: getStatus() returns String, not enum
        double total     = payments.stream()
                .filter(p -> "COMPLETED".equalsIgnoreCase(String.valueOf(p.getStatus())))
                .mapToDouble(com.sljobbank.entity.Payment::getAmount)
                .sum();
        long completed   = payments.stream()
                .filter(p -> "COMPLETED".equalsIgnoreCase(String.valueOf(p.getStatus())))
                .count();
        long pending     = payments.stream()
                .filter(p -> "PENDING".equalsIgnoreCase(String.valueOf(p.getStatus())))
                .count();

        addSummaryTable(doc, new String[][]{
                { "Total Revenue (LKR)",    String.format("%.2f", total) },
                { "Completed Payments",     String.valueOf(completed) },
                { "Pending Payments",       String.valueOf(pending) },
                { "Total Transactions",     String.valueOf(payments.size()) },
        });

        doc.add(new Paragraph("\n"));
        addSectionTitle(doc, "Transaction Details");

        PdfPTable table = createTable(new String[]{
                "Payment ID", "User", "Amount (LKR)", "Method", "Status", "Date"
        }, new float[]{ 2.5f, 3f, 2.5f, 2f, 2f, 2.5f });

        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("dd MMM yyyy HH:mm");
        boolean alt = false;
        for (var pay : payments) {
            BaseColor bg = alt ? ROW_ALT : BaseColor.WHITE;

            String paymentId = pay.getId() != null ? pay.getId().substring(0, Math.min(8, pay.getId().length())).toUpperCase() : "-";
            String userName = pay.getUser() != null ? pay.getUser().getFullName() : "-";
            String amount = pay.getAmount() != null ? String.format("%.2f", pay.getAmount()) : "-";

            // Fix: Convert method and status to String properly
            String method = pay.getMethod() != null ? String.valueOf(pay.getMethod()) : "-";
            String status = pay.getStatus() != null ? String.valueOf(pay.getStatus()) : "-";
            String date = pay.getPaymentDate() != null ? pay.getPaymentDate().format(fmt) : "-";

            addRow(table, bg, CELL_FONT,
                    paymentId,
                    userName,
                    amount,
                    method,
                    status,
                    date
            );
            alt = !alt;
        }
        doc.add(table);
        addFooter(doc);
        doc.close();
        return out.toByteArray();
    }

    // ── Excel User Report ───────────────────────────────────────
    public byte[] generateUserReportExcel() throws IOException {
        try (XSSFWorkbook wb = new XSSFWorkbook()) {
            Sheet sheet = wb.createSheet("Users");

            // Header style
            CellStyle headerStyle = wb.createCellStyle();
            org.apache.poi.ss.usermodel.Font hFont = wb.createFont();
            hFont.setBold(true);
            hFont.setColor(IndexedColors.WHITE.getIndex());
            headerStyle.setFont(hFont);
            headerStyle.setFillForegroundColor(IndexedColors.DARK_GREEN.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            headerStyle.setAlignment(HorizontalAlignment.CENTER);

            // Alt row style
            CellStyle altStyle = wb.createCellStyle();
            altStyle.setFillForegroundColor(IndexedColors.LIGHT_GREEN.getIndex());
            altStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

            String[] headers = { "ID", "Full Name", "Email", "Role", "Subscription", "Active", "Joined" };
            Row header = sheet.createRow(0);
            for (int i = 0; i < headers.length; i++) {
                Cell c = header.createCell(i);
                c.setCellValue(headers[i]);
                c.setCellStyle(headerStyle);
                sheet.setColumnWidth(i, 5000);
            }

            DateTimeFormatter fmt = DateTimeFormatter.ofPattern("dd/MM/yyyy");
            int rowNum = 1;
            for (var user : userRepo.findAll()) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(user.getId() != null ? user.getId() : "");
                row.createCell(1).setCellValue(user.getFullName() != null ? user.getFullName() : "");
                row.createCell(2).setCellValue(user.getEmail() != null ? user.getEmail() : "");
                row.createCell(3).setCellValue(user.getRole() != null ? String.valueOf(user.getRole()) : "");
                row.createCell(4).setCellValue(user.getSubscriptionType() != null ? String.valueOf(user.getSubscriptionType()) : "");
                row.createCell(5).setCellValue(user.isActive() ? "Yes" : "No");
                row.createCell(6).setCellValue(user.getCreatedAt() != null ? user.getCreatedAt().format(fmt) : "");
            }

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            wb.write(out);
            return out.toByteArray();
        }
    }

    // ── PDF Helpers ─────────────────────────────────────────────
    private void addReportHeader(Document doc, String title, String subtitle)
            throws DocumentException {
        PdfPTable header = new PdfPTable(2);
        header.setWidthPercentage(100);
        header.setWidths(new float[]{ 5f, 2f });

        PdfPCell left = new PdfPCell();
        left.setBorder(Rectangle.NO_BORDER);
        left.addElement(new Paragraph(title, TITLE_FONT));
        left.addElement(new Paragraph(subtitle, CELL_FONT));
        header.addCell(left);

        PdfPCell right = new PdfPCell();
        right.setBorder(Rectangle.NO_BORDER);
        right.setHorizontalAlignment(Element.ALIGN_RIGHT);
        right.addElement(new Paragraph("🇱🇰 SL Job Bank", SUB_FONT));
        right.addElement(new Paragraph("Generated: " + java.time.LocalDate.now(), CELL_FONT));
        header.addCell(right);

        doc.add(header);
        doc.add(new LineSeparator(1f, 100f, PRIMARY_COLOR, Element.ALIGN_CENTER, -5));
        doc.add(new Paragraph("\n"));
    }

    private void addSectionTitle(Document doc, String title) throws DocumentException {
        Paragraph p = new Paragraph(title, SUB_FONT);
        p.setSpacingBefore(10);
        p.setSpacingAfter(6);
        doc.add(p);
    }

    private void addSummaryTable(Document doc, String[][] rows) throws DocumentException {
        PdfPTable table = new PdfPTable(2);
        table.setWidthPercentage(50);
        table.setHorizontalAlignment(Element.ALIGN_LEFT);
        for (String[] row : rows) {
            PdfPCell k = new PdfPCell(new Phrase(row[0], CELL_FONT));
            k.setBackgroundColor(ROW_ALT);
            k.setPadding(6);
            PdfPCell v = new PdfPCell(new Phrase(row[1], SUB_FONT));
            v.setPadding(6);
            table.addCell(k);
            table.addCell(v);
        }
        doc.add(table);
    }

    private PdfPTable createTable(String[] headers, float[] widths) throws DocumentException {
        PdfPTable table = new PdfPTable(headers.length);
        table.setWidthPercentage(100);
        table.setWidths(widths);
        table.setSpacingBefore(10);
        for (String h : headers) {
            PdfPCell cell = new PdfPCell(new Phrase(h, HEADER_FONT));
            cell.setBackgroundColor(PRIMARY_COLOR);
            cell.setPadding(8);
            cell.setHorizontalAlignment(Element.ALIGN_CENTER);
            table.addCell(cell);
        }
        return table;
    }

    private void addRow(PdfPTable table, BaseColor bg, Font font, String... values) {
        for (String val : values) {
            PdfPCell cell = new PdfPCell(new Phrase(val != null ? val : "-", font));
            cell.setBackgroundColor(bg);
            cell.setPadding(6);
            table.addCell(cell);
        }
    }

    private void addFooter(Document doc) throws DocumentException {
        doc.add(new Paragraph("\n"));
        doc.add(new LineSeparator(0.5f, 100f, BaseColor.LIGHT_GRAY, Element.ALIGN_CENTER, -5));
        Paragraph footer = new Paragraph(
                "© " + java.time.Year.now() + " SL Job Bank — Sri Lanka Career Guidance Platform | Confidential",
                new Font(Font.FontFamily.HELVETICA, 8, Font.ITALIC, BaseColor.GRAY)
        );
        footer.setAlignment(Element.ALIGN_CENTER);
        doc.add(footer);
    }
}