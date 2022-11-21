class AcGameMenu{constructor(t){this.root=t,this.$menu=$('\n<div class="ac-game-menu">\n    <div class="ac-game-menu-field">\n        <div class="ac-game-menu-field-item ac-game-menu-field-item-single_mode">\n            单人模式\n        </div>\n        <br>\n        <div class="ac-game-menu-field-item ac-game-menu-field-item-multi_mode">\n            多人模式\n        </div>\n        <br>\n        <div class="ac-game-menu-field-item ac-game-menu-field-item-settings">\n            设置\n        </div>\n    </div>\n</div>\n'),this.root.$ac_game.append(this.$menu),this.$single_mode=this.$menu.find(".ac-game-menu-field-item-single_mode"),this.$multi_mode=this.$menu.find(".ac-game-menu-field-item-multi_mode"),this.$settings=this.$menu.find(".ac-game-menu-field-item-settings"),this.start()}start(){this.add_listening_events()}add_listening_events(){let t=this;this.$single_mode.click((function(){t.hide(),t.root.playground.show()})),this.$multi_mode.click((function(){console.log("2")})),this.$settings.click((function(){console.log("3")}))}show(){this.$menu.show()}hide(){this.$menu.hide()}}let last_timestamp,AC_GAME_OBJECTS=[];class AcGameObject{constructor(){AC_GAME_OBJECTS.push(this),this.has_called_start=!1,this.timedelta}start(){}update(){}on_destroy(){}destroy(){this.on_destroy();for(let t=0;t<AC_GAME_OBJECTS.length;t++)if(AC_GAME_OBJECTS[t]==this){AC_GAME_OBJECTS.splice(t,1);break}}}let AC_GAME_ANIMATION=function(t){for(let s=0;s<AC_GAME_OBJECTS.length;s++){let i=AC_GAME_OBJECTS[s];i.has_called_start?(i.timedelta=t-last_timestamp,i.update()):(i.start(),i.has_called_start=!0)}last_timestamp=t,requestAnimationFrame(AC_GAME_ANIMATION)};requestAnimationFrame(AC_GAME_ANIMATION);class GameMap extends AcGameObject{constructor(t){super(),this.playground=t,this.$canvas=$("<canvas> </canvas>"),this.ctx=this.$canvas[0].getContext("2d"),this.ctx.canvas.width=this.playground.width,this.ctx.canvas.height=this.playground.height,this.playground.$playground.append(this.$canvas)}start(){}update(){this.render()}render(){this.ctx.fillStyle="rgba(0, 0, 0, 0.2)",this.ctx.fillRect(0,0,this.playground.width,this.playground.height)}}class Particle extends AcGameObject{constructor(t,s,i,e,h,a,l,n,r){super(),this.playground=t,this.x=s,this.y=i,this.color=l,this.vx=h,this.vy=a,this.speed=n,this.radius=e,this.ctx=this.playground.game_map.ctx,this.friction=.9,this.move_length=r,this.eps=1}start(){}update(){if(this.move_length<this.eps||this.speed<this.eps)return this.destroy(),!1;let t=Math.min(this.speed*this.timedelta/1e3);this.x+=this.vx*t,this.y+=this.vy*t,this.speed*=this.friction,this.move_length-=t,this.render()}render(){this.ctx.beginPath(),this.ctx.arc(this.x,this.y,this.radius,0,2*Math.PI,!1),this.ctx.fillStyle=this.color,this.ctx.fill()}}class Player extends AcGameObject{constructor(t,s,i,e,h,a,l){super(),this.playground=t,this.ctx=this.playground.game_map.ctx,this.x=s,this.y=i,this.vx=0,this.vy=0,this.move_length=0,this.radius=e,this.color=h,this.speed=a,this.is_me=l,this.eps=.1,this.cur_skill=null,this.damage_x=0,this.damage_y=0,this.damage_speed=0,this.friction=.9,this.sleep=0}start(){if(this.is_me)this.add_listening_events();else{let t=Math.random()*this.playground.width,s=Math.random()*this.playground.height;this.move_to(t,s)}}add_listening_events(){let t=this;this.playground.game_map.$canvas.on("contextmenu",(function(){return!1})),this.playground.game_map.$canvas.mousedown((function(s){3==s.which?t.move_to(s.clientX,s.clientY):1==s.which&&("fireball"==t.cur_skill&&t.shoot_fireball(s.clientX,s.clientY),t.cur_skill=null)})),$(window).keydown((function(s){if(81==s.which)return t.cur_skill="fireball",!1}))}shoot_fireball(t,s){let i=this.x,e=this.y,h=.01*this.playground.height,a=Math.atan2(s-e,t-i),l=Math.cos(a),n=Math.sin(a),r=.5*this.playground.height,d=1*this.playground.height;new FireBall(this.playground,this,i,e,h,l,n,this.color,r,d,.01*this.playground.height)}get_dist(t,s,i,e){let h=t-i,a=s-e;return Math.sqrt(h*h+a*a)}move_to(t,s){this.move_length=this.get_dist(this.x,this.y,t,s);let i=Math.atan2(s-this.y,t-this.x);this.vx=Math.cos(i),this.vy=Math.sin(i)}is_attacked(t,s){for(let t=0;t<20+5*Math.random();t++){let t=this.x,s=this.y,i=this.radius*Math.random()*.1,e=2*Math.PI*Math.random(),h=Math.cos(e),a=Math.sin(e),l=this.color,n=10*this.speed,r=this.radius*Math.random()*5;new Particle(this.playground,t,s,i,h,a,l,n,r)}if(this.radius-=s,this.radius<.01*this.playground.height)return this.destroy(),!1;this.damage_x=Math.cos(t),this.damage_y=Math.sin(t),this.damage_speed=100*s,this.speed*=1.3}update(){if(this.sleep+=this.timedelta/1e3,!this.is_me&&this.sleep>4&&Math.random()<1/180){let t=this.playground.players[Math.floor(Math.random()*this.playground.players.length)];for(;t==this;)t=this.playground.players[Math.floor(Math.random()*this.playground.players.length)];this.shoot_fireball(t.x,t.y)}if(this.damage_speed>10)this.vx=this.vy=0,this.move_length=0,this.x+=this.damage_x*this.damage_speed*this.timedelta/1e3,this.y+=this.damage_y*this.damage_speed*this.timedelta/1e3,this.damage_speed*=this.friction;else if(this.move_length<this.eps){if(this.move_length=0,this.vx=this.vy=0,!this.is_me){let t=Math.random()*this.playground.width,s=Math.random()*this.playground.height;this.move_to(t,s)}}else{let t=Math.min(this.move_length,this.speed*this.timedelta/1e3);this.x+=t*this.vx,this.y+=t*this.vy,(this.x<0||this.x>this.playground.width||this.y<0||this.y>this.playground.height)&&(this.vx=this.vy=0,this.move_length=0),this.move_length-=t}this.render()}render(){this.ctx.beginPath(),this.ctx.arc(this.x,this.y,this.radius,0,2*Math.PI,!1),this.ctx.fillStyle=this.color,this.ctx.fill()}on_destroy(){for(let t=0;t<this.playground.players.length;t++)if(this.playground.players[t]==this){this.playground.players.splice(t,1);break}}}class FireBall extends AcGameObject{constructor(t,s,i,e,h,a,l,n,r,d,o){super(),this.playground=t,this.player=s,this.x=i,this.y=e,this.ctx=this.playground.game_map.ctx,this.vx=a,this.vy=l,this.radius=h,this.color=n,this.speed=r,this.move_lenght=d,this.damage=o,this.eps=.1}start(){}update(){if(this.move_lenght<this.eps)return this.destroy(),!1;let t=Math.min(this.move_lenght,this.speed*this.timedelta/1e3);this.x+=this.vx*t,this.y+=this.vy*t,this.move_lenght-=t;for(let t=0;t<this.playground.players.length;t++){let s=this.playground.players[t];this.player!==s&&this.is_collision(s)&&this.attack(s)}this.render()}get_dist(t,s,i,e){let h=i-t,a=e-s;return Math.sqrt(h*h+a*a)}is_collision(t){return this.get_dist(this.x,this.y,t.x,t.y)<this.radius+t.radius}attack(t){let s=Math.atan2(t.y-this.y,t.x-this.x);t.is_attacked(s,this.damage),this.destroy()}render(){this.ctx.beginPath(),this.ctx.arc(this.x,this.y,this.radius,0,2*Math.PI,!1),this.ctx.fillStyle=this.color,this.ctx.fill()}}class AcGamePlayground{constructor(t){this.root=t,this.$playground=$('<div class="ac-game-playground"></div>'),this.hide(),this.root.$ac_game.append(this.$playground),this.width=this.$playground.width(),this.height=this.$playground.height(),this.game_map=new GameMap(this),this.players=[],this.players.push(new Player(this,this.width/2,this.height/2,.05*this.height,"white",.15*this.height,!0)),this.colors=["blue","pink","green","orange","grey","red","yellow"];for(let t=0;t<7;t++)this.players.push(new Player(this,this.width/2,this.height/2,.05*this.height,this.colors[t],.15*this.height,!1));this.start()}start(){}update(){}show(){this.$playground.show()}hide(){this.$playground.hide()}}class AcGame{constructor(t){this.id=t,this.$ac_game=$("#"+t),this.menu=new AcGameMenu(this),this.playground=new AcGamePlayground(this),this.start()}start(){}}