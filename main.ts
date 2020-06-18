
// roll dice to move
// game board (1-100 positions)
// teleports (snakes and ladders)
// multiplayer (1 player + bots)
// draw a board


// 1d6
class Dice {
	constructor(
		public sides: number
		) { }

	roll(): number {
		return Math.floor(Math.random() * this.sides) + 1;
	}
}

class Player {
	render_position: number;
	rolls = new Array(); 
	constructor(public name: string, public color: string, public position: number, public dice: Dice) {
		this.render_position = position;
	}
	make_move() {
		let roll = this.dice.roll();
		
		//console.log('rolled: ' + roll + ' position: ' + this.position);
		this.rolls.push(roll); 
		return this.position += roll;
		
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
}

class Game {
	turn_number: number;
	animation_step: number;
	constructor(public board: Board, public players: Player[]) {
		this.turn_number = 0;
		this.animation_step = 1000;
	}
	draw(){
		// console.log(JSON.stringify(this.players));
		// console.log(this.players);
		
	}
	render() {
		// console.log(this);
		var s = '.'.repeat(this.board.size);
		for (let player of this.players) {
			s = replaceCharAt(s, player.render_position - 1, player.color);
		}
		h(s);
	}
	start_animation() {
		for (let player of this.players) {
			this.animate(player);
		}
	}
	animate(player: Player) {
		if (player.render_position < player.position) {
			player.render_position += 1;
			this.render();
			if(player.rolls[0] <= 1){
				player.rolls.shift();
				window.alert('turn end');				
			}
			else{
				player.rolls[0] -= 1;
			}
			console.log("rolls drop : " + player.name + '  ' +  player.rolls);
			console.log(player.name + ' render position: ' + player.render_position);
		}
		setTimeout(() => { this.animate(player); }, this.animation_step);
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
	{source: 21, destination: 20},
	{source: 31, destination: 30},
	{source: 41, destination: 40},
	{source: 51, destination: 50},
	{source: 61, destination: 60},
];
let d6 = new Dice(6);
let d12 = new Dice(12);
let players: Player[] = [
	new Player("Dan", '@', 1, d12),
	new Player("Bot1",'B', 1, d6),
	new Player("Bot2",'b', 1, d6),
];
let board = new Board (100, teleports);
let game = new Game(board, players);
game.start_animation();
// setTimeout(() => { game.render(); }, 0);

function h(s: string) {
	document.getElementById('h').innerHTML = s;
}


function replaceCharAt(s: string, i: number, c: string): string {
	return s.substring(0, i) + c + s.substring(i + 1);;
}

let on_click = () => { game.turn(); };
 






