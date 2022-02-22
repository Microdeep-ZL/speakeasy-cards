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
        // this.creator = new Person(creator_name)
        // this.players = [this.creator]
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
        for(let room of this.rooms){
            if(room.name=room_name){
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
       try{ for (let p of this.getPlayersByRoom(room_name)) {
            if (p.name == player_name) {
                return p
            }
        }
        return false}catch(e){
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
                    room.players.splice(i,1)
                    return room.name
                }
            }
        }
    }

    // exitPlayer(room_name, player_name){
    //     let players=this.getPlayersByRoom(room_name)
    //     for(let i in players){
    //         if(players[i].name==player_name){
    //             players.splice(i,1)
    //         }
    //         break
    //     }

    // }

}
