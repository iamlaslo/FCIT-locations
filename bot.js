const { Telegraf } = require('telegraf');
const TOKEN = '1699609256:AAG1Iq8avfrlULqnmqgEzyfQd8vZsBOvLZ4';
const bot = new Telegraf(TOKEN);
const MongoClient = require('mongodb').MongoClient;
bot.launch();

// const locations = [
//   {
//     name: 'Дерибасовская',
//     desc: 'главная улица города',
//     photo:
//       'https://t-cf.bstatic.com/xdata/images/hotel/max1024x768/195719302.webp?k=67e97c182fb883b3f4a69d1bf926cd3872314f92bf112ab873a0d13af0786868&o=',
//     x: 46.484151216117205,
//     y: 30.738651779259055,
//   },
//   {
//     name: 'Daily',
//     desc: 'городская кофейня, попавшая в топ-10 самых красивых кофеен мира',
//     photo:
//       'https://www.buro247.ua/images/2019/04/daily-cafe-sivak-partners-ukraine-interiors-_dezeen_2364_col_3.jpg',
//     x: 46.47600387568431,
//     y: 30.739892311800222,
//   },
// ];

// const cafe = [
//   {
//     name: 'Daily',
//     desc: 'городская кофейня, попавшая в топ-10 самых красивых кофеен мира',
//     photo:
//       'https://www.buro247.ua/images/2019/04/daily-cafe-sivak-partners-ukraine-interiors-_dezeen_2364_col_3.jpg',
//     x: 46.47600387568431,
//     y: 30.739892311800222,
//   },
// ];

// bot.use((ctx, next) => {
//   console.log('Bot was used');
//   next();
// });

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

// bot.use((ctx) => {
//   console.log(ctx);
// });

// bot.command('/try', (ctx) => {
//   console.log(ctx);
// });

// bot.action('/location', (ctx) => {
//   ctx.replyWithPhoto({ url: locations[0].photo });

//   setTimeout(() => {
//     ctx.reply(locations[0].name + ' - ' + locations[0].desc);
//   }, 1000);

//   setTimeout(() => {
//     ctx.tg.sendLocation(ctx.chat.id, locations[0].x, locations[0].y);
//   }, 2000);
// });

// bot.action('/cafe', (ctx) => {
//   ctx.replyWithPhoto({ url: cafe[0].photo });

//   setTimeout(() => {
//     ctx.reply(cafe[0].name + ' - ' + cafe[0].desc);
//   }, 1000);

//   setTimeout(() => {
//     ctx.tg.sendLocation(ctx.chat.id, cafe[0].x, cafe[0].y);
//   }, 2000);
// });

let locs = [];

