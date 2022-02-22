class Person {
    constructor(name, cards = []) {
        this.name = name
        this.cards = cards
    }
    setConnection(connection) {
        this.connection = connection
    }
}

class Room {
    constructor(name, creator_name) {
        this.name = name
        this.creator = creator_name
        this.players = [new Person(creator_name)]
        this.table_cards = []
    }
}

module.exports = class Game {
    constructor() {
        this.rooms = []
    }

    addRoom(room_name, creator_name) {
        this.rooms.push(new Room(room_name, creator_name));
    }

    getRoom(room_name) {
        for (let room of this.rooms) {
            if (room.name = room_name) {
                return room
            }
        }
        return false

        // if (this.rooms[room_name]) {
        //     return this.rooms[room_name]
        // } else {
        //     return false
        // }
    }

    addPlayer(room_name, player_name) {
        let room = this.getRoom(room_name)
        let p = new Person(player_name)
        room.players.push(p)
    }

    getPlayer(room_name, player_name) {
        // 如果player存在，则返回该player，否则返回false
        try {
            for (let p of this.getPlayersByRoom(room_name)) {
                if (p.name == player_name) {
                    return p
                }
            }
            return false
        } catch (e) {
            console.warn(this.rooms);
        }
    }

    getPlayersByRoom(room_name) {
        let room = this.getRoom(room_name)
        if (room) {
            return room.players
        }
        return false
    }

    isCreator(room_name, player_name) {
        let room = this.getRoom(room_name)
        if (room.creator == player_name) {
            return true
        }
        return false
    }

    getPlayersNum(room_name) {
        let room = this.getRoom(room_name)
        if (room) {
            return room.players.length
        }
        return false
    }

    exitPlayer(connection) {
        for (let room of this.rooms) {
            for (let i in room.players) {
                if (Object.is(connection, room.players[i].connection)) {
                    room.players.splice(i, 1)
                    this.updatePlayersNum(room.name)
                    return
                }
            }
        }
    }

    dealCards(room_name, num) {
        // 给房间内的每个人发num张牌
        let used_cards = [];
        for (let player of this.getPlayersByRoom(room_name)) {
            player.cards = []; // 重置每个玩家的手牌
            for (var i = 0; i < num; i++) {
                let a;
                do {
                    a = Math.floor(Math.random() * 54) + 1; // random number from 1 to 54
                } while (a in used_cards);
                used_cards.push(a);
                player.cards.push(a);
            }

            const result = {
                task: "deal",
                cards: player.cards,
            };
            player.connection.sendUTF(JSON.stringify(result))
        }




    }

    setPlayerConnection(room_name, player_name,connection){
        this.getPlayer(room_name,player_name).setConnection(connection)
        this.updatePlayersNum(room_name)
    }

    updatePlayersNum(room_name) {
        // const room = this.getRoom(room_name)
        // console.log(room.players);
        const result = {
          task: "updatePlayersNum",
          num: this.getPlayersNum(room_name)
        }
        this.getPlayersByRoom(room_name).map(function (p) {
          // console.log(p);
          try {
            p.connection.sendUTF(JSON.stringify(result))
          } catch (e) {
            console.warn(p.name);
          }
        })
      }

}
