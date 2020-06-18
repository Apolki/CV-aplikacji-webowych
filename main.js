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
        return Math.floor(Math.random() * this.sides) + 1;
    };
    return Dice;
}());
var Player = /** @class */ (function () {
    function Player(name, color, position, dice) {
        this.name = name;
        this.color = color;
        this.position = position;
        this.dice = dice;
        this.rolls = new Array();
        this.render_position = position;
    }
    Player.prototype.make_move = function () {
        var roll = this.dice.roll();
        //console.log('rolled: ' + roll + ' position: ' + this.position);
        this.rolls.push(roll);
        return this.position += roll;
    };
    return Player;
}());
var Board = /** @class */ (function () {
    function Board(size, teleports) {
        this.size = size;
        this.teleports = teleports;
    }
    Board.prototype.apply_teleports = function (position) {
        // player can only jump once
        // todo find & apply teleport +-
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
        this.turn_number = 0;
        this.animation_step = 1000;
    }
    Game.prototype.draw = function () {
        // console.log(JSON.stringify(this.players));
        // console.log(this.players);
    };
    Game.prototype.render = function () {
        // console.log(this);
        var s = '.'.repeat(this.board.size);
        for (var _i = 0, _a = this.players; _i < _a.length; _i++) {
            var player = _a[_i];
            s = replaceCharAt(s, player.render_position - 1, player.color);
        }
        h(s);
    };
    Game.prototype.start_animation = function () {
        for (var _i = 0, _a = this.players; _i < _a.length; _i++) {
            var player = _a[_i];
            this.animate(player);
        }
    };
    Game.prototype.animate = function (player) {
        var _this = this;
        if (player.render_position < player.position) {
            player.render_position += 1;
            this.render();
            if (player.rolls[0] <= 1) {
                player.rolls.shift();
                window.alert('turn end');
            }
            else {
                player.rolls[0] -= 1;
            }
            console.log("rolls drop : " + player.name + '  ' + player.rolls);
            console.log(player.name + ' render position: ' + player.render_position);
        }
        setTimeout(function () { _this.animate(player); }, this.animation_step);
    };
    Game.prototype.turn = function () {
        for (var _i = 0, _a = this.players; _i < _a.length; _i++) {
            var player = _a[_i];
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
    };
    Game.prototype.play = function () {
        var _this = this;
        setTimeout(function () {
            _this.turn();
            _this.turn_number++;
            if (_this.turn_number < 10) {
                _this.play();
            }
        }, 100);
    };
    return Game;
}());
var teleports = [
    { source: 11, destination: 10 },
    { source: 21, destination: 20 },
    { source: 31, destination: 30 },
    { source: 41, destination: 40 },
    { source: 51, destination: 50 },
    { source: 61, destination: 60 },
];
var d6 = new Dice(6);
var d12 = new Dice(12);
var players = [
    new Player("Dan", '@', 1, d12),
    new Player("Bot1", 'B', 1, d6),
    new Player("Bot2", 'b', 1, d6),
];
var board = new Board(100, teleports);
var game = new Game(board, players);
game.start_animation();
// setTimeout(() => { game.render(); }, 0);
function h(s) {
    document.getElementById('h').innerHTML = s;
}
function replaceCharAt(s, i, c) {
    return s.substring(0, i) + c + s.substring(i + 1);
    ;
}
var on_click = function () { game.turn(); };
