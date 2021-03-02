const { Telegraf } = require('telegraf');
const TOKEN = '1699609256:AAG1Iq8avfrlULqnmqgEzyfQd8vZsBOvLZ4';
const bot = new Telegraf(TOKEN);
const MongoClient = require('mongodb').MongoClient;
bot.launch();

bot.start(async (ctx) => {
  console.log('Bot was used');

  ctx.reply('Добро пожаловать!', {
    reply_markup: {
      inline_keyboard: [
        [
          { text: 'Кафе', callback_data: '/cafe', resize_keyboard: true },
          {
            text: 'Достопримечательность',
            callback_data: '/location',
            resize_keyboard: true,
          },
        ],
      ],
    },
  });
  ctx.reply('Куда вы хотите сходить?', {
    reply_markup: {
      keyboard: [
        [
          {
            text: 'Найти ближайшие',
            request_location: true,
            callback_data: '/try',
            resize_keyboard: true,
          },
        ],
      ],
    },
  });
});

let locs = [];

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
    res;
    if (res.length > 0) {
      for (doc of res) {
        locs.push(await doc);
      }
    }
  });
});

bot.on('location', (ctx) => {
  let currentLat = ctx.update.message.location.latitude;
  let currentLon = ctx.update.message.location.longitude;

  findNear = (lat1, lon1, lat2, lon2, place) => {
    const R = 6371e3; // metres
    const φ1 = (lat1 * Math.PI) / 180; // φ, λ in radians
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const d = R * c;
    place.distance = d;
  };
  for (place of locs) {
    findNear(currentLat, currentLon, place.x, place.y, place);
    console.log(place.distance);
  }

  locs.sort((a, b) =>
    a.distance > b.distance
      ? 1
      : a.distance === b.distance
      ? a.size > b.size
        ? 1
        : -1
      : -1
  );

  console.log(locs);

  setTimeout(() => {
    ctx.replyWithPhoto({ url: locs[0].image });

    setTimeout(() => {
      ctx.reply(locs[0].name + ' - ' + locs[0].desc);
    }, 1000);

    setTimeout(() => {
      ctx.tg.sendLocation(ctx.chat.id, locs[0].x, locs[0].y);
    }, 2000);
  }, 1000);

  setTimeout(() => {
    ctx.replyWithPhoto({ url: locs[1].image });

    setTimeout(() => {
      ctx.reply(locs[1].name + ' - ' + locs[1].desc);
    }, 1000);

    setTimeout(() => {
      ctx.tg.sendLocation(ctx.chat.id, locs[1].x, locs[1].y);
    }, 2000);
  }, 3000);

  setTimeout(() => {
    ctx.replyWithPhoto({ url: locs[2].image });

    setTimeout(() => {
      ctx.reply(locs[2].name + ' - ' + locs[2].desc);
    }, 1000);

    setTimeout(() => {
      ctx.tg.sendLocation(ctx.chat.id, locs[2].x, locs[2].y);
    }, 2000);
  }, 6000);
});

bot.action('/cafe', (ctx, next) => {
  ctx.reply('Hiiii');

  ctx.replyWithPhoto({ url: locs[2].image });

  setTimeout(() => {
    ctx.reply(locs[2].name + ' - ' + locs[2].desc);
  }, 1000);

  setTimeout(() => {
    ctx.tg.sendLocation(ctx.chat.id, locs[2].x, locs[2].y);
  }, 2000);
});
