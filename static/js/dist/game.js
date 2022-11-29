class AcGameMenu {
    constructor(root) {
        this.root = root;
        this.$menu = $(`
<div class="ac-game-menu">
    <div class="ac-game-menu-field">
        <div class="ac-game-menu-field-item ac-game-menu-field-item-single_mode">
            简单模式
        </div>
        <br>
        <div class="ac-game-menu-field-item ac-game-menu-field-item-multi_mode">
            困难模式
        </div>
        <br>
        <div class="ac-game-menu-field-item ac-game-menu-field-item-settings">
            炼狱模式
        </div>
    </div>
</div>
`);
        this.root.$ac_game.append(this.$menu);
        this.$single_mode = this.$menu.find('.ac-game-menu-field-item-single_mode');
        this.$multi_mode = this.$menu.find('.ac-game-menu-field-item-multi_mode');
        this.$settings = this.$menu.find('.ac-game-menu-field-item-settings');

        this.start();

    }

    start() {
        this.add_listening_events();
    }

    add_listening_events() {
        let outer = this;
        this.$single_mode.click(function() {
            outer.hide();
            outer.root.playground = new AcGamePlayground(outer.root, 1);
            outer.root.playground.show();
        });
        this.$multi_mode.click(function() {
            outer.hide();
            outer.root.playground = new AcGamePlayground(outer.root, 2);
            outer.root.playground.show();
        });
        this.$settings.click(function() {
            outer.hide();
            outer.root.playground = new AcGamePlayground(outer.root, 3);
            outer.root.playground.show();

        });
    }

    show() {
        this.$menu.show();
    }
    hide() {
        this.$menu.hide();
    }
}












let AC_GAME_OBJECTS = [];


class AcGameObject {
    constructor() {
        AC_GAME_OBJECTS.push(this);
        this.has_called_start = false; //是否执行过start函数
        this.timedelta; //距离上一帧的时间间隔

    }

    start() {

    }

    update() {

    }

    on_destroy() { //删之前执行一次


    }

    destroy() {

        this.on_destroy();
        for(let i = 0; i < AC_GAME_OBJECTS.length; i++)
        {
            if(AC_GAME_OBJECTS[i] == this)
            {
                AC_GAME_OBJECTS.splice(i, 1);
                break;
            }
        }
    }
}

let last_timestamp;

let AC_GAME_ANIMATION = function(timestamp) {
    for(let i = 0; i < AC_GAME_OBJECTS.length; i++)
    {
        let obj = AC_GAME_OBJECTS[i];
        if(!obj.has_called_start)
        {
            obj.start();
            obj.has_called_start = true;
        }
        else
        {
            obj.timedelta = timestamp - last_timestamp;
            obj.update();
        }
    }
    last_timestamp = timestamp;


    requestAnimationFrame(AC_GAME_ANIMATION);
}

requestAnimationFrame(AC_GAME_ANIMATION);





class GameMap extends AcGameObject {
    constructor(playground) {
        super();
        this.playground = playground;
        this.$canvas = $(`<canvas> </canvas>`);
        this.ctx = this.$canvas[0].getContext('2d');
        this.ctx.canvas.width = this.playground.width;
        this.ctx.canvas.height = this.playground.height;
        this.playground.$playground.append(this.$canvas);


    }

    start() {

    }

    update() {
        this.render();

    }
    render() {
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
        this.ctx.fillRect(0, 0, this.playground.width, this.playground.height);

    }


}











class Particle extends AcGameObject {
    constructor(playground, x, y, radius, vx, vy, color, speed, move_length) {
        super();
        this.playground = playground;
        this.x = x;
        this.y = y;
        this.color = color;
        this.vx = vx;
        this.vy = vy;
        this.speed = speed;
        this.radius = radius;
        this.ctx = this.playground.game_map.ctx;
        this.friction = 0.9;
        this.move_length = move_length;
        this.eps = 1;

    }

    start() {

    }

    update() {
        if(this.move_length < this.eps || this.speed < this.eps)
        {
            this.destroy();
            return false;
        }
        let moved = Math.min(this.speed * this.timedelta / 1000);
        this.x += this.vx * moved;
        this.y += this.vy * moved;
        this.speed *= this.friction;
        this.move_length -= moved;
        this.render();
    }
    render() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }
}













