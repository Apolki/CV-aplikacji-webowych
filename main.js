// roll dice to move
// game board (1-100 positions)
// teleports (snakes and ladders)
// multiplayer (1 player + bots)
// draw a board
// 1d6
var Dice = /** @class */ (function () {
    function Dice(sides) {
        this.sides = sides;
    }
    Dice.prototype.roll = function () {
        var a;
        a = Math.floor(Math.random() * this.sides) + 1;
        console.log(a);
        return a;
    };
    return Dice;
}());
var Player = /** @class */ (function () {
    function Player(name, color, position, dice) {
        this.name = name;
        this.color = color;
        this.position = position;
        this.dice = dice;
    }
    Player.prototype.make_move = function () {
        return this.position + this.dice.roll();
    };
    return Player;
}());
var Board = /** @class */ (function () {
    function Board(size, teleports) {
        this.size = size;
        this.teleports = teleports;
    }
    Board.prototype.apply_teleports = function (position) {
        for (var _i = 0, _a = this.teleports; _i < _a.length; _i++) {
            var teleport = _a[_i];
            if (position == teleport.source) {
                position = teleport.destination;
                break;
            }
        }
        return position;
    };
    return Board;
}());
var Game = /** @class */ (function () {
    function Game(board, players) {
        this.board = board;
        this.players = players;
    }
    Game.prototype.draw = function () {
        console.log(this.players);
    };
    Game.prototype.turn = function () {
        for (var i = 0; i <= 2; i++) {
            var new_position = this.players[i].make_move();
            new_position = this.board.apply_teleports(new_position);
            this.players[i].position = new_position;
            console.log(this.players[i].position);
        }
        this.draw();
    };
    return Game;
}());
var teleports = [
    { source: 1, destination: 10 },
    { source: 2, destination: 20 },
    { source: 3, destination: 30 },
    { source: 4, destination: 40 },
    { source: 5, destination: 50 },
    { source: 6, destination: 60 },
];
var d6 = new Dice(6);
var d12 = new Dice(12);
var players = [
    new Player("Dan", "Red", 1, d12),
    new Player("Bot1", "Green", 1, d6),
    new Player("Bot2", "Blue", 1, d6),
];
var board = new Board(100, teleports);
var game = new Game(board, players);
game.turn();
game.turn();
game.turn();
