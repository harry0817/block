var BaseDialog = require('BaseDialog');
var i18n = require('LanguageData');
var Toggle = require('Toggle');
var GameData = require('GameData');

cc.Class({
    extends: BaseDialog,

    properties: {
        scoreLabel: cc.Label,
        bestScoreLabel: cc.Label,
        homeBtn: cc.Button,
        soundBtn: cc.Button,
        soundToggle: Toggle,
        leaderBoardBtn: cc.Button,
        continueBtn: cc.Button,
        newGameBtn: cc.Button
    },

    onLoad() {
        this._super();

        this.soundToggle.setCheck(GameData.instance.sound == 'true');

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
        this.bestScoreLabel.string = i18n.t('best_score') + ':' + bestScore;
    },

    onHome: function () {
        this.dismissImmediately();
        this.game.gotoHome();
    },

    onSound: function () {
        let soundOn = GameData.instance.sound;
        if (soundOn == 'true') {
            GameData.instance.sound = false;
            this.soundToggle.setCheck(false);
        } else {
            GameData.instance.sound = true;
            this.soundToggle.setCheck(true);
        }
    },

    onLeaderBoard: function () {

    },

    onContinue: function () {
        this.dismiss();
    },

    onNewGame: function () {
        this.dismiss();
        this.game.restartGame();
    },

    show: function (game) {
        this._super();
        this.game = game;
    }

    // update (dt) {},
});
