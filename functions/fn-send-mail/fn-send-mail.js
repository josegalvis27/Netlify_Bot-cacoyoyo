const nodemailer = require ('nodemailer')

exports.handler = async (event, context) => {
    let { httpMethod: method, body} = event;
    if (method == 'POST') { 
        try {//console.log(JSON.parse(event.body))
            let newBody = JSON.parse(event.body)
           // console.log(newBody)
            let name = newBody.name;
            let from = newBody.from;
            let to = newBody.to;
            let text = newBody.text;

            var smtpTransport = nodemailer.createTransport(
                {
                    //service: "Gmail",
                    host: 'smtp.gmail.com',
                    port: 587,
                    secure: false,
                    auth: {
                        user: "todomarketbot@gmail.com",
                        pass: "znplaozomwazbydh"
                    }
                });
                var mailOptions = {
                    from: from,
                    to: to, 
                    subject: name+' | Aqui esta tu factura | ',
                    html: text,
                    //html: message2
                    attachments : [{
                       filename: 'invoice.pdf',
                        path: 'invoice.pdf'
                    }]
                }
                await smtpTransport.sendMail(mailOptions);
            
            return {
                statusCode: 200,
                
            }

        } catch (error) {
            return { statusCode: 500, body: error.toString() }
        }
    }
}