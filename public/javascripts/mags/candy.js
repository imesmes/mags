/**
 * Class Candy
 */

Candy.prototype = new Object2D();

function Candy(x,y,vel,child) {
  Object2D.call(this, x, y, 60.8, 61);
  this.vel.x = vel.x*CONFIG.candy_base_speed;
  this.vel.y = vel.y*CONFIG.candy_base_speed;
  this.child = child;
  this.sprite = new Sprite('candy',this.w,this.h,0,0,8,0.05);

  this.ethon = Ethon.getInstance();

  this.draw = function() {
    this.sprite.draw(this.pos);
  }

  this.update = function(dt) {
    this.sprite.update(dt);
    var hit = false;
    if(this.ethon.collision_manager.sprite_collision(this, this.child)) {
      this.child.hit();
      hit = true;
    }
    this.pos.x = this.pos.x+this.vel.x*dt;
    this.pos.y = this.pos.y+this.vel.y*dt;
    return hit;
  }
}
