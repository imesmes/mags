/**
  Class Child
*/

var CHILD_IDLE = 0;
var CHILD_HUNGRY = 1;
var CHILD_INJURIED = 2;
var CHILD_EATING = 3;

var CHILD_BLUE = 0;
var CHILD_YELLOW = 1;
var CHILD_GREEN = 2;
var CHILD_PINK = 3;
var CHILD_RED = 4;
var CHILD_LIME = 5;
var CHILD_VIOLET = 6;
var CHILD_ORANGE = 7;

var CHILD_FRAMES = 8;

Child.prototype = new Object2D();

function Child(x,y,color) {
  Object2D.call(this, x, y, 75.1, 93);

  this.ethon = Ethon.getInstance();
  this.state = CHILD_IDLE; 
  this.selected = false;
  this.explosion = null;
  //this.timer = new Sprite('timer',19.8,19,0,0,10,0);
  //this.current_hungry_time = 0;
  //this.hungry_time = 0;
  this.score = null;

  this.color = color;

  this.sprites = new Array();
  this.sprites[CHILD_IDLE] = new Sprite('child',this.w,this.h,
      (this.color*(CHILD_FRAMES*this.w))+this.w*0,0,2,rand(3,5));
  this.sprites[CHILD_HUNGRY] = new Sprite('child',this.w,this.h,
      (this.color*(CHILD_FRAMES*this.w))+this.w*2,0,2,0.25);
  this.sprites[CHILD_EATING] = new Sprite('child',this.w,this.h,
      (this.color*(CHILD_FRAMES*this.w))+this.w*4,0,2,0.25);
  this.sprites[CHILD_INJURIED] = new Sprite('child',this.w,this.h,
      (this.color*(CHILD_FRAMES*this.w))+this.w*6,0,2,0.25);

  this.ethon.event_manager.register('eating_'+this.id, TIMED, 3);
  this.ethon.event_manager.register('injuried_'+this.id, TIMED, 4);
  this.ethon.event_manager.register('score_'+this.id, TIMED, 2);

  this.draw = function() {
    // Draw BB
    //this.ethon.render_manager.basicShape(BOX, this.pos, this.w, this.h);
    
    // Draw sprite
    this.sprites[this.state].draw(this.pos);

    // Draw score
    if(this.score != null) {
      var score_color = 'rgb(253,233,43)';
      var score_text = this.score;
      if(this.score < 0) {
        score_color = 'rgb(255,0,0)';
      }
      else {
        score_text = '+'+score_text;
      }
      this.ethon.render_manager.drawText(score_text,this.pos.x+10,this.pos.y+this.h/2,score_color,'rgb(0,0,0)');
    }

    //Draw timer
    //if(this.state == CHILD_HUNGRY && this.timer.get_current() < 10) {
    //  this.timer.draw(new Vector2D(this.pos.x+27,this.pos.y));
    //}

    //Draw explosion
    if(this.explosion != null) {
      this.explosion.draw();
    }
  }

  this.update = function(dt) {
    //Animate sprite
    this.sprites[this.state].update(dt);

    //Animate explosion
    if(this.explosion != null) {
      this.explosion.update(dt);
      if(!this.explosion.alive) {
        this.explosion = null;
        //console.log('Explosion for child #'+this.id+' destroyed.');
      }
    }

    //Update score
    this.ethon.event_manager.update('score_'+this.id,dt);
    if(this.ethon.event_manager.happens('score_'+this.id)) {
      this.score = null;
    }

    if(this.state == CHILD_HUNGRY) {
      this.ethon.event_manager.update('hungry_'+this.id,dt);
      if(this.ethon.event_manager.happens('hungry_'+this.id)) {
        this.state = CHILD_IDLE;
        this.ethon.event_manager.unregister('hungry_'+this.id);
        this.ethon.children_hungry_counter -= 1;
      }

      //this.current_hungry_time += dt;
      //this.timer.set_current(Math.round((this.current_hungry_time/this.hungry_time)*10));
    }
    else if(this.state == CHILD_INJURIED) {
      this.ethon.event_manager.update('injuried_'+this.id,dt);
      if(this.ethon.event_manager.happens('injuried_'+this.id)) {
        this.state = CHILD_IDLE;
      }
    }
    else if(this.state == CHILD_EATING) {
      this.ethon.event_manager.update('eating_'+this.id,dt);
      if(this.ethon.event_manager.happens('eating_'+this.id)) {
        this.state = CHILD_IDLE;
      }
    }
  }

  this.hit = function() {
    var score = 0;

    if(this.state == CHILD_IDLE) {
      this.state = CHILD_INJURIED;
      this.ethon.sound_manager.play_fx('ouch','sounds/ouch.ogg');

      this.ethon.combo = {color: 'none', score: 0};

      score = CONFIG.bad_score;
      if(this.ethon.key_color == this.color) {
        score *= 2;
      }
      this.ethon.score += score;
      this.ethon.time += CONFIG.bad_time;
    }
    else if(this.state == CHILD_HUNGRY) {
      this.state = CHILD_EATING;
      this.ethon.sound_manager.play_fx('nyam','sounds/nyam.ogg');

      this.ethon.candy_counter += 1;

      score = CONFIG.good_score;
      if(this.ethon.combo.color == this.color) {
        score += this.ethon.combo.score;
      }

      // Update last score
      this.ethon.combo.color = this.color;
      if(score <= CONFIG.max_combo_score) {
        this.ethon.combo.score = score;
      }
      //console.log(this.ethon.combo.score);

      if(this.ethon.key_color == this.color) {
        score *= 2;
      }
      this.ethon.score += score;
      this.ethon.time += CONFIG.good_time;

      // Explosion feedback
      this.explosion = new Explosion(new Vector2D(this.pos.x+(this.w/2),this.pos.y+(this.h/2)),20);
      //console.log('Explosion for child #'+this.id+' created.');
    }

    // Create text score
    this.score = score;
    this.ethon.event_manager.reset('score_'+this.id);

    // Reset hit
    this.ethon.children_hungry_counter -= 1;
    this.selected = false;
  };

  this.make_hungry = function(time) {
    if(this.state == CHILD_IDLE) {
      this.ethon.event_manager.register('hungry_'+this.id, TIMED, time);
      this.state = CHILD_HUNGRY;
      this.ethon.children_hungry_counter += 1;

      //this.timer.set_current(0);
      //this.hungry_time = time;
      //this.current_hungry_time = 0;
      //console.log('Child #'+this.id+' is hungry while '+time+' seconds!');
    }
  }

  this.clickable = function() {
    return this.state != CHILD_INJURIED && this.state != CHILD_EATING && !this.selected;
  }
}
