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
            if (room.name == room_name) {
                return room
            }
        }
        return false
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
            console.error(this.rooms);
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

    pick(room_name, player_name, card_index) {
        let table = this.getTableCards(room_name)
        let player = this.getPlayer(room_name, player_name)
        player.cards.push(table.splice(card_index, 1))

        let result = {
            task: "draw",
            view: "hand",
            cards: player.cards,
        };
        player.connection.sendUTF(JSON.stringify(result))

        this.updateTableCards(room_name)

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

    whoDisconnected(connection) {
        for (let room of this.rooms) {
            for (let i in room.players) {
                if (Object.is(connection, room.players[i].connection)) {
                    // room.players.splice(i, 1)
                    // this.updatePlayersNum(room.name)
                    const info = {
                        room: room.name,
                        player: room.players[i].name
                    }
                    return info
                }
            }
        }
        return "unknown player"

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
    }

    drawCards(room_name, player_name, view, num) {
        switch (view) {
            case "table":
                let table = this.getTableCards(room_name)
                this.getNewCards(room_name, num).map(function (card) {
                    table.push(card)
                })
                this.updateTableCards(room_name);
                break

            case "hand":
                let player = this.getPlayer(room_name, player_name)
                this.getNewCards(room_name, num).map(function (card) {
                    player.cards.push(card)
                })
                const result = {
                    task: "draw",
                    view: "hand",
                    cards: player.cards
                }
                player.connection.sendUTF(JSON.stringify(result))
                break

        }
    }

    getNewCards(room_name, num) {
        let cards = []
        const deck = this.getDeckByRoom(room_name)
        // todo 异常处理，如果deck里的牌用完了，要有提示
        for (var i = 0; i < num; i++) {
            // random number from 0 to (the number of deck cards -1) 
            let a = Math.floor(Math.random() * deck.length);
            cards.push(deck.splice(a, 1))
        }
        return cards

    }

    updatePlayerCards(room_name, player_name) {
        const player = this.getPlayer(room_name, player_name)
        let result = {
            task: "draw",
            view: "hand",
            cards: player.cards
        };
        player.connection.sendUTF(JSON.stringify(result))

        result = {
            task: "draw",
            view: "table",
            cards: this.getTableCards(room_name)
        };
        player.connection.sendUTF(JSON.stringify(result))
    }

    setPlayerConnection(room_name, player_name, connection) {
        // 异常处理，有时候服务器重启，而之前的断线重连，就会不存在这个房间
        try {
            const player = this.getPlayer(room_name, player_name)
            player.setConnection(connection)
            // const result={
            //     task:"updatePlayers",
            //     players: this.getPlayersByRoom(room_name).map(function(player){return player.name})
            // }
            
            // player.connection.sendUTF(JSON.stringify(result))
            this.updatePlayers(room_name)
            this.updatePlayerCards(room_name, player_name)
            return true
        } catch (e) {
            console.error(e);
            console.error("找不到该房间及用户！");
            console.error("传入参数：", room_name, player_name);
            console.error("rooms\n", this.rooms);
            return false

        }

    }

    updatePlayers(room_name) {
        // 只能传player.name的数组，不能直接传players
        // 因为每个player含有connection的属性，循环引用是不能转为json字符串的
        const result = {
            task: "updatePlayers",
            players: this.getPlayersByRoom(room_name).map(function (player) { return player.name })
        }

        this.getPlayersByRoom(room_name).map(function (p) {
            try {
                p.connection.sendUTF(JSON.stringify(result))
            } catch (e) {
                console.error("Failed to send information to user:", p.name);
            }
        })
    }

    discardCard(room_name, player_name, view, card_index) {
        switch (view) {
            case "table":
                const table = this.getTableCards(room_name)
                table.splice(card_index, 1)
                this.updateTableCards(room_name)
                break

            case "hand":
                const player = this.getPlayer(room_name, player_name)
                player.cards.splice(card_index, 1)

                const result = {
                    task: "draw",
                    view: "hand",
                    cards: player.cards
                };
                player.connection.sendUTF(JSON.stringify(result))
                break
        }
    }

    updateTableCards(room_name) {
        const result = {
            task: "draw",
            view: "table",
            cards: this.getTableCards(room_name)
        };
        for (let player of this.getPlayersByRoom(room_name)) {
            player.connection.sendUTF(JSON.stringify(result))
        }

    }

    sendCard(room_name, player_name, player_to, card_index){
        const p1=this.getPlayer(room_name,player_name)
        const p2=this.getPlayer(room_name,player_to)
        p2.cards.push(p1.cards.splice(card_index,1))

        const result = {
            task: "draw",
            view: "hand",
        };

        result.cards=p1.cards
        p1.connection.sendUTF(JSON.stringify(result))
        result.cards=p2.cards
        p2.connection.sendUTF(JSON.stringify(result))

    }

}
