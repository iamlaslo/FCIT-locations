const MongoClient = require('mongodb').MongoClient;

let locs = [];

exports.db = () => {
  const mongoClient = new MongoClient(
    'mongodb+srv://vlad:vlad123@cluster0.zfcnq.mongodb.net/test',
    { useUnifiedTopology: true }
  );

  mongoClient.connect(async function (err, client) {
    const db = client.db('FCIT-locations');
    const collection = db.collection('locations');
    if (err) return console.log(err);
    collection.find().toArray(async function (err, results) {
      if (err) return console.log(err);
      res = results;
      if (res.length > 0) {
        for (doc of res) {
          locs.push(await doc);
        }
      }
    });
  });
};

exports.locs;
