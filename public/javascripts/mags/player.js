/**
  Class Player
*/

var PLAYER_IDLE = 0;
var PLAYER_THROWING = 1;

Player.prototype = new Object2D();

function Player(x,y) {
  Object2D.call(this,x,y,96,136);

  this.ethon = Ethon.getInstance();
  this.state = PLAYER_IDLE;
  this.candies = new Array();

  this.sprites = new Array();
  this.sprites[PLAYER_IDLE] = new Sprite('player',this.w,this.h,
      0,0,2,2);
  this.sprites[PLAYER_THROWING] = new Sprite('player',this.w,this.h,
      this.w*2,0,3,0.1);

  this.ethon.event_manager.register('click_child', MOUSE, this.ethon.children);
  this.ethon.event_manager.register('player_throwing', TIMED, 0.3);

  this.draw = function() {
    // Draw player
    this.sprites[this.state].draw(this.pos);

    // Draw candies
    for(var i = 0; i < this.candies.length; i++)
      this.candies[i].draw();
  };

  this.update = function(dt) {
    //Update candies
    var remove = null;
    for(var i = 0; i < this.candies.length; i++) {
      if(this.candies[i].update(dt)) {
        remove = i;
      }
    }
    if(remove != null) {
      this.ethon.event_manager.unregister('animation_'+this.candies[remove].sprite.id);
      this.candies.splice(remove,1);
    }

    //Animate sprite
    this.sprites[this.state].update(dt);

    //Update state
    if(this.state == PLAYER_THROWING) {
      this.ethon.event_manager.update('player_throwing',dt);
      if(this.ethon.event_manager.happens('player_throwing')) {
        this.state = PLAYER_IDLE;
      }
    }
    else {
      //Click childs
      child = this.ethon.event_manager.happens('click_child');
      if(child != null && child.clickable()) {
        this.state = PLAYER_THROWING;
        child.selected = true;
        var vel = new Vector2D();
        vel.x = child.pos.x-(this.pos.x+(this.w/2));
        vel.y = child.pos.y-(this.pos.y+(this.h/2));
        vel.normalize();
        var candy = new Candy(this.pos.x+(this.w/2), 
            this.pos.y+(this.h/2),vel,child);
        this.candies.push(candy);
      }
    }
  };
};
