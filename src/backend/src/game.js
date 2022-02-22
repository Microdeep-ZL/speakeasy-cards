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


        this.deck = []
        for (let i = 1; i <= 54; i++) {
            this.deck.push(i)
        }
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

    getDeckByRoom(room_name) {
        let room = this.getRoom(room_name)
        if (room) {
            return room.deck
        }
        return false
    }

    getTableCards(room_name) {
        return this.getRoom(room_name).table_cards
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

    // resetDeck(room_name) {
    //     // todo 不应该粗暴地收回和重置deck
    //     // 收回每位玩家的手牌，重置deck
    //     for (let player of this.getPlayersByRoom(room_name)) {
    //         player.cards = [];
    //     }

    //     let deck = this.getDeckByRoom(room_name)
    //     deck.length = 0
    //     for (let i = 1; i <= 54; i++) {
    //         deck.push(i)
    //     }

    // }

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

        // let deck = this.getDeckByRoom(room_name)
        // deck = [];
        for (let player of this.getPlayersByRoom(room_name)) {
            this.drawCards(room_name, player.name, "hand", num)

            const result = {
                task: "draw",
                view: "hand",
                cards: player.cards,
            };
            player.connection.sendUTF(JSON.stringify(result))
        }




        // player.cards = []; // 重置每个玩家的手牌和deck

        // for (var i = 0; i < num; i++) {
        //     let a;
        //     do {
        //         // random number from 1 to the number of deck cards 
        //     } while (a in used_cards);
        //     let a = Math.floor(Math.random() * deck.length) + 1;
        //     player.cards.push();
        // }




    }

    drawCards(room_name, player_name, view, num) {
        let deck = this.getDeckByRoom(room_name)
        let table = this.getTableCards(room_name)
        let player = this.getPlayer(room_name, player_name)

        for (var i = 0; i < num; i++) {
            // random number from 0 to (the number of deck cards -1) 
            let a = Math.floor(Math.random() * deck.length);
            let card = deck.splice(a, 1)
            if (view == "table") {
                table.push(card)

            } else if (view == "hand") {
                player.cards.push(card);

            }
        }

        const result = {
            task: "draw",
            view: view,
            cards:[]
        };
        if (view == "table") {
            result.cards = table
            for (let player of this.getPlayersByRoom(room_name)) {
                player.connection.sendUTF(JSON.stringify(result))
            }
        } else if (view == "hand") {
            result.cards = player.cards
            player.connection.sendUTF(JSON.stringify(result))
        }
    }

    setPlayerConnection(room_name, player_name, connection) {
        this.getPlayer(room_name, player_name).setConnection(connection)
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
