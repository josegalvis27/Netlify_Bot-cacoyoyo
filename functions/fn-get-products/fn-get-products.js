//database
let connectDB = require("../../database/database");
exports.handler = async (event, context) => {
  let { httpMethod: method } = event;
  if (method == 'GET') {
    try {
      let client = await connectDB();
      const colUsers = client.db('databasetest').collection('fakeApiStore');
      const findResult = await colUsers.find({}).toArray()
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



