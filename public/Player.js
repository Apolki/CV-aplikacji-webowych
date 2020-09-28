export class Player {
    constructor(name, color, position, dice) {
        this.name = name;
        this.color = color;
        this.position = position;
        this.dice = dice;
        this.rolls = new Array();
        this.roled = new Array();
        this.n_steps = 1;
        this.teleporting = false;
    }
    make_move() {
        let roll = this.dice.roll();
        this.roled.push(roll);
        //console.log('rolled: ' + roll + ' position: ' + this.position);
        this.rolls.push(roll);
        this.rolls_length = this.rolls.length;
    }
    animate_dice(historyDrops, translate_x, translate_y) {
        //this.draw_dice();
        let rect = historyDrops.rect(100, 100).move(0, 400).fill(this.color);
        let circle1 = historyDrops.circle(10).move(45, 445).animate();
        let circle2 = historyDrops.circle(10).move(45, 445).animate();
        let circle3 = historyDrops.circle(10).move(45, 445).animate();
        let circle4 = historyDrops.circle(10).move(45, 445).animate();
        let circle5 = historyDrops.circle(10).move(45, 445).animate();
        let circle6 = historyDrops.circle(10).move(45, 445).animate();
        let circles = [circle1, circle2, circle3, circle4, circle5, circle6];
        let animate_dice_1 = () => {
            circles[0] = circles[0].animate(100, 0).move(45, 445);
            circles[1] = circles[1].animate(100, 0).move(45, 445);
            circles[2] = circles[2].animate(100, 0).move(45, 445);
            circles[3] = circles[3].animate(100, 0).move(45, 445);
            circles[4] = circles[4].animate(100, 0).move(45, 445);
            circles[5] = circles[5].animate(100, 0).move(45, 445);
        };
        let animate_dice_2 = () => {
            circles[0] = circles[0].animate(100, 0).move(20, 420);
            circles[1] = circles[1].animate(100, 0).move(20, 420);
            circles[2] = circles[2].animate(100, 0).move(20, 420);
            circles[3] = circles[3].animate(100, 0).move(70, 470);
            circles[4] = circles[4].animate(100, 0).move(70, 470);
            circles[5] = circles[5].animate(100, 0).move(70, 470);
        };
        let animate_dice_3 = () => {
            circles[0] = circles[0].animate(100, 0).move(45, 445);
            circles[1] = circles[1].animate(100, 0).move(45, 445);
            circles[2] = circles[2].animate(100, 0).move(20, 420);
            circles[3] = circles[3].animate(100, 0).move(70, 470);
            circles[4] = circles[4].animate(100, 0).move(45, 445);
            circles[5] = circles[5].animate(100, 0).move(45, 445);
        };
        let animate_dice_4 = () => {
            circles[0] = circles[0].animate(100, 0).move(70, 420);
            circles[1] = circles[1].animate(100, 0).move(70, 420);
            circles[2] = circles[2].animate(100, 0).move(20, 420);
            circles[3] = circles[3].animate(100, 0).move(70, 470);
            circles[4] = circles[4].animate(100, 0).move(20, 470);
            circles[5] = circles[5].animate(100, 0).move(20, 470);
        };
        let animate_dice_5 = () => {
            circles[0] = circles[0].animate(100, 0).move(45, 445);
            circles[1] = circles[1].animate(100, 0).move(70, 420);
            circles[2] = circles[2].animate(100, 0).move(20, 420);
            circles[3] = circles[3].animate(100, 0).move(70, 470);
            circles[4] = circles[4].animate(100, 0).move(20, 470);
            circles[5] = circles[5].animate(100, 0).move(45, 445);
        };
        let animate_dice_6 = () => {
            circles[0] = circles[0].animate(100, 0).move(20, 445);
            circles[1] = circles[1].animate(100, 0).move(70, 420);
            circles[2] = circles[2].animate(100, 0).move(20, 420);
            circles[3] = circles[3].animate(100, 0).move(70, 470);
            circles[4] = circles[4].animate(100, 0).move(20, 470);
            circles[5] = circles[5].animate(100, 0).move(70, 445);
        };
        let animate_dice_x = [animate_dice_1, animate_dice_2, animate_dice_3, animate_dice_4, animate_dice_5, animate_dice_6];
        for (let x = 0; x < 5; x++) {
            let i = Math.floor(Math.random() * animate_dice_x.length);
            animate_dice_x[i]();
        }
        animate_dice_x[this.roled[0] - 1]();
        let group = historyDrops.group();
        group.add(rect);
        circles.forEach(circle => {
            group.add(circle.element());
        });
        group.animate({ duration: 1000, delay: 1500 }).transform({ originX: 100, originY: 100, scale: 0.5, translateX: translate_x, translateY: translate_y });
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
                this.roled.shift();
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
