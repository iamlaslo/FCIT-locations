//<<<<<<< Updated upstream
const { Telegraf, session, Scenes:{ WizardScene, Stage}, Markup} = require('telegraf');
const TOKEN = '1699609256:AAG1Iq8avfrlULqnmqgEzyfQd8vZsBOvLZ4'//'1663994003:AAF02oK7kVii4QSXxJ2edLdKuNUkyT47zq4' //main '1699609256:AAG1Iq8avfrlULqnmqgEzyfQd8vZsBOvLZ4'
const bot = new Telegraf(TOKEN);
const MongoClient = require('mongodb').MongoClient;

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

canceladd = {reply_markup: {
  resize_keyboard: true,
  one_time_keyboard: true,
  keyboard: [ [{text:"Отмена"}] ]
}}

addkeyboard = {reply_markup:{
  inline_keyboard:[
  [{text:"Кафе", callback_data: "cafe"}],
  [{text:"Достопримечательность", callback_data: "place"}]
  ]
}}

more = {reply_markup:{
  inline_keyboard:[
  [{text:"Ещё", callback_data: "more"}, {text: "Отмена", callback_data: "canceldb"}]
  ]
}}

locationkeyboard = {reply_markup:{
  resize_keyboard: true,
  one_time_keyboard: true,
  keyboard: [ 
    [{text: 'Поделиться локацией', request_location: true}]
  ]
}}

//=======
const {
  Telegraf,
  session,
  Scenes: { WizardScene, Stage },
  Markup,
} = require('telegraf');
const TOKEN = '1699609256:AAG1Iq8avfrlULqnmqgEzyfQd8vZsBOvLZ4';
const bot = new Telegraf(TOKEN);
const MongoClient = require('mongodb').MongoClient;

const mongo = require('./mongo.js');

console.log(mongo.db());

mongo.db();
// const mongoClient = new MongoClient(
//   'mongodb+srv://vlad:vlad123@cluster0.zfcnq.mongodb.net/test',
//   { useUnifiedTopology: true }
// );

// mongoClient.connect(async function (err, client) {
//   const db = client.db('FCIT-locations');
//   const collection = db.collection('locations');
//   if (err) return console.log(err);
//   collection.find().toArray(async function (err, results) {
//     if (err) return console.log(err);
//     res = results;
//     if (res.length > 0) {
//       for (doc of res) {
//         locs.push(await doc);
//       }
//     }
//   });
// });

canceladd = {
  reply_markup: {
    inline_keyboard: [[{ text: 'Отмена', callback_data: 'canceladd' }]],
  },
};

addkeyboard = {
  reply_markup: {
    inline_keyboard: [
      [{ text: 'Кафе', callback_data: 'cafe' }],
      [{ text: 'Достопримечательность', callback_data: 'place' }],
    ],
  },
};

more = {
  reply_markup: {
    inline_keyboard: [
      [
        { text: 'Ещё', callback_data: 'more' },
        { text: 'Отмена', callback_data: 'canceladd' },
      ],
    ],
  },
};

locationkeyboard = {
  reply_markup: {
    resize_keyboard: true,
    one_time_keyboard: true,
    keyboard: [[{ text: 'Поделиться локацией', request_location: true }]],
  },
};

//>>>>>>> Stashed changes
mainkeyboard = {
  reply_markup: {
    inline_keyboard: [
      [
        { text: 'Кафе', callback_data: '/cafe', resize_keyboard: true },
        {
          text: 'Достопримечательность',
          callback_data: '/place',
          resize_keyboard: true,
        },
      ],
<<<<<<< Updated upstream
      [{text: "Добавить место", callback_data: 'addplace'}],
      [{text: 'Найти ближайшие', callback_data: 'showlocation'}]
    ]
  }
}

i = 0
const show_place = new WizardScene(
  'show-place',
  ctx =>{
    ctx.replyWithPhoto( locs[i].image );
//=======
      [{ text: 'Добавить место', callback_data: 'addplace' }],
      [{ text: 'Найти ближайшие', callback_data: 'showlocation' }],
    ],
  },
};

bot.command('start', async (ctx) => {
  // try {
  //   for (let j = 0; j <= 50; j++) {
  //     ctx.deleteMessage(ctx.message.message_id - j);
  //   }
  // } catch (err) {
  //   console.log(err);
  // }

  console.log('Bot was used');
  ctx.reply('Добро пожаловать!', mainkeyboard);
});

