class Play extends Phaser.Scene {
    constructor() {
        super("gameScene");

        this.speed = 4;
        this.sliding = false;
        this.starting = false;
        this.exploit = true; //to prevent user from just holding the cook button the entire time
    }

    preload() {
        this.load.image('groundScroll', 'assets/ground.png');
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


        //background
        var bgColor = new Phaser.Display.Color(0 , 0, 0);
        var bg = this.add.rectangle(CENTER_X, CENTER_Y, SCREEN_WIDTH, SCREEN_HEIGHT, bgColor.color);


        //this creates the main ui bar
        this.longBar = this.add.rectangle(CENTER_X, 200, SCREEN_WIDTH - 200, 50, 0x000000);
        this.longBar.setStrokeStyle(3, 0xFFFFFF, 1); //@param -> lineWidth, color, alpha
        //this.longBar.setFillStyle(0x000000, 1);

        //this.rightBarBorder = 


        //text
        this.topText = this.add.text(CENTER_X, 50, "Hold SPACE while food is in cooking zone!", { font: "40px Arial" });
        this.topText.x -= this.topText.width/2;

        this.speedText = this.add.text(50, SCREEN_HEIGHT - 100, "Press UP or DOWN to adjust speed!\nSpeed: " + this.speed, {font: "20px Arial"});

        //set up the food bar 
        this.sweetSpot = this.add.rectangle(SCREEN_WIDTH*(2/3), 200, 50, 40, 0XFF0000);
        this.sweetSpot.setOrigin(0, .5);

        let tailX = this.sweetSpot.x + this.sweetSpot.width;
        this.tail = this.add.rectangle(tailX, 200, 100, 36, 0xFFFFFF);
        this.tail.setOrigin(0, .5);
        this.tail.setFillStyle(0xFFFFFF, 0);
        this.tail.setStrokeStyle(4, 0xFF0000, 1);

        this.sweetSpot.width = 0;
        this.tail.displayWidth = 0;
        this.resetFoodBar();

        //set up the static timing box in the main ui bar 
        this.actionBox = this.add.rectangle(this.longBar.x, this.longBar.y, 50, 47, 0x000000);
        this.actionBox.setStrokeStyle(3, 0xFFFFFF, 1);
        this.actionBox.isFilled = false;

        //make container for progress bar 
        this.meterBox = this.add.rectangle(CENTER_X * (7/4), (3/4) * SCREEN_HEIGHT, 104, 200, 0xFFFFFF);
        this.meterBox.isFilled = false;
        this.meterBox.setStrokeStyle(3, 0xFFFFFF, 1);
        //the fill for the progress bar
        this.progress = this.add.rectangle(CENTER_X * (7/4), this.meterBox.getBottomCenter().y - 3, 96, 0, 0x00FF00).setOrigin(.5, 1);

        //color/food selection 
        this.colorOptions = [0x8F551F, 0xDCB94C, 0x44721B, 0x87CBA0, 0xA128AF];

        this.selection = this.add.rectangle(CENTER_X, CENTER_Y + 40, 50, 50, 0x8F551F);
        this.currentColor = 0x8F551F;
        this.leftArrow = this.add.text(CENTER_X - 75, this.selection.y - 20, "<", {font: "40px Arial"});
        this.rightArrow = this.add.text(CENTER_X + 50, this.selection.y - 20, ">", {font: "40px Arial"});

        this.selectionText1 = this.add.text(CENTER_X, this.selection.y + 50, "Use LEFT and RIGHT to choose food", {font: "20px Arial"}).setOrigin(.5, .5);
        this.selectionText2 = this.add.text(CENTER_X, this.selection.y + 70, "Press ENTER to start cooking", {font: "20px Arial"}).setOrigin(.5, .5);

        this.add.text = this.add.text(this.meterBox.getBottomCenter().x -25, this.meterBox.getBottomCenter().y + 30, "BACKSPACE to reset progress", {font: "20px Arial"}).setOrigin(.5,.5);
    }

    changeColorOption(direction) {
        let newColor;

        this.colorOptions.forEach(   
            (color, index, colorArray) => { 

                if(color == this.currentColor) {
                    if(direction == ("right"))
                        //new color is next index and will loop to the beginning when the end is reached
                        newColor = index < colorArray.length - 1 ? colorArray[index + 1] : colorArray[0];

                    else if (direction == ("left"))
                        //new color is prev index and will loop to the end of the array when the beginning is reached
                        newColor = index > 0 ? colorArray[index - 1] : colorArray[colorArray.length -1];

                    else 
                        console.log("Dude, left or right, which color do you want?");

                    this.selection.setFillStyle( newColor, 1);
                    //console.log(index + " -> " + index + 1);
                }
            }
        );
        this.currentColor = this.selection.fillColor;
    }

    cooking() {
        let a1 = this.sweetSpot.getLeftCenter().x;
        let a2 = this.tail.getRightCenter().x;
        let b1 = this.actionBox.getLeftCenter().x;
        let b2 = this.actionBox.getRightCenter().x;


        // console.log(a1);
        // console.log(a2);
        // console.log(b1);
        // console.log(b2);

        //if left edge food is less than left edge of action box
        if (a1 < b1) {
            //console.log("poop");
            console.log(a2<b1);
            return (a2 > b1);
        }
        else { 
            console.log(a1<b2);
            return (a1 < b2); 
        }
    }
    
    resetFoodBar() {
        this.sweetSpot.x = this.longBar.getRightCenter().x;
        this.tail.x = this.sweetSpot.getRightCenter().x;
        this.exploit = true;
    }

    foodSlide() {
        let speed = this.speed;
        this.sweetSpot.x -= speed;
        this.tail.x -= speed;
    }

