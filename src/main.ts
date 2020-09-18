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
	constructor(
		public sides: number
		) { }

	roll(): number {
		return Math.floor(Math.random() * this.sides) + 1;
	}
}

class Player {
	rolls = new Array();
	n_steps = 1;
	teleporting = false;
	player_move : boolean;
	rolls_length : number;

	constructor(public name: string, public color: string, public position: number, public dice: Dice) {}
	make_move() {
		let roll = this.dice.roll();
		//console.log('rolled: ' + roll + ' position: ' + this.position);
		this.rolls.push(roll); 
		this.rolls_length = this.rolls.length;
	}
	
	current_turn(): boolean{
		if (this.rolls.length == 0){
			return false;
		}
		if(this.rolls_length !== this.rolls.length){
			
			this.rolls_length = this.rolls.length
			return false;
		}
		else{
			return true;
		}

		
	}
	


	step(board: Board): boolean {
		console.log('step');
		if (this.teleporting) {
			this.position = board.apply_teleports(this.position);
			this.teleporting = false;
			console.log(this.name + ' was teleported to ' + this.position);
			return true;
		}
		if (this.current_turn()) {
			console.log("rolls drop : " + this.name + '  ' +  this.rolls);

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

interface Teleport {
	source: number;
	destination: number;
}
class Board {
	constructor(public size: number, public teleports: Teleport[]) {}
	
	apply_teleports(position: number): number {
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

	on_teleport(position: number): boolean {
		for (let teleport of this.teleports) {
			if (position == teleport.source) {
				return true;
			}
		}
		return false;	
	}
}

class Game {
	
	
	turn_number: number;
	player_number: number;
	animation_step: number;
	animation_player: Player;
	animation_started : boolean;
	width: number;
	height: number;
	padding: number;
	svgns: string;
	
	prcnt : number;
	
	constructor(public board: Board, public players: Player[]) {
		this.turn_number = 0;
		this.animation_step = 1000;
		this.player_number = 0;
		this.svgns = "http://www.w3.org/2000/svg";
		this.width = 40;
		this.height = 40;
		this.padding = 10;
		this.prcnt = 0;
		
	}
	draw_board() {
		
		for (var x = 0; x < 10; x ++) {
			for (var y = 0; y < 10; y ++) {
				var rect = document.createElementNS(this.svgns, 'rect');
				var x_str: string = ((this.width+this.padding)*x).toString();
				var y_str: string = ((this.height+this.padding)*y).toString();
				rect.setAttributeNS(null, 'x', x_str);
				rect.setAttributeNS(null, 'y', y_str);
				rect.setAttributeNS(null, 'height', this.height.toString());
				rect.setAttributeNS(null, 'width', this.width.toString());
				rect.setAttributeNS(null, 'fill', 'grey');
				document.getElementById('svgOne').appendChild(rect);
	
			}
		}
	
	}
draw_line(x1: number, y1: number, x2: number, y2: number){
	var newLine = document.createElementNS(this.svgns, 'line');
	let lx1 = x1; 
	let lx2 = x2; 
	let ly1 = y1; 
	let ly2 = y2;
	let startLineX = ((this.width+this.padding)*lx1 + this.width/2).toString()
	let startLineY = ((this.height+this.padding)*ly1 + this.height/2).toString()
	let endLineX = ((this.width+this.padding)*lx2 + this.width/2).toString()
	let endLineY = ((this.height+this.padding)*ly2 + this.height/2).toString()

	newLine.setAttributeNS(null, 'x1', startLineX);
	newLine.setAttributeNS(null, 'y1',startLineY);
	newLine.setAttributeNS(null, 'x2',endLineX);
	newLine.setAttributeNS(null, 'y2', endLineY);
	newLine.setAttributeNS(null, "stroke", "red")
	document.getElementById("svgOne").appendChild(newLine);
}
draw_player(player: Player){
	var figure = document.createElementNS(this.svgns, 'circle');
	let cx = (player.position - 1) % 10;
	let cy = Math.floor((player.position - 1) / 10)
	let r = 10;
	let playerCenterX = ((this.width+this.padding)*cx + this.width/2).toString();
	let playerCenterY = ((this.height+this.padding)*cy + this.height/2).toString();

	figure.setAttributeNS(null, "cx", playerCenterX);
	figure.setAttributeNS(null, "cy", playerCenterY );
	figure.setAttributeNS(null, "r", r.toString() );
	figure.setAttributeNS(null, "fill", player.color);

	document.getElementById("svgOne").appendChild(figure);
}


	render() {
		// console.log(this);
		// var s = '.'.repeat(this.board.size);
		// for (let teleport of this.board.teleports) {
		// 	s = replaceCharAt(s, teleport.source      - 1, '>');
		// 	s = replaceCharAt(s, teleport.destination - 1, '<');
		// }
		// for (let player of this.players) {
		// 	s = replaceCharAt(s, player.position - 1, player.color);
		// }
		// h(s);
		game.draw_board();
		for(let teleport of teleports){
			let x1 = (teleport.source - 1) % 10;
			let y1 = Math.floor((teleport.source - 1) / 10)
			let x2 = (teleport.destination - 1) % 10;
			let y2 = Math.floor((teleport.destination  - 1) / 10)
			game.draw_line(x1, y1, x2, y2);
		}
		for (let player of this.players) {
				game.draw_player(player);
			}
		
		

	}
	animation() {
		// пытаемся походить
		// если мы можем то ходим
		// 	ход рендерится
		// если нет 
		// 	извенение индекса ходящего игрока
		// через 1 секунду повторяем анимейшон
		let current_player = this.players[this.player_number%this.players.length]
		{
			if (current_player.step(this.board)) {
				this.render();
				this.animation_started = true;
			}
			else if(this.animation_started){
				this.player_number += 1
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


let teleports: Teleport [] = [
	{source: 11, destination: 10},
	{source: 12, destination: 1},
	{source: 13, destination: 2},
	{source: 14, destination: 3},
	{source: 21, destination: 20},
	{source: 31, destination: 30},
	{source: 41, destination: 40},
	{source: 51, destination: 50},
	{source: 61, destination: 60},
];
let d4 = new Dice(4);
let d6 = new Dice(6);
let d12 = new Dice(12);
let players: Player[] = [
	new Player("Dan", 'red', 1, d4),
	 new Player("Bot1",'green', 1, d6),
	 new Player("Bot2",'blue', 1, d6),
];
let board = new Board (100, teleports);
let game = new Game(board, players);
game.animation();

// setTimeout(() => { game.render(); }, 0);

function h(s: string) {
	document.getElementById('h').innerHTML = s;
}


function replaceCharAt(s: string, i: number, c: string): string {
	return s.substring(0, i) + c + s.substring(i + 1);;
}

let on_click = () => { game.turn(); };

// var draw = SVG().addTo('body').size(500, 500);
// var field = draw.rect(50, 50).fill('#f56').move(0, 0);






var draw = SVG().addTo('body').size(500, 500);
draw.rect(50, 50).fill('#000').animate().move(100, 100).attr({ fill: '#f06' });
draw.circle(10).move(0, 0,).animate().move(0, 100);