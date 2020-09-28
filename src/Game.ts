import { SVG, Svg } from '@svgdotjs/svg.js';
import { Board } from './Board';
import { Player } from './Player';

export class Game {

    
	turn_number: number;
	player_number: number;
	animation_step: number;
	animation_player: Player;
	animation_started: boolean;
	player_animation_started: boolean;
	translate_x: number;
	translate_y: number;
    counter: number;
    draw: Svg;
    historyDrops: Svg;

	constructor(public board: Board, public players: Player[]) {
		this.turn_number = 0;
		this.animation_step = 1000;
		this.player_number = 0;
		this.player_animation_started = false;
		this.translate_x = 400;
		this.translate_y = -400;
		this.counter = 0;

        this.draw = SVG().addTo('body').size(500, 500);
        this.historyDrops = SVG().addTo('body').size(500, 500)
        board.render(this.draw);

        for(let player of players){
            player.circle = this.draw.circle(30).move(0, 0).fill({ color: player.color }).click(() => {this.turn()});
        }
	}


	player_move(player: Player) {
		let cx = (player.position - 1) % 10;
		let cy = Math.floor((player.position - 1) / 10);
		let playerCenterY = ((this.board.height + this.board.padding) * cy + this.board.height / 4);
		let playerCenterX = ((this.board.width + this.board.padding) * cx + this.board.width / 4);
		player.circle.animate().move(playerCenterX, playerCenterY);
	}




	animation() {
		let current_player = this.players[this.player_number % this.players.length];
		if (current_player.roled.length > 0 && current_player.roled[0] == current_player.rolls[0]) {
			if (this.player_animation_started == false) {
                current_player.animate_dice(this.historyDrops, this.translate_x, this.translate_y);
                if (this.counter == 8) {
                    this.translate_x = 400;
                    this.translate_y += 50;
                    this.counter = 0;
                }
                else {
                    this.translate_x -= 50;
                    this.counter++;
                }
        
				this.player_animation_started = true;
				setTimeout(() => { this.animation(); }, this.animation_step);
				return;
			}
			this.player_animation_started = false;
		}
		if (current_player.step(this.board)) {
			this.player_move(current_player);
			//this.render();
			this.animation_started = true;
		}
		else if (this.animation_started) {
			this.player_number += 1;
			this.animation_started = false;
		}




		console.log("current player: " + current_player.name);

		setTimeout(() => { this.animation(); }, this.animation_step);
		return;
	}
	turn() {
		for (let player of this.players) {
			player.make_move();
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
