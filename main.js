// roll dice to move
// game board (1-100 positions)
// teleports (snakes and ladders)
// multiplayer (1 player + bots)
// draw a board
// 1d6
class Dice {
    constructor(sides) {
        this.sides = sides;
    }
    roll() {
        return Math.floor(Math.random() * this.sides) + 1;
    }
}
class Player {
    constructor(name, color, position, dice) {
        this.name = name;
        this.color = color;
        this.position = position;
        this.dice = dice;
        this.rolls = new Array();
        this.n_steps = 1;
        this.teleporting = false;
    }
    make_move() {
        let roll = this.dice.roll();
        //console.log('rolled: ' + roll + ' position: ' + this.position);
        this.rolls.push(roll);
    }
    step(board) {
        console.log('step');
        if (this.teleporting) {
            this.position = board.apply_teleports(this.position);
            this.teleporting = false;
            console.log(this.name + ' was teleported to ' + this.position);
            return true;
        }
        if (this.rolls.length > 0) {
            console.log("rolls drop : " + this.name + '  ' + this.rolls);
            this.position += this.n_steps;
            this.rolls[0] -= 1;
            if (this.rolls[0] == 0) {
                this.rolls.shift();
                if (board.on_teleport(this.position)) {
                    this.teleporting = true;
                }
            }
            console.log(this.name + ' position: ' + this.position);
            return true;
        }
        return false;
    }
}
class Board {
    constructor(size, teleports) {
        this.size = size;
        this.teleports = teleports;
    }
    apply_teleports(position) {
        // player can only jump once
        // todo find & apply teleport +-
        for (let teleport of this.teleports) {
            if (position == teleport.source) {
                position = teleport.destination;
                break;
            }
        }
        return position;
    }
    on_teleport(position) {
        for (let teleport of this.teleports) {
            if (position == teleport.source) {
                return true;
            }
        }
        return false;
    }
}
class Game {
    constructor(board, players) {
        this.board = board;
        this.players = players;
        this.turn_number = 0;
        this.animation_step = 1000;
    }
    draw() {
        // console.log(JSON.stringify(this.players));
        // console.log(this.players);
    }
    render() {
        // console.log(this);
        var s = '.'.repeat(this.board.size);
        for (let teleport of this.board.teleports) {
            s = replaceCharAt(s, teleport.source - 1, '>');
            s = replaceCharAt(s, teleport.destination - 1, '<');
        }
        for (let player of this.players) {
            s = replaceCharAt(s, player.position - 1, player.color);
        }
        h(s);
    }
    animation() {
        for (let player of this.players) {
            if (player.step(this.board)) {
                this.render();
            }
        }
        // setTimeout(() => { this.animation(); }, this.animation_step);
    }
    turn() {
        for (let player of this.players) {
            // get new_position
            player.make_move();
            // console.log('#' + this.turn_number + ' new position: ' + new_position);
            // animate player moving from old_position to new_position
            // this.animate(player, this.turn_number);
            // animate player teleporting to new_position
            // player.position = this.board.apply_teleports(new_position);
            // this.render();
        }
        this.turn_number++;
    }
    play() {
        setTimeout(() => {
            this.turn();
            this.turn_number++;
            if (this.turn_number < 10) {
                this.play();
            }
        }, 100);
    }
}
let teleports = [
    { source: 11, destination: 10 },
    { source: 12, destination: 1 },
    { source: 13, destination: 2 },
    { source: 14, destination: 3 },
    { source: 21, destination: 20 },
    { source: 31, destination: 30 },
    { source: 41, destination: 40 },
    { source: 51, destination: 50 },
    { source: 61, destination: 60 },
];
let d4 = new Dice(4);
let d6 = new Dice(6);
let d12 = new Dice(12);
let players = [
    new Player("Dan", '@', 1, d4),
];
let board = new Board(100, teleports);
let game = new Game(board, players);
game.animation();
// setTimeout(() => { game.render(); }, 0);
function h(s) {
    document.getElementById('h').innerHTML = s;
}
function replaceCharAt(s, i, c) {
    return s.substring(0, i) + c + s.substring(i + 1);
    ;
}
let on_click = () => { game.turn(); };