bot.on('location', (ctx) => {
  ctx.deleteMessage(ctx.message.message_id - 1);
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
    Math.floor(place.distance);
    place.time = place.distance / 1.1 / 60;
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
      ctx.reply(
        locs[0].name +
          ' - ' +
          locs[0].desc +
          ' - ' +
          Math.floor(locs[0].distance) +
          ' метрiв' +
          ' - ' +
          Math.floor(locs[0].time) +
          ' хвилин'
      );
    }, 1000);

    setTimeout(() => {
      ctx.tg.sendLocation(ctx.chat.id, locs[0].x, locs[0].y);
    }, 2000);
  }, 1000);

  setTimeout(() => {
    ctx.replyWithPhoto({ url: locs[1].image });

    setTimeout(() => {
      ctx.reply(
        locs[1].name +
          ' - ' +
          locs[1].desc +
          ' - ' +
          Math.floor(locs[1].distance) +
          ' метрiв' +
          ' - ' +
          Math.floor(locs[1].time) +
          ' хвилин'
      );
    }, 1000);

    setTimeout(() => {
      ctx.tg.sendLocation(ctx.chat.id, locs[1].x, locs[1].y);
    }, 2000);
  }, 3000);

  setTimeout(() => {
    ctx.replyWithPhoto({ url: locs[2].image });

    setTimeout(() => {
      ctx.reply(
        locs[2].name +
          ' - ' +
          locs[2].desc +
          ' - ' +
          Math.floor(locs[2].distance) +
          ' метрiв' +
          ' - ' +
          Math.floor(locs[2].time) +
          ' хвилин'
      );
    }, 1000);

    setTimeout(() => {
      ctx.tg.sendLocation(ctx.chat.id, locs[2].x, locs[2].y);
    }, 2000);
    setTimeout(() => {
      ctx.reply('Что хотите сделать?', mainkeyboard);
    }, 3000);
  }, 6000);
});

bot.action('showlocation', (ctx) => {
  ctx.deleteMessage();
  ctx.reply('Пожалуйста покажите, где Вы', locationkeyboard);
});

i = 0;
const show_place = new WizardScene(
  'show-place',
  (ctx) => {
    ctx.replyWithPhoto({ url: locs[i].image });
//>>>>>>> Stashed changes
    setTimeout(() => {
      ctx.reply(locs[i].name + ' - ' + locs[i].desc);
    }, 1000);
    setTimeout(() => {
      ctx.tg.sendLocation(ctx.chat.id, locs[i].x, locs[i].y);
    }, 2000);
    setTimeout(() => {
      if (i === res.length - 1) i = 0;
      else i++;
      ctx.reply('Показать ещё?', more);
    }, 3000);
    return ctx.wizard.next();
  },
//<<<<<<< Updated upstream
  ctx =>{
    ctx.deleteMessage()
    ctx.scene.leave()
    if( ctx.callbackQuery.data == 'more') ctx.scene.enter('show-place')
    else if(ctx.callbackQuery.data =='canceldb') ctx.reply('Що Ви бажаєте зробити?', mainkeyboard)
  }
)

const findlclose = new WizardScene(
  'find-close',
  ctx=>{
    ctx.deleteMessage(ctx.message.message_id-1)
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
      setTimeout(() => {
        ctx.reply('Что хотите сделать?', mainkeyboard)
      }, 3000);
    }, 6000);
    ctx.scene.leave()
//=======
  (ctx) => {
    ctx.deleteMessage();
    ctx.scene.leave();
    if ((callback_data = 'more')) ctx.scene.enter('show-place');
//>>>>>>> Stashed changes
  }
);

const add_data = new WizardScene(
//<<<<<<< Updated upstream
	'add-data',
	ctx => {
		ctx.reply('Введите название места: ',canceladd);
		return ctx.wizard.next();
	},
	ctx =>{
    ctx.deleteMessage()
    ctx.deleteMessage(ctx.message.message_id-1)
		name = ctx.message.text;
		ctx.reply('Введите короткое описание места: ', canceladd);
		return ctx.wizard.next();
	},
	ctx =>{
    t=0
    ctx.deleteMessage()
    ctx.deleteMessage(ctx.message.message_id-1)
    desc = ctx.message.text;
		ctx.reply('Отправьте фото места: ', canceladd);
		return ctx.wizard.next();
	},
	ctx =>{
    if (ctx.message.photo || t==1){
    t=0
  	ctx.deleteMessage()
    ctx.deleteMessage(ctx.message.message_id-1)
    if (ctx.message.photo)image = ctx.message.photo[ctx.message.photo.length-1].file_id
		ctx.reply('Отправьте геолокацию места: ', canceladd)
		return ctx.wizard.next();
    } else {
      ctx.wizard.back()
      return ctx.wizard.steps[ctx.wizard.cursor](ctx)
    }
	},
	ctx =>{
      if(ctx.message.location){
      ctx.deleteMessage()
      ctx.deleteMessage(ctx.message.message_id-1)
      x = ctx.message.location.latitude
      y = ctx.message.location.longitude
      ctx.replyWithPhoto(image)
      setTimeout(() => {
      ctx.reply('Название: ' + name +'\nОписание: '+desc+'\nКоордината x: '+x+'\nКоордината y: '+y+'\nВсё верно?',
      {
        reply_markup: {
            resize_keyboard: true,
            one_time_keyboard: true,
          keyboard: [
            [{text:"Подтвердить"}],
            [{text:"Отмена"}]
          ]
        }
      });
      }, 1000);
      dbaccepted=1
      return ctx.scene.leave();
    }else {
      t=1
      ctx.wizard.back()
      return ctx.wizard.steps[ctx.wizard.cursor](ctx)
    }
  }
)

const stage = new Stage([add_data, show_place, findlclose])

