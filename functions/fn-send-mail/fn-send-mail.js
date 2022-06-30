const nodemailer = require('nodemailer')
const connectDB = require("../../config/database");

exports.handler = async (event, context) => {

    let { httpMethod: method, body } = event;

    if (method == 'POST') {
        try {
            let newBody = JSON.parse(event.body)
            let name = newBody.name;
            let from = newBody.from;
            let to = newBody.to;
            let text = newBody.text;

            var smtpTransport = nodemailer.createTransport(
                {
                    service: "Gmail",
                    auth: {
                        user: "jgalvis414@gmail.com",
                        pass: "kyoeqjknpkcmmfof"
                    }
                });
            var mailOptions = {
                from: from,
                to: to,
                subject: name + ' | Aqui esta tu factura | ',
                html: text,
                //html: message2
            }
            smtpTransport.sendMail(mailOptions);

            return {
                statusCode: 200,
            }
        } catch (error) {
            return { statusCode: 500, body: error.toString() }
        }
    }
}