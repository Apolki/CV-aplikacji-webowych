export class Dice {
	constructor(public sides: number) { }

	roll(): number {
		return Math.floor(Math.random() * this.sides) + 1;
	}
}
