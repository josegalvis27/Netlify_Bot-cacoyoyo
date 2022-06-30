// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
let { validar } = require('@yupValidationMail') 

const handler = async (event) => {
  try {
    let resp
    const subject = event.queryStringParameters.name || 'World'
    const mail = event.queryStringParameters.correo
    let validacion = await validar({ name: subject, email: mail})
    console.log(validacion)
    if (validacion) {resp = 'Son datos validos'} 
    else {resp = 'Son datos invalidos'}

    return {
      statusCode: 200,
      
      body: JSON.stringify({ message: `Hello ${subject} tu correo es: '${mail}'  ${resp}` }),
      // // more keys you can return:
      // headers: { "headerName": "headerValue", ... },
      // isBase64Encoded: true,
    }
  } catch (error) {
    return { statusCode: 500, body: error.toString() }
  }
}

module.exports = { handler }
