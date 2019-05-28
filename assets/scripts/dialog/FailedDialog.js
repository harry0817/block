var BaseDialog = require('BaseDialog');

cc.Class({
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

    setScore: function (score) {
        this.scoreLabel.string = score;
    },

    onShare: function () {
        this.dismiss();
        //TODO
    },

    onNewGame: function () {
        this.game.newGame();
        this.dismiss();
    },

    show: function (game) {
        this._super();
        this.game = game;
    },

    // dismiss: function () {

    // },

    // update (dt) {},
});
