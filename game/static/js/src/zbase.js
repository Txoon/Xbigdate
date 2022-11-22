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