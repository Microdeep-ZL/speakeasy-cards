const url = require("url");
const http = require("http");
const WebSocketServer = require('websocket').server
const Game = require("./game");

var game = new Game()
setInterval(
  function () {
    game = new Game()
  },
  24 * 60 * 60 * 1000
); //每隔24小时清除一次rooms.json内容

function createRoom(query, response) {
  var used
  if (game.getRoom(query.room)) {
    used = true
  } else {
    game.addRoom(query.room, query.player)
    used = false
  }

  var result = {
    used: used
  }
  console.warn(game.rooms);
  console.warn(query.room);
  response.write(JSON.stringify(result));
}

function joinRoom(query, response) {
  let notCreated
  let identity = "Player"
  let players_num = 0
  if (!game.getRoom(query.room)) {
    notCreated = true
  } else {
    notCreated = false

    if (game.isCreator(query.room, query.player)) {
      identity = "Creator"
    } else if (!game.getPlayer(query.room, query.player)) {
      game.addPlayer(query.room, query.player)
    }
    players_num = game.getPlayersNum(query.room)
  }

  const result = {
    task: "join",
    identity: identity,
    notCreated: notCreated,
    players_num: players_num
  };
  // console.log(result.notCreated);
  response.write(JSON.stringify(result));
  // connection.sendUTF(JSON.stringify(result))

}

// function dealCards(query, response) {
//   let used_cards = [];
//   for (let player of game.getPlayersByRoom(query.room)) {
//     player.cards = []; // 重置每个玩家的手牌
//     for (var i = 0; i < query.num; i++) {
//       let a;
//       do {
//         a = Math.floor(Math.random() * 54) + 1; // random number from 1 to 54
//       } while (a in used_cards);
//       used_cards.push(a);
//       player.cards.push(a);
//     }
//   }

// }

// function updatePlayersNum(room_name) {
//   // const room = game.getRoom(room_name)
//   // console.log(room.players);
//   const result = {
//     task: "updatePlayersNum",
//     num: game.getPlayersNum(room_name)
//   }
//   game.getPlayersByRoom(room_name).map(function (p) {
//     // console.log(p);
//     try {
//       p.connection.sendUTF(JSON.stringify(result))
//     } catch (e) {
//       console.warn(p.name);
//     }
//     // if (p.connection) {
//     //   p.connection.sendUTF(JSON.stringify(result))
//     // } else {
//     //   console.warn(p.name);
//     // }
//   })
// }

var server = http.createServer(function (request, response) {
  response.writeHead(200, {
    "Content-Type": "text/plain",
    "Access-Control-Allow-Origin": "*",
  });
  const query = url.parse(request.url, true).query;
  switch (query.task) {
    case "create":
      createRoom(query, response); break;
    case "join":
      joinRoom(query, response); break;
    // case "deal":
    //   dealCards(query, response); break;
  }
  response.end();
}).listen(6503, function () {
  console.log("--------------------------------------------------------------");
});


var wsServer = new WebSocketServer({
  httpServer: server
});

wsServer.on('request', function (request) {
  let connection = request.accept('echo-protocol', request.origin);

  // connection.sendUTF()

  // console.log((new Date()) + ' Connection accepted.');

  connection.on('message', function (message) {
    // console.log('Received Message: ' + message.utf8Data);
    // connection.sendUTF(message.utf8Data);
    var data = JSON.parse(message.utf8Data)
    switch (data.task) {
      case "connect":
        game.setPlayerConnection(data.room, data.player,connection)
        // game.getPlayer(data.room, data.player).setConnection(connection)
        // updatePlayersNum(data.room)
        // joinRoom(data, connection)
        break
      case "deal":
        game.dealCards(data.room, data.num)
        break
      case "pick":
        break
    }

  });

  connection.on('close', function (reasonCode, description) {
    game.exitPlayer(connection)
    // let room_name = game.exitPlayer(connection)
    // updatePlayersNum(room_name)
    // for(let room of game.getRooms()){
    //   for(let p of game.getPlayersByRoom(room.name))
    // }
    // console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');

  });
});


