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
  // console.warn(query);
  var used
  if (game.getRoom(query.room)) {
    used = true // inhibit create room
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
  response.write(JSON.stringify(result));

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
  
  connection.on('message', function (message) {
    if(message.utf8Data==''){// 心跳回应
      return
    }
    var data = JSON.parse(message.utf8Data)
    console.log("Received message\n",data);
    switch (data.task) {
      case "connect":
        game.setPlayerConnection(data.room, data.player,connection)
        break
      case "deal":
        game.dealCards(data.room, data.num)
        break
      case "draw":
        game.drawCards(data.room, data.player, data.view, data.num)
        break
      case "pick":
        game.pick(data.room, data.player, data.card_index)
        break
        case "discard":
        game.discardCard(data.room, data.player, data.view, data.card_index)
        break
    }

  });

  connection.on('close', function (reasonCode, description) {
    // game.exitPlayer(connection)
    console.log('Disconnected\n', game.whoDisconnected(connection));

  });
});


