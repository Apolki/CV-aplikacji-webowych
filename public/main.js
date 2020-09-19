import { SVG } from '@svgdotjs/svg.js';
// roll dice to move
// game board (1-100 positions)
// teleports (snakes and ladders)
// multiplayer (1 player + bots)
// draw a board
// 1d6
// import { SVG } from '@svgdotjs/svg.js'
//var { SVG } = require('@svgdotjs/svg.js');
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
        this.circle = draw.circle(30).move(0, 0).fill({ color: this.color }).click(() => { game.turn(); });
    }
    make_move() {
        let roll = this.dice.roll();
        //console.log('rolled: ' + roll + ' position: ' + this.position);
        this.rolls.push(roll);
        this.rolls_length = this.rolls.length;
    }
    current_turn() {
        if (this.rolls.length == 0) {
            return false;
        }
        if (this.rolls_length !== this.rolls.length) {
            this.rolls_length = this.rolls.length;
            return false;
        }
        else {
            return true;
        }
    }
    step(board) {
        console.log('step');
        if (this.teleporting) {
            this.position = board.apply_teleports(this.position);
            this.teleporting = false;
            console.log(this.name + ' was teleported to ' + this.position);
            return true;
        }
        if (this.current_turn()) {
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
        this.width = 40;
        this.height = 40;
        this.padding = 10;
        this.render();
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
    draw_board() {
        for (var x = 0; x < 10; x++) {
            for (var y = 0; y < 10; y++) {
                draw.rect(this.height, this.width).move(((this.width + this.padding) * x), (this.height + this.padding) * y).fill({ color: "grey" });
            }
        }
    }
    draw_line(x1, y1, x2, y2) {
        let lx1 = x1;
        let lx2 = x2;
        let ly1 = y1;
        let ly2 = y2;
        draw.line(((this.width + this.padding) * lx1 + this.width / 2), ((this.height + this.padding) * ly1 + this.height / 2), ((this.width + this.padding) * lx2 + this.width / 2), ((this.height + this.padding) * ly2 + this.height / 2)).stroke({ color: '#f06' });
    }
    render() {
        this.draw_board();
        for (let teleport of teleports) {
            let x1 = (teleport.source - 1) % 10;
            let y1 = Math.floor((teleport.source - 1) / 10);
            let x2 = (teleport.destination - 1) % 10;
            let y2 = Math.floor((teleport.destination - 1) / 10);
            this.draw_line(x1, y1, x2, y2);
        }
    }
}
class Game {
    constructor(board, players) {
        this.board = board;
        this.players = players;
        this.turn_number = 0;
        this.animation_step = 1000;
        this.player_number = 0;
    }
    player_move(player) {
        // var figure = document.createElementNS(this.svgns, 'circle');
        let cx = (player.position - 1) % 10;
        let cy = Math.floor((player.position - 1) / 10);
        let playerCenterY = ((board.height + board.padding) * cy + board.height / 4);
        let playerCenterX = ((board.width + board.padding) * cx + board.width / 4);
        player.circle.animate().move(playerCenterX, playerCenterY);
        // figure.setAttributeNS(null, "cx", playerCenterX);
        // figure.setAttributeNS(null, "cy", playerCenterY );
        // figure.setAttributeNS(null, "r", r.toString() );
        // figure.setAttributeNS(null, "fill", player.color);
        // document.getElementById("svgOne").appendChild(figure);
    }
    animation() {
        // пытаемся походить
        // если мы можем то ходим
        // 	ход рендерится
        // если нет 
        // 	извенение индекса ходящего игрока
        // через 1 секунду повторяем анимейшон
        let current_player = this.players[this.player_number % this.players.length];
        {
            if (current_player.step(this.board)) {
                this.player_move(current_player);
                //this.render();
                this.animation_started = true;
            }
            else if (this.animation_started) {
                this.player_number += 1;
                this.animation_started = false;
            }
        }
        console.log("current player: " + current_player.name);
        setTimeout(() => { this.animation(); }, this.animation_step);
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
var draw = SVG().addTo('body').size(500, 500);
let board = new Board(100, teleports);
let d4 = new Dice(4);
let d6 = new Dice(6);
let d12 = new Dice(12);
let players = [
    new Player("Dan", 'red', 1, d4),
    new Player("Bot1", 'green', 1, d6),
    new Player("Bot2", 'blue', 1, d6),
];
let game = new Game(board, players);
game.animation();
// setTimeout(() => { game.render(); }, 0);
// function h(s: string) {
// 	document.getElementById('h').innerHTML = s;
// }
// function replaceCharAt(s: string, i: number, c: string): string {
// 	return s.substring(0, i) + c + s.substring(i + 1);;
// }
let on_click = () => { game.turn(); };
var historyDrops = SVG().addTo('body').size(500, 500);
// var draw = SVG().addTo('body').size(500, 500);
// var field = draw.rect(50, 50).fill('#f56').move(0, 0);
// draw.rect(50, 50).fill('#000').animate().move(100, 100).attr({ fill: '#f06' });
// draw.circle(10).move(0, 0,).animate().move(0, 100);
