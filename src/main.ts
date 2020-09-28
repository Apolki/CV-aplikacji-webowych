import { Board } from './Board';
import { Dice } from './Dice';
import { Game } from './Game';
import { Player } from './Player';
import { Teleport } from './Teleport';


 let teleports: Teleport[] = [
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
 let board = new Board(100, teleports);

let d4 = new Dice(1);
let d6 = new Dice(6);
let d12 = new Dice(6);

let on_click = () => { game.turn(); };

let players: Player[] = [
	new Player("Dan", 'red', 1, d4),
	new Player("Bot1", 'green', 1, d6),
	new Player("Bot2", 'blue', 1, d6),
];

 let game = new Game(board, players);

game.animation();