    atEndOfBar() {
        let foodX = this.sweetSpot.getLeftCenter().x;
        let barX = this.longBar.getLeftCenter().x;
        return foodX <= barX + 9;
    }

    isProgressFull() {
        //let progressTop = this.progress.getTopCenter().y;
        let progressTop = this.progress.y + this.progress.height;
        let meterTop = this.meterBox.getTopCenter().y + 5;
        let unFilled = progressTop >= meterTop;
        
        //console.log(progressTop + " >= " + meterTop + " = " + unFilled);
        return !unFilled;
    }

    endFoodBar() {
        this.sliding = false; 
        let speed = this.speed;

        if( !this.isSweetSpotGone() ) {
            this.sweetSpot.width -= speed;
            this.tail.x-= speed;
        }
        else if ( !this.isTailGone() ){
            //console.log(this.tail.width + "\n" + this.tail.displayWidth);
            //this.tail.width -= speed;
            this.tail.displayWidth -= speed;
            //console.log("tail is recognized");
        }
        else {
            //console.log("tail is not recognized");
            this.tail.displayWidth = 0;
            //this.tail.width = 0;

            //transport everything to right side
            this.tail.x = this.longBar.getRightCenter().x - 9;
            this.sweetSpot.x = this.longBar.getRightCenter().x - 9;

            //this.startFoodBar();
        }

    }

    startFoodBar() {
        let targetHeadWidth = 50; //sweetSpot -> head
        let targetTailWidth = 100; 
        let speed = this.speed;

        if(this.sweetSpot.width < targetHeadWidth) {
            this.sweetSpot.x -= speed;
            this.sweetSpot.width += speed;
        }
        else if (this.tail.displayWidth < targetTailWidth) {
            this.sweetSpot.x -= speed;
            this.tail.x -= speed;
            this.tail.displayWidth += speed;
        }
        else {
            this.sliding = true;
            this.starting = false;
        }


    }

    isSweetSpotGone() {
        return this.sweetSpot.width > 0 ? false : true;
    }

    isTailGone() {
        //return this.tail.width > this.speed ? false : true;
        return this.tail.displayWidth > this.speed ? false : true;
    }


    bubbleEffect() {
        let direction = Math.floor(Math.random() * 2); //randomly returns 0 or 1
        //console.log(direction);
        //let magnitude = Math.floor(Math.random() * 5) + 1;     // returns a random integer from 1 to 5
        let magnitude = Math.floor(Math.random() * 2);
        //console.log(magnitude);

        if (direction) {
            if( !this.isProgressFull() ) this.progress.height -= magnitude;
        }
        else { 
            if(this.progress.height < 0) this.progress.height += magnitude;
        }
    }
    

    update() {
        this.bubbleEffect();

        //food is sliding through the bar
        if(this.sliding && !this.atEndOfBar()) {
            this.foodSlide();
        }

        //food has reached the end of the bar
        else if ( this.atEndOfBar() ) {
            this.endFoodBar();
        }

        else if (this.starting) {
            this.startFoodBar();
            this.actionBox.setStrokeStyle(3, 0xFFFFFF, 1);
        }
        //food is spawning at beginning
        else {
            //this.startFoodBar();
        }

        //when E is pressed
        if( Phaser.Input.Keyboard.JustDown(E_KEY)) {
            this.sliding = this.sliding ? false : true; //if sliding is false change to true and vice versa 
            //this.changeColorOption_Right();
        }

        //when spacebar is pressed
        if( Phaser.Input.Keyboard.JustDown(SPACEBAR) ) {         
            //the user can't start holding the space bar before the food reaches the actionBox
            //when exploit is false, the user can score points from cooking
            this.exploit = !this.cooking(); 
        }        
        
        //while spacebar is pressed
        if( SPACEBAR.isDown ) {

            //fill up the progress bar if cooking 
            if ( !this.isProgressFull() ) { 
                if(this.cooking() && !this.exploit) {
                    this.progress.height -= 3;
                    this.actionBox.setStrokeStyle(3, 0x00FF00, 1);
                }            
                else {
                    this.actionBox.setStrokeStyle(3, 0xFF0000, 1);
                }
            //this.progress.y = this.meterBox.getBottomCenter().y + 4;
            }
        }

        //when spacebar is released
        if( Phaser.Input.Keyboard.JustUp(SPACEBAR) ) {
            this.actionBox.setStrokeStyle(3, 0xFFFFFF, 1);
        }

        //adjust speed with arrow keys!
        if (Phaser.Input.Keyboard.JustDown(UPKEY)) {
            this.speed = this.speed * 2;
            this.speedText.setText("Press UP or DOWN to adjust speed!\nSpeed: " + this.speed);
        }
        if (Phaser.Input.Keyboard.JustDown(DOWNKEY)) {
            this.speed = this.speed / 2;
            this.speedText.setText("Press UP or DOWN to adjust speed!\nSpeed: " + this.speed);
        }

        //reset progress bar with BACKSPACE
        if (Phaser.Input.Keyboard.JustDown(BACKSPACE)) {
            this.progress.height = 0;
        }

        if(Phaser.Input.Keyboard.JustDown(LEFTKEY)) {
            this.changeColorOption("left");
        }
        if(Phaser.Input.Keyboard.JustDown(RIGHTKEY)) {
            this.changeColorOption("right");
        }
        if(Phaser.Input.Keyboard.JustDown(ENTER)) {
            this.sweetSpot.setFillStyle(this.currentColor, 1);
            this.tail.setStrokeStyle(4, this.currentColor, 1);
            this.starting = true;
            //this.sliding = true;
        }
    }
        
}