var BaseDialog = require('BaseDialog');
var GameData = require('GameData');

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
        //TODO
        FBInstant.shareAsync({
            intent: 'SHARE',
            image: '',
            text: '来玩2048吧',
            data: { myReplayData: '123' },
        }).then(() => {
            GameData.instance.coinCount += 1;
            this.game.gameUI.updateCoinCount();
            this.dismiss();
        });

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
