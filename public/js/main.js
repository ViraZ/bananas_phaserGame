var Main = function(game){

};

Main.prototype = {

	create: function() {
	    var me = this;

	    // Set the background colour to blue
	    me.game.stage.backgroundColor = '#8588ff';


	    // Start the P2 Physics Engine
	    me.game.physics.startSystem(Phaser.Physics.P2JS);

	    me.game.physics.p2.gravity.y = 1000;

	    // Create a random generator
	    var seed = Date.now();
	    me.random = new Phaser.RandomDataGenerator([seed]);

	    // Create the ceiling
	    me.createBlock();

	    // Create the player
	    me.createPlayer();

	    // Create rope
	    me.createRope();

		// Create a bunch of bananas
		me.bananas = me.createObjects("banana");
        me.game.stage.backgroundColor = '#c0ffdf';
		// This is required so that the groups will collide with the world bounds
		me.game.physics.p2.updateBoundsCollisionGroup();

	    // Spawn bananas every 600ms
	    me.timer = game.time.events.loop(600, function() {
	        me.spawnObjectLeft();
	        me.spawnObjectRight();
	    });
	},

	createObjects: function(objectName) {
		var me = this;

		// Create a group to hold the collision shapes
		var objects = game.add.group();
		objects.enableBody = true;
		objects.physicsBodyType = Phaser.Physics.P2JS;
		objects.createMultiple(40, objectName);

	    objects.forEach(function(child){
	        child.body.clearShapes();
			child.body.loadPolygon('sprite_physics', objectName);
	    }, me);   

	    return objects;
	},

	update: function() {
	    var me = this;

	    //Update the position of the rope
	    me.drawRope();
	},

	spawnObjectLeft: function() {
	    var me = this;
	    var object = me.spawnObject();

	    // Set object's position and velocity
	    object.reset(1, 600);
	    object.body.velocity.x = me.random.integerInRange(100, 800);
	    object.body.velocity.y = -me.random.integerInRange(1000, 1500);
	},

	spawnObjectRight: function() {
	    var me = this;

	    // Spawn new object
	    var object = me.spawnObject();

	    // Set object's position and velocity
	    object.reset(me.game.world.width, 600);
	    object.body.velocity.x = -me.random.integerInRange(100, 800);
	    object.body.velocity.y = -me.random.integerInRange(1000, 1500);
	},

	spawnObject: function() {
	    var me = this;

	    // Spawn a new banana on the left and give it a random velocity
	    var object = me.bananas.getFirstDead();
	    object.lifespan = 6000;

	    return object;
	},

	createBlock: function() {
	    var me = this;

	    var blockShape = me.game.add.bitmapData(me.game.world.width, 200);

	    blockShape.ctx.rect(0, 0, me.game.world.width, 200);
	    blockShape.ctx.fillStyle = '#4C4';
	    blockShape.ctx.fill();

	    me.block = me.game.add.sprite(0, 0, blockShape);

	    // Enable P2 Physics and set the block not to move
	    me.game.physics.p2.enable(me.block);
	    me.block.body.static = true;
	    me.block.anchor.setTo(0, 0);

    	me.block.inputEnabled = true;
	    me.block.events.onInputDown.add(me.changeRope, this);
    	},

	changeRope: function(sprite, pointer) {
	    var me = this;

	    //Remove last spring
	    me.game.physics.p2.removeSpring(me.rope);

	    //Create new spring at pointer x and y
	    me.rope = me.game.physics.p2.createSpring(me.block, me.player, 200, 10, 3, [-pointer.x, -pointer.y]);
	    me.ropeAnchorX = pointer.x;
	    me.ropeAnchorY = pointer.y
	},

	createPlayer: function() {
	    var me = this;

	    // Add the player to the game
	    me.player = me.game.add.sprite(200, 150, 'minion');

	    me.game.physics.p2.enable([me.player], false);

	    me.player.body.clearShapes();

	    me.player.body.loadPolygon("sprite_physics", "minion");
	},

	createRope: function() {
	    var me = this;

	    // Add bitmap data to draw the rope
	    me.ropeBitmapData = game.add.bitmapData(me.game.world.width, me.game.world.height);

	    me.ropeBitmapData.ctx.beginPath();
	    me.ropeBitmapData.ctx.lineWidth = "2";
	    me.ropeBitmapData.ctx.strokeStyle = "#4C4";
	    me.ropeBitmapData.ctx.stroke();
	    me.line = game.add.sprite(0, 0, me.ropeBitmapData);

	    me.ropeAnchorX = (me.block.world.x + 600);
	    me.ropeAnchorY = (me.block.world.y + me.block.height);

	    // Create a spring between the player and block to act as the rope
	    me.rope = me.game.physics.p2.createSpring(
	        me.block,  // sprite 1
	        me.player, // sprite 2
	        300,       // length of the rope
	        10,        // stiffness
	        3,         // damping
	        [-(me.block.world.x + 600), -(me.block.world.y + me.block.height)]
	    );

	    // Draw a line from the player to the block to visually represent the spring
	    me.line = new Phaser.Line(me.player.x, me.player.y,
	        (me.block.world.x + 500), (me.block.world.y + me.block.height));
	},

	drawRope: function() {
	    var me = this;

	    // Change the bitmap data to reflect the new rope position
	    me.ropeBitmapData.clear();
	    me.ropeBitmapData.ctx.beginPath();
	    me.ropeBitmapData.ctx.beginPath();
	    me.ropeBitmapData.ctx.moveTo(me.player.x, me.player.y);
	    me.ropeBitmapData.ctx.lineTo(me.ropeAnchorX, me.ropeAnchorY);
	    me.ropeBitmapData.ctx.lineWidth = 4;
	    me.ropeBitmapData.ctx.stroke();
	    me.ropeBitmapData.ctx.closePath();
	    me.ropeBitmapData.render();
    },

	gameOver: function(){
		this.game.state.start('GameOver');
	},
};