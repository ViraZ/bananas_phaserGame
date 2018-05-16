var Preload = function(game){};

Preload.prototype = {

	preload: function(){ 
	    this.game.load.image("minion", "assets/minion.png");
	    this.game.load.image("banana", "assets/banana.png");
	    this.game.load.physics("sprite_physics", "assets/sprite_physics.json");
	},

	create: function(){
		this.game.state.start("Main");
	}
}