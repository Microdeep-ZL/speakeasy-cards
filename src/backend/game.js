class Person {
    constructor(name, cards = []) {
        this.name = name
        this.cards = cards
    }
}

class Room {
    constructor(name, creator_name) {
        this.name = name
        this.creator = new Person(creator_name)
        this.players = [this.creator]
    }
    existPlayer(player_name){
        for(let p of this.players){
            if(p.name==player_name){
                return true
            }
        }
        return false
    }

    addPlayer(player_name){
        let p=new Person(player_name)
        this.players.push(p)
    }

    isCreator(player_name){
        if(this.creator.name==player_name){
            return true
        }
        return false
    }
}

module.exports= class Game {
    constructor() {
        this.rooms = {}
    }

    addRoom(room_name, creator_name) {
        this.rooms[room_name] = new Room(room_name, creator_name);
    }

    existRoom(room_name) {
        if (this.rooms[room_name]) {
            return true
        } else {
            return false
        }
    }
}

// var p = new Person("Haosheng")
// var room = new Room("group1", p)
// game = new Game()
// game.addRoom(room)
// console.log(game.existRoom("group1"))
