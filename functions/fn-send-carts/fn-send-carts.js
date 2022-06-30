let connectDB = require("../../database/database");
exports.handler = async (event, context) => {
    let {
        httpMethod: method,
        body
    } = event;
    if (method == 'POST') {
        try {
            //console.log(event.body)
            let client = await connectDB();
            const db = client.db('databasetest');
            const cartsColletion = db.collection('cartsUsers');
            let newBody = JSON.parse(event.body)
            console.log(newBody)
            const insertResult = await cartsColletion.insertMany([newBody]);
            return {
                statusCode: 200,
                body: JSON.stringify(insertResult),
                // // more keys you can return:
                // headers: { "headerName": "headerValue", ... },
                // isBase64Encoded: true,
            }
        } catch (error) {
            return { statusCode: 500, body: error.toString() }
        }
    }

}