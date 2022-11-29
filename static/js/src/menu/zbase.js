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