class Player extends AcGameObject {
    constructor(playground, x, y, radius, color, speed, is_me) {
        super();
        this.playground = playground;
        this.ctx = this.playground.game_map.ctx;
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.move_length = 0;
        this.radius = radius;
        this.color = color;
        this.speed = speed;
        this.is_me = is_me;
        this.eps = 0.1;//误差限
        this.cur_skill = null;
        this.damage_x = 0;
        this.damage_y = 0;
        this.damage_speed = 0;
        this.friction = 0.9;
        this.sleep = 0;

    }

    start() {
        if(this.is_me)
        {
            this.add_listening_events();
        }
        else
        {
            let tx = Math.random() * this.playground.width;
            let ty = Math.random() * this.playground.height;
            this.move_to(tx, ty);

        }

    }

    add_listening_events() {
        let outer = this;
        this.playground.game_map.$canvas.on("contextmenu", function(){
            return false;
        });
        this.playground.game_map.$canvas.mousedown(function(e){
            if(e.which == 3)//右键
            {
                outer.move_to(e.clientX, e.clientY);

            }
            else if(e.which == 1)//左键
            {
                if(outer.cur_skill == "fireball")
                {
                    outer.shoot_fireball(e.clientX, e.clientY);
                }
                outer.cur_skill = null;
            }
        });

        $(window).keydown(function(e){
            if(e.which == 81)
            {
                outer.cur_skill = "fireball";
                return false;
            }

        });

    }

    shoot_fireball(tx, ty) {
        let x = this.x;
        let y = this.y;
        let radius = this.playground.height * 0.01;
        let angle = Math.atan2(ty - y, tx - x);
        let vx = Math.cos(angle), vy = Math.sin(angle);
        let color = "orange";
        let speed = this.playground.height * 0.5;
        let move_length = this.playground.height * 1;
        new FireBall(this.playground, this, x, y, radius, vx, vy, this.color, speed, move_length, this.playground.height * 0.01);

    }

    get_dist(x1, y1, x2, y2) {
        let dx = x1 - x2;
        let dy = y1 - y2;
        return Math.sqrt(dx * dx + dy * dy);
    }

    move_to(tx, ty) {
        this.move_length = this.get_dist(this.x, this.y, tx, ty);
        let angle = Math.atan2(ty - this.y, tx - this.x);
        this.vx = Math.cos(angle);
        this.vy = Math.sin(angle);

    }
    is_attacked(angle, damage) {

        for(let i = 0; i < 20 + Math.random() * 5; i++)
        {
            let x = this.x, y = this.y;
            let radius = this.radius * Math.random() * 0.1;
            let angle = Math.PI * 2 * Math.random();
            let vx = Math.cos(angle), vy = Math.sin(angle);
            let color = this.color;
            let speed = this.speed * 10;
            let move_length = this.radius * Math.random() * 5;
            new Particle(this.playground, x, y, radius, vx, vy, color, speed, move_length);
        }

        this.radius -= damage;
        if(this.radius < this.playground.height * 0.01)
        {

            this.destroy();
            return false;
        }
        this.damage_x = Math.cos(angle);
        this.damage_y = Math.sin(angle);
        this.damage_speed = damage * 100;
        this.speed *= 1.3;


    }

