
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
		let a;
		a = Math.floor(Math.random() * this.sides) + 1;
		console.log (a);
		return a;
	}
}

class Player {
	constructor(public name: string, public color: string, public position: number, public dice: Dice){}
	make_move() {
		return this.position + this.dice.roll();
	}
}

interface Teleport {
	source: number;
	destination: number;
}
class Board {
	constructor(public size: number, public teleports: Teleport[]){}
	
	apply_teleports(position: number): number{
		

		for (let teleport of this.teleports){
			if (position == teleport.source){
				position = teleport.destination;
				break;
			}
		}
		return position;
	}
}


class Game {
	constructor(public board: Board, public players: Player[]){}
	draw(){
		console.log(this.players);
	}	
	turn() {
		for (let i=0; i <= 2; i++) {
			let new_position = this.players[i].make_move();
			new_position = this.board.apply_teleports(new_position);
			this.players[i].position = new_position;
			console.log(this.players[i].position);
		}
		this.draw();
	}
}



let teleports: Teleport [] = [
	{source: 1, destination: 10},
	{source: 2, destination: 20},
	{source: 3, destination: 30},
	{source: 4, destination: 40},
	{source: 5, destination: 50},
	{source: 6, destination: 60},
];
let d6 = new Dice(6);
let d12 = new Dice(12);
let players: Player[] = [
	new Player("Dan", "Red", 1, d12),
	new Player("Bot1","Green", 1, d6),
	new Player("Bot2","Blue", 1,d6),
];
let board = new Board (100, teleports);
let game = new Game(board, players);
game.turn();
game.turn();
game.turn();

