class Play extends Phaser.Scene {
    constructor() {
        super("gameScene");

        this.SPEED = 4;
        this.speed = 4;
        this.target = CENTER_X;
        this.direction = -1;

        this.superZoneHit = false;
    }

    preload() {
        this.load.image('soup', 'assets/carrot_spice_soup.png');
    }

    create() {
        
        SPACEBAR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        E_KEY = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        UPKEY = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        DOWNKEY = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        BACKSPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.BACKSPACE);
        LEFTKEY = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        RIGHTKEY = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        ENTER = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);


        this.colors = [
            0xFFCC00,
            0Xff66b3,
            0x00FF00,
            0X990000,
            0X000099
        ];

        //background
        var bgColor = new Phaser.Display.Color(0 , 0, 0);
        var bg = this.add.rectangle(CENTER_X, CENTER_Y, SCREEN_WIDTH, SCREEN_HEIGHT, bgColor.color);

        //food being cooked
        this.add.image(CENTER_X, SCREEN_HEIGHT/7, 'soup').setOrigin(0.5, 0.5).setScale(0.2,0.2);

        this.drawUI();
    }
    //end of create

    drawUI() {
        //this creates the main ui bar
        this.longBar = this.add.rectangle(CENTER_X, 250, SCREEN_WIDTH - 200, 50, 0x000000);
        this.longBar.setStrokeStyle(3, 0xFFFFFF, 1); //@param -> lineWidth, color, alpha

        //set up the cooking zone 
        this.sweetSpot = this.add.rectangle(SCREEN_WIDTH*(1/3), 250, 100, 40, 0xb37700);
        this.sweetSpot.setOrigin(0, .5);

        //set up the static timing box in the main ui bar 
        this.actionBox = this.add.rectangle(this.longBar.x, this.longBar.y, 0, 47);
        this.actionBox.setStrokeStyle(3, 0x00FF00, 1);
        this.actionBox.isFilled = false;

        // this.needle = this.add.rectangle(this.longBar.x, this.longBar.y, 0, 50, 0x00FF00);
        // this.needle.setStrokeStyle(3, 0x00FF00, 1);

        //progress bar
        this.progressBar = this.add.rectangle(CENTER_X, SCREEN_HEIGHT/4, 200, 20);
        this.progressBar.setStrokeStyle(3, 0xFFFFFF, 1);
        this.progress = this.add.rectangle(this.progressBar.getLeftCenter().x + 3, this.progressBar.y, 10, 14);
        this.progress.setOrigin(0, .5);
        this.progress.setFillStyle(0x00FF00, 1);

        this.superZone = this.add.rectangle(this.sweetSpot.x, this.sweetSpot.y, 10, 40, 0xFFCC00);
        //this.superZone.setStrokeStyle(3, 0XFFCC00, 1);

        this.speedText = this.add.text(50, SCREEN_HEIGHT - 100, "Press UP or DOWN to adjust speed!\nSpeed: " + this.speed, {font: "20px Arial"});
        this.resetInstructions = this.add.text(SCREEN_WIDTH*3/4, SCREEN_HEIGHT - 100, "Press BACKSPACE to \nreset progress", {font: "20px Arial"});
    }
    
    update() {
        //this.input();
        console.log(this.progress);
        //superZone follows the sweetSpot
        this.superZone.x = this.sweetSpot.x + this.sweetSpot.width/2;

        if(ENTER.isDown 
            && this.actionBox.x > this.superZone.getLeftCenter().x
            && this.actionBox.x < this.superZone.getRightCenter().x) 
        {
            console.log("You hit the super zone!");
            this.superZoneHit = true;
            if(this.progress.width < this.progressBar.width - 6) {
                //this.progress.width += 10;
            }
        }

        //restart progress bar
        if (Phaser.Input.Keyboard.JustDown(BACKSPACE) || BACKSPACE.isDown) {
            this.progress.width = 5;
            this.superZoneHit = false;
            this.progress.setFillStyle(0x00FF00, 1);
            console.log("backspace pressed");
        }

        if(this.superZoneHit) {
            this.speed = 0;
            //this.switchProgressColor();
            this.progress.width += 5;
        }
        else {
            this.speed = this.SPEED;
        }

        //control needle (actionBox) with the space bar
        if( SPACEBAR.isDown ) {
            this.actionBox.x += this.speed;
        }
        else if( this.actionBox.x >= this.longBar.getLeftCenter().x +3 ){
            this.actionBox.x -= this.speed;
        }
        else {
            this.actionBox.x = this.longBar.getLeftCenter().x + 3;
        }

        //adjust speed with arrow keys!
        if (Phaser.Input.Keyboard.JustDown(UPKEY)) {
            this.speed = this.speed * 3/2;
            this.speedText.setText("Press UP or DOWN to adjust speed!\nSpeed: " + this.speed);
        }
        if (Phaser.Input.Keyboard.JustDown(DOWNKEY)) {
            this.speed = this.speed / (3/2);
            this.speedText.setText("Press UP or DOWN to adjust speed!\nSpeed: " + this.speed);
        }   

        //fill up the progress bar if cooking 
        if(this.actionBox.x < this.sweetSpot.getRightCenter().x && this.actionBox.x > this.sweetSpot.getLeftCenter().x && this.progress.width < this.progressBar.width - 6) {
            this.progress.width += .25;
        } 


        //zone is sliding left and hasn't met target and hasn't hit left edge of bar
        //if(this.direction < 0 && this.sweetSpot.x > this.target && this.sweetSpot.getLeftCenter().x >= this.longBar.getLeftCenter().x + 3) { 
        
        /*
        if(this.direction < 0) { //moving left
            if(this.sweetSpot.getLeftCenter().x <= this.longBar.getLeftCenter().x + 3 || this.sweetSpot.x < this.target) { //zone collided with left edge of bar pr target has been met
                console.log("Switching to right: \nzone's left x = " + this.sweetSpot.getLeftCenter().x + "\nzone's mid x = " + this.sweetSpot.x + "\nlongBar left x = " + this.longBar.getLeftCenter().x + 3 + "\ntarget = " + this.target);
                //change zone movement rightward
                this.direction = 1;
                this.sweetSpot.x = this.longBar.getLeftCenter().x + 5 + this.sweetSpot.width/2;
                this.target = this.sweetSpot.x += this.shift();
            }
            else 
                this.sweetSpot.x -= this.speed; //keep sliding left
        }
        else { //moving right
            if(this.sweetSpot.getRightCenter().x >= this.longBar.getRightCenter().x - 3 || this.sweetSpot.x > this.target) { //zone collided with right edge of bar or target has been met
                //change zone movement leftward
                this.direction = -1;
                this.sweetSpot.x = this.longBar.getRightCenter().x -5 - this.sweetSpot.width/2;
                this.target = this.sweetSpot.x -= this.shift();
            }
            else 
                this.sweetSpot.x += this.speed; //keep sliding right
        }
        */
       if(this.direction < 0) { //moving left
            if(this.sweetSpot.x < this.longBar.getLeftCenter().x) { //hit left bound
                this.direction = 1; //change direction to right
                this.sweetSpot.x += 3; //adjust sweetSpot out of boundary
                this.target = this.sweetSpot.x + this.shift(); // new target
            }
            else {
                if(this.sweetSpot.x < this.target) { //target reached
                    this.direction = 1; //change direction
                    this.target = this.sweetSpot.x + this.shift(); //new target
                }
                else 
                    this.sweetSpot.x -= this.speed/2; //move sweetSpot left
            }
       }
       else { //moving right
            if(this.sweetSpot.getRightCenter().x > this.longBar.getRightCenter().x) { //hit right bound
                this.direction = -1; //change direction to left
                this.sweetSpot.x -= 3; //adjust sweetSpot out of boundary
                this.target = this.sweetSpot.x - this.shift(); //new target
            }
            else {
                if(this.sweetSpot.x > this.target) { //target reached
                    this.direction = -1; //change direction
                    this.target = this.sweetSpot.x - this.shift(); //new target
                }
                else
                    this.sweetSpot.x += this.speed/2; //move sweetSpot right
            }
       }

        //this.sweetSpot.x += shift;
        if(!this.superZoneHit){
            this.SPEED = this.speed;
        }
    }

    shift() {
        //randomly move the cooking area
        //let sign = 1 - 2 * ((Math.random() * 2) | 0); //returns 1 or -1
        let shift =(Math.random() * 500 + 100) | 0;
        //this.target = this.sweetSpot.x += shift;
        //this.direction = sign;
        return shift;
    }

    switchProgressColor() {
        console.log("switching colors!");
        let current = this.progress.fillColor;
        let nu = this.progress.fillColor;
        console.log("current =" + this.progress.fill);
        // while(current == nu) {
            nu = this.colors[ Math.random(this.colors.length) | 0 ];
        // }
        console.log("new = " + nu);
        this.progress.setFillStyle(nu, 1);
    }


        
}


// activities

// toss salad/ingredients
// stir/mix ingredients
// change heat
// chop food

// grill fish
    // start fire
    // rotate skewer
    // skewer fish

// salad
    // chop fruits/veggies
    // add ingredients to bowl
    // wash ingredients

// soup
    // start fire
    // boil water
    // add ingredients to pot
    // stir pot