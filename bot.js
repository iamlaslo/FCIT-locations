const { Telegraf, session, Scenes:{ WizardScene, Stage}, Markup} = require('telegraf');
const TOKEN ='1699609256:AAG1Iq8avfrlULqnmqgEzyfQd8vZsBOvLZ4' //'1663994003:AAF02oK7kVii4QSXxJ2edLdKuNUkyT47zq4'//'1699609256:AAG1Iq8avfrlULqnmqgEzyfQd8vZsBOvLZ4';
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
        ],[
          {text: "Добавить место", callback_data: 'addplace'}
        ]
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
  ctx
});

addkeyboard = {reply_markup:{
	inline_keyboard:[
		[{text:"Кафе", callback_data: "cafe"}],
		[{text:"Достопримечательность", callback_data: "place"}]
	]
}}

cancelmore = {reply_markup:{
  inline_keyboard:[
    [{text:"Ещё", callback_data: "more"}]
  ]
}}

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


i = 0
const show_cafe = new WizardScene(
  'show-cafe',
  ctx =>{
    ctx.replyWithPhoto({ url: locs[i].image });
    setTimeout(() => {
      ctx.reply(locs[i].name + ' - ' + locs[i].desc);
    }, 1000);
    setTimeout(() => {
      ctx.tg.sendLocation(ctx.chat.id, locs[i].x, locs[i].y);
    }, 2000);
    setTimeout(() => {
      if(i===res.length-1) i=0
      else i++
      ctx.reply('More?', cancelmore)
    },3000);
    return ctx.wizard.next()
  },
  ctx =>{
    ctx.deleteMessage()
    ctx.scene.leave()
    if(callback_data='more') ctx.scene.enter('show-cafe')
  }
)

const add_data = new WizardScene(
	'add-data',
	ctx => {
		canceladd = {reply_markup: {
			inline_keyboard: [
				[{text:"Отмена", callback_data: "canceladd"}]
			]
		}}
		ctx.reply('Введите название места: ',canceladd);
		return ctx.wizard.next();
	},
	ctx =>{
    ctx.deleteMessage()
    ctx.deleteMessage(ctx.message.message_id-1)
		name = ctx.message.text;
		ctx.reply('Введите короткое описание места: ',canceladd);
		return ctx.wizard.next();
	},
	ctx =>{
    ctx.deleteMessage()
    ctx.deleteMessage(ctx.message.message_id-1)
    desc = ctx.message.text;
		ctx.reply('Отправьте ссылку на фото места: ',canceladd);
		return ctx.wizard.next();
	},
	ctx =>{
  	ctx.deleteMessage()
    ctx.deleteMessage(ctx.message.message_id-1)
    image = ctx.message.text;
		ctx.reply('Отправьте координату x места: ',canceladd);
		return ctx.wizard.next();
	},
	ctx =>{
    ctx.deleteMessage()
    ctx.deleteMessage(ctx.message.message_id-1)
    x = ctx.message.text;
		ctx.reply('Отправьте координату y места: ',canceladd);
		return ctx.wizard.next();
	},
	ctx =>{
    ctx.deleteMessage()
    ctx.deleteMessage(ctx.message.message_id-1)
    y = ctx.message.text;
		ctx.reply('Название: ' + name +'\nОписание: '+desc+'\nФото: '+image+'\nКоордината x: '+x+'\nКоордината y: '+y+'\nВсё верно?',
		{
			reply_markup: {
				inline_keyboard: [
					[{text:"Подтвердить", callback_data: "acceptdb"}],
					[{text:"Отмена", callback_data: "canceldb"}]
				]
			}
		});
		return ctx.scene.leave();
	}
)

const stage = new Stage([add_data, show_cafe])

stage.action('canceladd', ctx => {
  ctx.deleteMessage()
	ctx.reply('Отменено')
	ctx.scene.leave()
})

bot.use(session())
bot.use(stage.middleware())

bot.action('/cafe', (ctx) => {
  ctx.scene.enter('show-cafe')
});

bot.action('addplace', (ctx) =>{
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

bot.action('acceptdb', ctx =>{
	let place = {name: name, desc: desc, image: image, x: x, y: y, type: type}
	mongoClient.connect(function(err, client){
	    const db = client.db("FCIT-locations")
	    const collection = db.collection("offerlocations")
	    if(err) return console.log(err)
		collection.insertOne(place, function(err, result){
	        if(err) return console.log(err)
	        ctx.editMessageText("Успешно добавлено в базу данных\nВаша анкета будет рассмотрена администраторами")
    	})
	})
})