let connectDB = require("../../database/database");
exports.handler = async (event, context) => {
    let {
        httpMethod: method,
        queryStringParameters:parametro,
        body
    } = event;
    if (method == 'GET') {
        try {    
            let id = Number(parametro.id)
            let client = await connectDB();
            const colCarts = client.db('databasetest').collection('cartsUsers');
            const findResult = await colCarts.countDocuments({'idTlgUser' : id});
            console.log(findResult)
            return {
                statusCode: 200,
                body: JSON.stringify(findResult),
                // // more keys you can return:
                // headers: { "headerName": "headerValue", ... },
                // isBase64Encoded: true,
            }
        } catch (error) {
            return { statusCode: 500, body: error.toString() }
        }
    }

}