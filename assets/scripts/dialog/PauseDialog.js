var BaseDialog = require('BaseDialog');

var BaseDialog = cc.Class({
    extends: BaseDialog,

    properties: {
        homeBtn: cc.Button,
        continueBtn: cc.Button,
        restartBtn: cc.Button
    },

    onLoad() {
        this._super();
        this.homeBtn.node.on('click', this.home, this);
        this.continueBtn.node.on('click', this.continue, this);
        this.restartBtn.node.on('click', this.restart, this);
    },

    home: function () {

    },

    continue: function () {

    },

    restart: function () {

    },

    show: function (game) {
        console.log('PauseDialog show');
        
        this.game = game;
        this._super();
    }

    // update (dt) {},
});
