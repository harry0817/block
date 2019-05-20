var BaseDialog = require('BaseDialog');

var BaseDialog = cc.Class({
    extends: BaseDialog,

    properties: {
        scoreLabel: cc.Label,
        bestScoreLabel: cc.Label,
        homeBtn: cc.Button,
        soundBtn: cc.Button,
        leaderBoardBtn: cc.Button,
        continueBtn: cc.Button,
        newGameBtn: cc.Button
    },

    onLoad() {
        this._super();
        this.homeBtn.node.on('click', this.onHome, this);
        this.soundBtn.node.on('click', this.onSound, this);
        this.leaderBoardBtn.node.on('click', this.onLeaderBoard, this);
        this.continueBtn.node.on('click', this.onContinue, this);
        this.newGameBtn.node.on('click', this.onNewGame, this);
    },

    setScore: function (score) {
        this.scoreLabel.string = score;
    },

    setBestScore: function (bestScore) {
        this.bestScoreLabel.string = bestScore;
    },

    onHome: function () {
        this.dismissImmediately();
        this.game.gotoHome();
    },

    onSound: function () {

    },

    onLeaderBoard: function () {

    },

    onContinue: function () {
        this.dismiss();
    },

    onNewGame: function () {
        this.dismiss();
        this.game.newGame();
    },

    show: function (game) {
        this._super();
        this.game = game;
    }

    // update (dt) {},
});
