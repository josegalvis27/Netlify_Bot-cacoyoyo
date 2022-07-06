let connectDB = require("../../database/database");
const fs = require("fs");
const PDFDocument = require("pdfkit");
const path = require('path')
exports.handler = async (event, context) => {
    let {
        httpMethod: method,
        body
    } = event;
    if (method == 'PUT') {
        try {
            let newBody1 = JSON.parse(event.body)
            console.log(newBody1)
            let path2 = path.resolve('./utils/invoice.pdf')

            createInvoice(newBody1, path2)
            
            function createInvoice(invoice, path) {
                let doc = new PDFDocument({ size: "A4", margin: 50 });

                generateHeader(doc);
                generateCustomerInformation(doc, invoice);
                generateInvoiceTable(doc, invoice);
                generateFooter(doc);

                doc.end();
                doc.pipe(fs.createWriteStream(path));
            }

            function generateHeader(doc) {
                let pathLogo = 'https://www.adslzone.net/app/uploads-adslzone.net/2019/04/borrar-fondo-imagen.jpg'
                doc
                    .image(pathLogo, 50, 45, { width: 50 })
                    .fillColor("#444444")
                    .fontSize(20)
                    .text("TODO MARKET C.A.", 110, 57)
                    .fontSize(10)
                    .text("TODO MARKET C.A", 200, 50, { align: "right" })
                    .text("AV. FRANCISCO DE MIRANDA", 200, 65, { align: "right" })
                    .text("Caracas, 10030", 200, 80, { align: "right" })
                    .moveDown();
            }

            function generateCustomerInformation(doc, invoice) {
                doc
                    .fillColor("#444444")
                    .fontSize(20)
                    .text("Recibo generado:", 50, 120);
                //esta son las lineas:
                generateHr(doc, 140);
                const customerInformationTop = 145;

                doc
                    .fontSize(10)
                    .text("Invoice Number:", 50, customerInformationTop)
                    .font("Helvetica-Bold")
                    .text(invoice.invoice_nr, 150, customerInformationTop)
                    .font("Helvetica")
                    .text("Invoice Date:", 50, customerInformationTop + 15)
                    .text(formatDate(new Date()), 150, customerInformationTop + 15)
                    .text("Balance Due:", 50, customerInformationTop + 30)
                    .text(
                        formatCurrency(invoice.subtotal - invoice.paid),
                        150,
                        customerInformationTop + 30
                    )

                    .font("Helvetica-Bold")
                    .text(invoice.shipping.name, 300, customerInformationTop)
                    .font("Helvetica")
                    .text(invoice.shipping.address, 300, customerInformationTop + 15)
                    .font("Helvetica")
                    .text(invoice.shipping.email, 300, customerInformationTop + 30)
                    .moveDown();

                generateHr(doc, 252);
            }

            function generateInvoiceTable(doc, invoice) {
                let i;
                const invoiceTableTop = 260;

                // tabla de la factura empieza aqui

                doc.font("Helvetica-Bold");
                generateTableRow(
                    doc,
                    invoiceTableTop,
                    "Item",
                    "Description",
                    "Unit Cost",
                    "Quantity",
                    "Line Total"
                );
                generateHr(doc, invoiceTableTop + 10);
                doc.font("Helvetica");
                //Aqui imprime los items uno a uno.. 

                for (i = 0; i < invoice.items.length; i++) {
                    const item = invoice.items[i];
                    const position = invoiceTableTop + (i + 1) * 20;
                    generateTableRow(
                        doc,
                        position,
                        item.item,
                        item.description,
                        formatCurrency(item.amount / item.quantity),
                        item.quantity,
                        formatCurrency(item.amount)
                    );

                }

                let subtotalPosition = invoiceTableTop + (i + 1) * 20;
                generateHr(doc, subtotalPosition);
                subtotalPosition = 5 + (invoiceTableTop + (i + 1) * 20);

                generateTableRow(
                    doc,
                    subtotalPosition,
                    "",
                    "",
                    "Subtotal",
                    "",
                    formatCurrency(invoice.subtotal)
                );

                const paidToDatePosition = subtotalPosition + 20;
                generateTableRow(
                    doc,
                    paidToDatePosition,
                    "",
                    "",
                    "Paid To Date",
                    "",
                    formatCurrency(invoice.paid)
                );

                const duePosition = paidToDatePosition + 25;
                doc.font("Helvetica-Bold");
                generateTableRow(
                    doc,
                    duePosition,
                    "",
                    "",
                    "Balance Due",
                    "",
                    formatCurrency(invoice.subtotal - invoice.paid)
                );
                doc.font("Helvetica");
            }

            function generateFooter(doc) {
                doc
                    .fontSize(10)
                    .text(
                        "Payment is due within 15 days. Thank you for your business.",
                        50,
                        780,
                        { align: "center", width: 500 }
                    );
            }

            function generateTableRow(
                doc,
                y,
                item,
                description,
                unitCost,
                quantity,
                lineTotal
            ) {
                doc
                    .fontSize(10)
                    .text(item, 50, y)
                    .text(description, 150, y)
                    .text(unitCost, 280, y, { width: 90, align: "right" })
                    .text(quantity, 370, y, { width: 90, align: "right" })
                    .text(lineTotal, 0, y, { align: "right" });
            }

            function generateHr(doc, y) {
                doc
                    .strokeColor("#aaaaaa")
                    .lineWidth(1)
                    .moveTo(50, y)
                    .lineTo(550, y)
                    .stroke();
            }

            function formatCurrency(cents) {
                return "$" + (cents / 100).toFixed(2);
            }

            function formatDate(date) {
                const day = date.getDate();
                const month = date.getMonth() + 1;
                const year = date.getFullYear();

                return year + "/" + month + "/" + day;
            }

            return {
                statusCode: 200,

                // // more keys you can return:
                // headers: { "headerName": "headerValue", ... },
                // isBase64Encoded: true,
            }
        } catch (error) {
            return { statusCode: 500, body: error.toString() }
        }
    }
}