const { Telegraf } = require('telegraf');
const MongoClient = require('mongodb').MongoClient;
BOT_TOKEN = '1617656447:AAEnW555Y0tyuilZOVKljLGw6PJJpL0Gq4s';
const bot = new Telegraf(BOT_TOKEN);
const mongoClient = new MongoClient(
  'mongodb+srv://vlad:vlad123@cluster0.zfcnq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  {
    useUnifiedTopology: true,
  }
);
mongoClient.connect(function (err, client) {
  const db = client.db('FCIT-locations');
  const collection = db.collection('locations');
  if (err) return console.log(err);
  collection.find().toArray(function (err, results) {
    res = results;
    client.close;
  });
});
// bot.start((ctx) => ctx.reply(res[0])); //ответ бота на команду /start
bot.help((ctx) => ctx.reply('Send me a sticker'));
bot.hears('hi', (ctx) => ctx.reply('Hey there'));
bot.launch(); // запуск бота

bot.command('/try', (ctx) => {
  ctx.reply(res);
});
