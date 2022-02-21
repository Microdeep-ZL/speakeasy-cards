const url = require("url");
const http = require("http");
const WebSocketServer = require('websocket').server
const Game = require("./game")

var game = new Game()
setInterval(
  function () {
    game = new Game()
  },
  24 * 60 * 60 * 1000
); //每隔24小时清除一次rooms.json内容

function createRoom(query, response) {
  var used
  if (game.existRoom(query.room)) {
    used = true
  } else {
    game.addRoom(query.room, query.player)
    used = false
  }

  var result = {
    used: used
  }
  response.write(JSON.stringify(result));
}

function joinRoom(query, response) {
  let notCreated = false
  let identity = "Player"
  if (!game.existRoom(query.room)) {
    notCreated = true
  } else {
    let room = game.rooms[query.room]
    if (room.isCreator(query.player)) {
      identity = "Creator"
    } else if (!room.existPlayer(query.player)) {
      room.addPlayer(query.player)
    }
  }

  let result = {
    identity: identity,
    notCreated: notCreated
  };
  response.write(JSON.stringify(result));
}

function dealCards(query, response) {
    let used_cards = [];
    for (let player of game.rooms[query.room].players) {
      player.cards = []; // 重置每个玩家的手牌
      for (var i = 0; i < query.num; i++) {
        let a;
        do {
          a = Math.floor(Math.random() * 54) + 1; // random number from 1 to 54
        } while (a in used_cards);
        used_cards.push(a);
        player.cards.push(a);
      }
    }

}


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
    case "deal":
      dealCards(query, response); break;
  }

  response.end();
}).listen(8081, function () {
  console.log("Server listening on http://localhost:8081");
});


// var wsServer = new WebSocketServer({
//   httpServer: server
// });


// wsServer.on('request', function (request) {
//   var connection = request.accept('echo-protocol', request.origin);
//   // console.log((new Date()) + ' Connection accepted.');

//   connection.on('message', function (message) {
//     console.log('Received Message: ' + message.utf8Data);
//     connection.sendUTF(message.utf8Data);

//   });

//   connection.on('close', function (reasonCode, description) {
//     console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
//   });
// });