    update() {
        this.sleep += this.timedelta / 1000;
        if(!this.is_me && this.sleep > 4 && Math.random() < 1 / 180.0)
        {
            if(this.playground.model == 1)
            {
                let goal = this.playground.players[Math.floor(Math.random() * this.playground.players.length)];
                 while(goal == this)
                    goal = this.playground.players[Math.floor(Math.random() * this.playground.players.length)];
                 this.shoot_fireball(goal.x, goal.y);
            }
            else if(this.playground.model == 2)
            {
                let goal = this.playground.players[Math.floor(Math.random() * this.playground.players.length / 3)];
                while(goal == this)
                    goal = this.playground.players[Math.floor(Math.random() * this.playground.players.length / 3)];
                this.shoot_fireball(goal.x, goal.y);
            }
            else if(this.playground.model == 3)
            {
                let goal = this.playground.players[0];
                this.shoot_fireball(goal.x, goal.y);
            }

        }
        if(this.damage_speed > 10)
        {
            this.vx = this.vy = 0;
            this.move_length = 0;
            this.x += this.damage_x * this.damage_speed * this.timedelta / 1000;
            this.y += this.damage_y * this.damage_speed * this.timedelta / 1000;

            this.damage_speed *= this.friction;


        }

        else if(this.move_length < this.eps)
        {
            this.move_length = 0;
            this.vx = this.vy = 0;
            if(!this.is_me)
            {
                let tx = Math.random() * this.playground.width;
                let ty = Math.random() * this.playground.height;
                this.move_to(tx, ty);
            }
        }
        else
        {
            let moved = Math.min(this.move_length, this.speed * this.timedelta / 1000);
            this.x += moved * this.vx;
            this.y += moved * this.vy;
            if(this.x < 0 || this.x > this.playground.width || this.y < 0 || this.y > this.playground.height)
            {
                this.vx = this.vy = 0;
                this.move_length = 0;
            }
            this.move_length -= moved;
        }

        this.render();
    }

    render() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();

    }
    on_destroy() {
        for(let i = 0; i < this.playground.players.length; i++)
        {
            if(this.playground.players[i] == this)
            {
                this.playground.players.splice(i, 1);
                break;
            }
        }
    }
}



class FireBall extends AcGameObject {
    constructor(playground, player, x, y, radius, vx, vy, color, speed, move_lenght, damage) {
        super();
        this.playground = playground;
        this.player = player;
        this.x = x;
        this.y = y;
        this.ctx = this.playground.game_map.ctx;
        this.vx = vx;
        this.vy = vy;
        this.radius = radius;
        this.color = color;
        this.speed = speed;
        this.move_lenght = move_lenght;
        this.damage = damage;
        this.eps = 0.1;


    }

    start() {

    }

    update() {
        if(this.move_lenght < this.eps)
        {
            this.destroy();
            return false;
        }

        let moved = Math.min(this.move_lenght, this.speed * this.timedelta / 1000);
        this.x += this.vx * moved;
        this.y += this.vy * moved;
        this.move_lenght -= moved;
        for(let i = 0; i < this.playground.players.length; i++)
        {
            let player = this.playground.players[i];
            if(this.player !== player && this.is_collision(player))
            {
                this.attack(player);
            }
        }

        this.render();

    }

    get_dist(x1, y1, x2, y2) {
        let dx = x2 - x1, dy = y2 - y1;
        return Math.sqrt(dx * dx + dy * dy);
    }

    is_collision(player) {
        let distance = this.get_dist(this.x, this.y, player.x, player.y)
        if(distance < this.radius + player.radius)
            return true;
        return false;
    }

    attack(player) {
        let angle = Math.atan2(player.y - this.y, player.x - this.x);
        player.is_attacked(angle, this.damage);
        this.destroy();
    }

    render() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();

    }
}



class AcGamePlayground {
    constructor(root, model) {
        this.root = root;
        this.$playground = $(`<div class="ac-game-playground"></div>`);
        this.hide();
        this.root.$ac_game.append(this.$playground);
        this.width = this.$playground.width();
        this.height = this.$playground.height();
        this.game_map = new GameMap(this);
        this.model = model;
        this.players = [];
        this.players.push(new Player(this, this.width / 2, this.height / 2, this.height * 0.05, "white", this.height * 0.15, true));
        this.colors = ["blue", "pink", "green", "orange", "grey", "red", "yellow"];
        for(let i = 0; i < 7; i++)
        {
            this.players.push(new Player(this, this.width / 2, this.height / 2, this.height * 0.05, this.colors[i], this.height * 0.15, false));
        }

        this.start();

    }

    start() {

    }
    update() {

    }
    show() {
        this.$playground.show();

    }

    hide(){
        this.$playground.hide();
    }


}








class AcGame {
    constructor(id) {
        this.id = id;
        this.$ac_game = $('#' + id);
        this.menu = new AcGameMenu(this);
        this.playground = null;
//        this.playground_1 = new AcGamePlayground(this, 1);
//        this.playground_2 = new AcGamePlayground(this, 2);

        this.start();

    }

    start() {

    }


}