const mongoClient = new MongoClient(
  /*"mongodb://localhost:27017"*/ 'mongodb+srv://vlad:vlad123@cluster0.zfcnq.mongodb.net/test',
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

// bot.command('/lol', (ctx) => {
//   console.log(locs);
// });

bot.use((ctx, next) => {
  if (ctx.update.message.location != undefined) {
    let min1x = 49.491873765473976;
    let min1y = 49.491873765473976;
    let min2x = 49.491873765473976;
    let min2y = 49.491873765473976;
    let min3x = 49.491873765473976;
    let min3y = 49.491873765473976;

    let loc1;
    let loc2;
    let loc3;

    let vectLoc = 0;
    let vectPlace = 0;
    let vectDist1 = 500.123;
    let vectDist2 = 500.123;
    let vectDist3 = 500.123;

    let tempx = 0,
      tempy = 0;
    let near = [];

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

    // function sortResults(prop, asc) {
    //   locs.sort(function (a, b) {
    //     if (asc) {
    //       return a[prop] > b[prop] ? 1 : a[prop] < b[prop] ? -1 : 0;
    //     } else {
    //       return b[prop] > a[prop] ? 1 : b[prop] < a[prop] ? -1 : 0;
    //     }
    //   });
    // }
    // const sortAsc = (arr, field) => {
    //   return arr.sort((a, b) => {
    //     if (a[distance] > b[distance]) {
    //       return 1;
    //     }
    //     if (b[distance] > a[distance]) {
    //       return -1;
    //     }
    //     return 0;
    //   });
    // };

    // for (loc of locs) {
    //   locs.sort((a, b) => {
    //     if (a.distance > b.distance) {
    //       return 1;
    //     }
    //     if (b.distance > a.distance) {
    //       return -1;
    //     }
    //     return 0;
    //   });
    // }

    // locs.sort(function (a, b) {
    //   return obj[a] - obj[b];
    // });

    locs.sort((a, b) =>
      a.distance > b.distance
        ? 1
        : a.distance === b.distance
        ? a.size > b.size
          ? 1
          : -1
        : -1
    );

    // distance = locs.distance;

    // sortAsc(locs, locs.distance);

    console.log(locs);

    // for (place of locs) {
    //   vectLoc =
    //     ctx.update.message.location.latitude +
    //     ctx.update.message.location.altitude;
    //   vectPlace = place.x + place.y;

    //   if (vectLoc - vectPlace < vectDist1) {
    //     vectDist1 = vectLoc;
    //     loc1 = place;
    //   } else if (vectLoc - vectPlace < vectDist2) {
    //     vectDist2 = vectLoc;
    //     loc2 = place;
    //   } else if (vectLoc - vectPlace < vectDist3) {
    //     vectDist3 = vectLoc;
    //     loc3 = place;
    //   }
    // }

    // for (place of locs) {
    //   loc1 = place.find(
    //     (xy) =>
    //       (xy =
    //         ctx.update.message.location.latitude +
    //         ctx.update.message.location.altitude)
    //   );
    // }

    //   foo.sort (function (a,b) {
    //     return 2 * (a.a > b.a ? 1 : a.a < b.a ? -1 : 0) + 1 * (a.b > b.b ? 1 : a.b < b.b ? -1 : 0)
    // })

    // locs.sort(function (a, b) {
    //   return a.x - b.x;
    // });

    // for (place of locs) {
    //   tempx = place.x - ctx.update.message.location.latitude;
    //   if (tempx < min1x || tempy < min1y) {
    //     min1x = tempx;
    //   }
    // }

    // console.log(locs);

    // Поиск ближайших мест
    // for (place of locs) {
    //   // tempx = place.x - ctx.update.message.location.latitude;
    //   // if (tempx < min1x || tempy < min1y) {
    //   //   min1x = tempx;
    //   //   min1y = tempy;
    //   // } else min2x = tempx;
    //   // tempy = place.y - ctx.update.message.location.longitude;
    //   // if (tempy < min1y) {
    //   //   min1y = tempy;
    //   // } else {
    //   //   min2y = tempy;
    //   // }
    //   //   if (
    //   //     min1x > ctx.update.message.location.latitude &&
    //   //     min1y > ctx.update.message.location.longitude &&
    //   //     place.x - ctx.update.message.location.latitude
    //   //   ) {
    //   //     loc1 = place;
    //   //     console.log(place);
    //   //     min1x = ctx.update.message.location.latitude;
    //   //     min1y = ctx.update.message.location.longitude;
    //   //   } else if (
    //   //     min2x > ctx.update.message.location.latitude &&
    //   //     min2y > ctx.update.message.location.longitude &&
    //   //     min2x != min1x &&
    //   //     min2y != min1y
    //   //   ) {
    //   //     loc2 = place;
    //   //     min2x = ctx.update.message.location.latitude;
    //   //     min2y = ctx.update.message.location.longitude;
    //   //   } else if (
    //   //     min3x > ctx.update.message.location.latitude &&
    //   //     min3y > ctx.update.message.location.longitude &&
    //   //     min3x != min1x &&
    //   //     min3y != min1y &&
    //   //     min3x != min2x &&
    //   //     min3y != min2y
    //   //   ) {
    //   //     loc3 = place;
    //   //     min3x = ctx.update.message.location.latitude;
    //   //     min3y = ctx.update.message.location.longitude;
    //   //   }
    // }

    // Вывод ближайших мест

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
  }

  next();
});

bot.command('/o', (ctx) => {
  ph = 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Operniy-5.jpg';
  ctx.replyWithPhoto({ url: ph });
});
