var BaseDialog = require('BaseDialog');

var BaseDialog = cc.Class({
    extends: BaseDialog,

    properties: {
        scoreLabel: cc.Label,
        shareBtn: cc.Button,
        newGameBtn: cc.Button,
    },

    onLoad() {
        this._super();
        this.shareBtn.node.on('click', this.onShare, this);
        this.newGameBtn.node.on('click', this.onNewGame, this);
    },

    onShare: function () {
        this.dismiss();
        //TODO
    },

    onNewGame: function () {
        this.game.newGame();
    },

    show: function (game) {
        this._super();
        this.game = game;
    },

    // dismiss: function () {

    // },

    // update (dt) {},
});
