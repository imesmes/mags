$(document).ready(function() {
  var game = $('#game').ethon({
    path: 'javascripts/mags/',
    init: function() {
      //  game meta
      this.score = 0;
      this.time = CONFIG.time;
      this.child_is_hungry_time = 0;
      this.children_hungry_counter = 0;
      this.candy_counter = 0;
      this.key_color_change_time = 0;
      this.level = 0;
      this.key_color = CHILD_BLUE;
      this.combo = { color: 'none', score: 0};
      this.available_colors = [ CHILD_BLUE,CHILD_ORANGE,CHILD_PINK,CHILD_LIME,CHILD_RED];
      this.display_level_up = false;
      this.event_manager.register('display_level_up',TIMED,1);
      // load textures
      this.texture_manager.add_texture('header','gui/header.png');
      this.texture_manager.add_texture('player','sprites/player.png');
      this.texture_manager.add_texture('child','sprites/child.png');
      this.texture_manager.add_texture('candy','sprites/candy.png');
      this.texture_manager.add_texture('hats','sprites/hats.png');
      this.texture_manager.add_texture('bonus_wrapper','gui/bonus_wrapper.png');
      this.texture_manager.add_texture('timer','sprites/timer.png');
      this.texture_manager.add_texture('level_up','sprites/level_up.png');
      //backgrounds
      this.texture_manager.add_texture('how_to_play_1_bg','sprites/how_to_play_1_bg.png');
      this.texture_manager.add_texture('how_to_play_2_bg','sprites/how_to_play_2_bg.png');
      this.texture_manager.add_texture('how_to_play_3_bg','sprites/how_to_play_3_bg.png');
      this.texture_manager.add_texture('how_to_play_4_bg','sprites/how_to_play_4_bg.png');
      this.texture_manager.add_texture('game_over','sprites/game_over.png');
      this.texture_manager.add_texture('background','sprites/bg.png');
      this.texture_manager.add_texture('home','sprites/home_bg.png');
      //buttons
      this.texture_manager.add_texture('next_button','gui/next_button.png');
      this.texture_manager.add_texture('previous_button','gui/previous_button.png');
      this.texture_manager.add_texture('new_game_button','gui/new_game_button.png');
      this.texture_manager.add_texture('how_to_play_button','gui/how_to_play_button.png');
      this.texture_manager.add_texture('home_button','gui/home_button.png');

      // game background
      this.background = new Sprite('background',700,700,0,0,1,0);
      this.how_to_play_1_bg = new Sprite('how_to_play_1_bg',700,700,0,0,1,0);
      this.how_to_play_2_bg = new Sprite('how_to_play_2_bg',700,700,0,0,1,0);
      this.how_to_play_3_bg = new Sprite('how_to_play_3_bg',700,700,0,0,1,0);
      this.how_to_play_4_bg = new Sprite('how_to_play_4_bg',700,700,0,0,2,2);
      this.home_bg = new Sprite('home',700,700,0,0,1,0);
      this.game_over_bg = new Sprite('game_over',700,700,0,0,1,0);
      this.header = new Sprite('header',700,67,0,0,1,0);
      this.level_up = new Sprite('level_up',420,125,0,0,1,0);
      // game hats
      this.hats = new Sprite('hats',67.7,51,0,0,8,0);
      this.bonus_wrapper = new Sprite('bonus_wrapper',131,184,0,0,1,0);
      // game candy counter
      this.candy_counter_sprite = new Sprite('candy',60.8,61,0,0,8,0.2);
      this.candy_counter_sprite.set_current(7);

      // game children
      this.children = new Array();
      for(i in CONFIG.children) {
        var params = CONFIG.children[i];
        this.children.push(new Child(params.position[0],params.position[1],params.color));
      }

      // game player 
      this.player = new Player(CONFIG.player_position[0],CONFIG.player_position[1]);


      // play music
      //this.sound_manager.play_music('sounds/fat_blue_christmas_swing_medley.mp3');
      
      // buttons
      // main
      this.new_game_button = new Button('new_game_button',360,535,268,131,2, function() {
            this.ethon.scene_manager.set_active('game');
          });
      this.how_to_play_button = new Button('how_to_play_button',60,530,213,133,2, function() {
            this.ethon.scene_manager.set_active('how_to_play_1');
          });
      // how_to_play_1
      this.home_button = new Button('home_button',90,610,58,58,2, function() {
            this.ethon.scene_manager.set_active('home');
          });
      this.next_button_1 = new Button('next_button',160,610,58.5,58,2, function() {
            this.ethon.scene_manager.set_active('how_to_play_2');
          });
      // how_to_play_2
      this.previous_button_2 = new Button('previous_button',20,610,58,59,2, function() {
            this.ethon.scene_manager.set_active('how_to_play_1');
          });
      this.next_button_2 = new Button('next_button',160,610,58.5,58,2, function() {
            this.ethon.scene_manager.set_active('how_to_play_3');
          });
      // how_to_play_3
      this.previous_button_3 = new Button('previous_button',20,610,58,59,2, function() {
            this.ethon.scene_manager.set_active('how_to_play_2');
          });
      this.next_button_3 = new Button('next_button',160,610,58.5,58,2, function() {
            this.ethon.scene_manager.set_active('how_to_play_4');
          });
      // how_to_play_4
      this.previous_button_4 = new Button('previous_button',20,610,58,59,2, function() {
            this.ethon.scene_manager.set_active('how_to_play_3');
          });

      // scene home:
      this.scene_manager.add_scene('home', {
          init: function() {},
          draw: function() {
            this.ethon.home_bg.draw(new Vector2D(0,0));
            this.ethon.new_game_button.draw();
            this.ethon.how_to_play_button.draw();
          },
          update: function(dt) {
            this.ethon.new_game_button.update(dt);
            this.ethon.how_to_play_button.update(dt);
          }
        }
      );

      // scene how_to_play_1
      this.scene_manager.add_scene('how_to_play_1', {
          init: function() {},
          draw: function() {
            this.ethon.how_to_play_1_bg.draw(new Vector2D(0,0));
            this.ethon.home_button.draw();
            this.ethon.next_button_1.draw();
          },
          update: function(dt) {
            this.ethon.home_button.update(dt);
            this.ethon.next_button_1.update(dt);
          }
        }
      );

      // scene how_to_play_2
      this.scene_manager.add_scene('how_to_play_2', {
          init: function() {},
          draw: function() {
            this.ethon.how_to_play_2_bg.draw(new Vector2D(0,0));
            this.ethon.home_button.draw();
            this.ethon.previous_button_2.draw();
            this.ethon.next_button_2.draw();
          },
          update: function(dt) {
            this.ethon.home_button.update(dt);
            this.ethon.previous_button_2.update(dt);
            this.ethon.next_button_2.update(dt);
          }
        }
      );

      // scene how_to_play_3
      this.scene_manager.add_scene('how_to_play_3', {
          init: function() {},
          draw: function() {
            this.ethon.how_to_play_3_bg.draw(new Vector2D(0,0));
            this.ethon.home_button.draw();
            this.ethon.previous_button_3.draw();
            this.ethon.next_button_3.draw();
          },
          update: function(dt) {
            this.ethon.home_button.update(dt);
            this.ethon.previous_button_3.update(dt);
            this.ethon.next_button_3.update(dt);
          }
        }
      );

      // scene how_to_play_4
      this.scene_manager.add_scene('how_to_play_4', {
          init: function() {},
          draw: function() {
            this.ethon.how_to_play_4_bg.draw(new Vector2D(0,0));
            this.ethon.home_button.draw();
            this.ethon.previous_button_4.draw();
          },
          update: function(dt) {
            this.ethon.how_to_play_4_bg.update(dt);
            this.ethon.home_button.update(dt);
            this.ethon.previous_button_4.update(dt);
          }
        }
      );

      // scene game:
      this.scene_manager.add_scene('game', {
          init: function() {},
          draw: function() {
            this.ethon.background.draw(new Vector2D(0,0));
            this.ethon.header.draw(new Vector2D(0,0));

            this.ethon.bonus_wrapper.draw(new Vector2D(570,460));
            this.ethon.hats.draw(new Vector2D(615,505));
            this.ethon.render_manager.drawText('Bonus',620,585,'#000000');

            var time_size = 14;
            var time_color = "#ffffff";
            if(this.ethon.time < 15) {
              time_color = "#ff0000";
              time_size = 20;
            }
            this.ethon.render_manager.drawText('temps ',10,40,'#ffffff');
            this.ethon.render_manager.drawText(Math.ceil(this.ethon.time)+' s',
                                                70,40,time_color,undefined,time_size);

            this.ethon.render_manager.drawText('nivell '+(this.ethon.level+1),250,40,'#ffffff');

            this.ethon.render_manager.drawText(int_to_string(this.ethon.score,6),355,40,'#ffffff');
            this.ethon.render_manager.drawText('punts',440,40,'#ffffff');

            this.ethon.candy_counter_sprite.draw(new Vector2D(525,0));
            this.ethon.render_manager.drawText('x '+this.ethon.candy_counter,590,40,'#ffffff');

            for(i in this.ethon.children) {
              this.ethon.children[i].draw();
            }
            this.ethon.player.draw();

            if(this.ethon.display_level_up) {
              this.ethon.level_up.draw(new Vector2D(140,270));
            }
          },
          update: function(dt) {
            this.ethon.player.update(dt);
            for(i in this.ethon.children) {
              this.ethon.children[i].update(dt);
            }

            //this.ethon.candy_counter_sprite.update(dt);

            this.ethon.child_is_hungry_time += dt;
            if(this.ethon.children_hungry_counter < CONFIG.active_children[this.ethon.level] && 
                this.ethon.child_is_hungry_time >= CONFIG.child_is_hungry_time) {
              // Get children hungry time depends on level
              var cht = CONFIG.hungry_time[this.ethon.level];
              // Random child is hungry while x seconds
              this.ethon.children[rand(0,this.ethon.children.length-1)].make_hungry(rand(cht[0],cht[1]));
              this.ethon.child_is_hungry_time = 0;
            }

            this.ethon.key_color_change_time += dt;
            if(this.ethon.key_color_change_time >= CONFIG.key_color_change_time) {
              this.ethon.key_color = this.ethon.available_colors[rand(0,this.ethon.available_colors.length-1)];
              this.ethon.key_color_change_time = 0;
              //console.log('Key color changes to: '+this.key_color);
            }
            this.ethon.hats.set_current(this.ethon.key_color);

            if(this.ethon.display_level_up) {
              this.ethon.event_manager.update('display_level_up',dt);
              if(this.ethon.event_manager.happens('display_level_up')) {
                this.ethon.display_level_up = false;
              }
            }
            
            if(this.ethon.candy_counter >= CONFIG.candy_needed[this.ethon.level+1]) {
              this.ethon.level += 1;
              this.ethon.display_level_up = true;
            } 

            this.ethon.time -= dt;
            if(this.ethon.time <= 0) {
              this.ethon.scene_manager.set_active('game_over');
              //TODO:codi que desoculti allo
            }
          }
        }
      );

      // game over scene:
      this.scene_manager.add_scene('game_over', {
          init: function() {},
          draw: function() {
            this.ethon.game_over_bg.draw(new Vector2D(0,0));
          },
          update: function(dt) {
          }
        }
      );

      // set active scene
      this.scene_manager.set_active('home');
    }
  });

  game.start();
});
