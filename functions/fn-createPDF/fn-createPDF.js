const nodemailer = require("nodemailer");
const mg = require("nodemailer-mailgun-transport");
const { jsPDF } = require("jspdf");

var transporter = nodemailer.createTransport(
    {
        //service: "Gmail",
        host: 'smtp.gmail.com',
        port: 465,
        secure: false,
        auth: {
            type:'OAuth2'
            user: "todomarketbot@gmail.com",
            pass: "znplaozomwazbydh"
        }
    });
exports.handler = async (event, context) => {
    const { shipping, items } = JSON.parse(event.body);
    let {
        httpMethod: method,
        body
    } = event;
    if (method == 'PUT') {
        try {
            let newBody1 = JSON.parse(event.body)

            createInvoice(newBody1)

            function generateLinesProducts(items) {
                let i = 0, len = items.length, line = '', aux = [], aux2 = [], aux3 = [], aux4 = [], aux5 = []
                for (; i < len; i++) {
                    aux.push(`${items[i].item}`)
                    aux2.push(items[i].description)
                    aux3.push(`${items[i].quantity}`)
                    aux4.push(`$${items[i].amount}`)
                    aux5.push(`$${items[i].priceUnit}`)

                }
                return [aux, aux2, aux3, aux4, aux5]

            }
            async function createInvoice(invoice) {

                let auxiliares = generateLinesProducts(invoice.items)
                let name = invoice.shipping.name
                let email = invoice.shipping.email
                let address = invoice.shipping.address
                let total = invoice.total
                let html = invoice.html
                const tiempoTranscurrido = Date.now();
                const hoy = new Date(tiempoTranscurrido);



                let doc = (new jsPDF()
                    .setFont("courier")
                    .setFontSize(20)
                    .text(['TODO MARKET. C.A'], 10, 25)
                    .setFontSize(10)
                    .text(["AV. FRANCISCO DE MIRANDA", 'Caracas, 10300'], 180, 25, { align: 'right' })
                    .setFontSize(20)
                    .text('Recibo generado', 10, 40)
                    .line(10, 44, 200, 44)
                    .setFontSize(10)
                    .text([`Fecha: ${hoy.toLocaleDateString()}`, `Monto: $${total.toFixed(2)}`], 20, 50)
                    .text([`Cliente: ${name}`, `Dirección: ${address}`, `Correo: ${email}`], 70, 50)
                    .line(10, 72, 200, 72)
                    .text('Item', 10, 78)
                    .text('Artículo', 50, 78)
                    .text('Cantidad', 95, 78)
                    .text('precio UNIT.', 115, 78)
                    .text('SubTotal', 150, 78)
                    .line(10, 80, 200, 80)
                    .text(auxiliares[0], 10, 90, { lineHeightFactor: 1.70 })
                    .text(auxiliares[1], 50, 90, { lineHeightFactor: 1.70 })
                    .text(auxiliares[2], 100, 90, { lineHeightFactor: 1.70 })
                    .text(auxiliares[4], 120, 90, { lineHeightFactor: 1.70 })
                    .text(auxiliares[3], 150, 90, { lineHeightFactor: 1.70 })
                    .line(10, 210, 200, 210)
                    .setFontSize(15)
                    .text(`Total: $${total.toFixed(2)}`, 100, 240)
                    .setFontSize(10)
                    .text(`Recibo generado a través de TODO MARKET BOT en telegram`,50,280)


                )

                doc = Buffer.from(doc.output('arraybuffer'))
             

                const info = await transporter.sendMail({
                    from: process.env.MAILGUN_SENDER,
                    to: invoice.shipping.email,
                    subject: "Recibimos tu compra!",
                   // text: 'Aca esta tu factura',
                    html: html,
                    attachments: [
                        {
                            filename: `recibo-${name}-${hoy.toLocaleDateString()}.pdf`,
                            content: doc,
                            contentType: "application/pdf",
                        },
                    ],
                });
               // console.log(`PDF report sent: ${info.messageId}`);
            }
            return {
                statusCode: 200,
            }
        } catch (error) {
            return { statusCode: 500, body: error.toString() }
        }
    }
}