stage.hears('Отмена', ctx => {
  ctx.deleteMessage()
  ctx.deleteMessage(ctx.message.message_id-1)
	ctx.scene.leave()
  ctx.reply('Что хотите сделать?', mainkeyboard)
//=======
  'add-data',
  (ctx) => {
    ctx.reply('Введите название места: ', canceladd);
    return ctx.wizard.next();
  },
  (ctx) => {
    ctx.deleteMessage();
    ctx.deleteMessage(ctx.message.message_id - 1);
    name = ctx.message.text;
    ctx.reply('Введите короткое описание места: ', canceladd);
    return ctx.wizard.next();
  },
  (ctx) => {
    ctx.deleteMessage();
    ctx.deleteMessage(ctx.message.message_id - 1);
    desc = ctx.message.text;
    ctx.reply('Отправьте ссылку на фото места: ', canceladd);
    return ctx.wizard.next();
  },
  (ctx) => {
    ctx.deleteMessage();
    ctx.deleteMessage(ctx.message.message_id - 1);
    image = ctx.message.text;
    ctx.reply('Отправьте координату x места: ', canceladd);
    return ctx.wizard.next();
  },
  (ctx) => {
    ctx.deleteMessage();
    ctx.deleteMessage(ctx.message.message_id - 1);
    x = ctx.message.text;
    ctx.reply('Отправьте координату y места: ', canceladd);
    return ctx.wizard.next();
  },
  (ctx) => {
    ctx.deleteMessage();
    ctx.deleteMessage(ctx.message.message_id - 1);
    y = ctx.message.text;
    ctx.reply(
      'Название: ' +
        name +
        '\nОписание: ' +
        desc +
        '\nФото: ' +
        image +
        '\nКоордината x: ' +
        x +
        '\nКоордината y: ' +
        y +
        '\nВсё верно?',
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: 'Подтвердить', callback_data: 'acceptdb' }],
            [{ text: 'Отмена', callback_data: 'canceldb' }],
          ],
        },
      }
    );
    return ctx.scene.leave();
  }
);

const stage = new Stage([add_data, show_place]);

stage.action('canceladd', (ctx) => {
  ctx.deleteMessage();
  ctx.scene.leave();
  ctx.reply('Что хотите сделать?', mainkeyboard);
//>>>>>>> Stashed changes
});

bot.use(session());
bot.use(stage.middleware());


bot.command('start', async (ctx) => {
  for(let j=0;j<=50;j++) {
    ctx.deleteMessage(ctx.message.message_id-j);
  }
    console.log('Bot was used');
    ctx.reply('Добро пожаловать!', mainkeyboard)
});
  
let locs = [];

bot.action('showlocation', ctx =>{
    ctx.deleteMessage()
    ctx.reply('Пожалуйста покажите, где Вы', locationkeyboard)
    ctx.scene.enter('find-close')
})

bot.action('/place', (ctx) => {
  ctx.deleteMessage();
  ctx.scene.enter('show-place');
});

bot.action('addplace', (ctx) => {
  ctx.deleteMessage();
  ctx.reply('Что за место вы хотите добавить?', addkeyboard);
});

bot.action('cafe', (ctx) => {
  ctx.deleteMessage();
  type = 'cafe';
  ctx.scene.enter('add-data');
});

bot.action('place', (ctx) => {
  ctx.deleteMessage();
  type = 'place';
  ctx.scene.enter('add-data');
});

bot.action('acceptdb', (ctx) => {
  let place = { name: name, desc: desc, image: image, x: x, y: y, type: type };
  mongoClient.connect(function (err, client) {
    const db = client.db('FCIT-locations');
    const collection = db.collection('offerlocations');
    if (err) return console.log(err);
    collection.insertOne(place, function (err, result) {
      if (err) return console.log(err);
      ctx.editMessageText(
        'Успешно добавлено в базу данных\nВаша анкета будет рассмотрена администраторами',
        mainkeyboard
      );
    });
  });
});

//<<<<<<< Updated upstream
bot.action('addplace', (ctx) =>{
  ctx.deleteMessage()
  ctx.reply('Что за место вы хотите добавить?', addkeyboard)
})

bot.action('cafe', ctx =>{
	ctx.deleteMessage()
	type = 'cafe'
	ctx.scene.enter('add-data')
})

bot.action('place', ctx =>{
	ctx.deleteMessage()
	type = 'place'
	ctx.scene.enter('add-data')
})

bot.hears('Подтвердить', ctx =>{
  if(dbaccepted!==1) return
	else {
  let place = {name: name, desc: desc, image: image, x: x, y: y, type: type}
	mongoClient.connect(function(err, client){
	    const db = client.db("FCIT-locations")
	    const collection = db.collection("offerlocations")
	    if(err) return console.log(err)
		  collection.insertOne(place, function(err, result){
	        if(err) return console.log(err)
	        ctx.reply("Успешно добавлено в базу данных\nВаша анкета будет рассмотрена администраторами", mainkeyboard)
    	})
	})
  }
})

bot.on('message', ctx =>{
  ctx.deleteMessage()
})

bot.launch();
//=======
bot.launch();
//>>>>>>> Stashed changes
