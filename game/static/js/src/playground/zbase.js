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