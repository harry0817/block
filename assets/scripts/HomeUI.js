var GameData = require('GameData');
var i18n = require('LanguageData');

cc.Class({
    extends: cc.Component,

    properties: {
        coinLabel: cc.Label,
        bestScore: cc.Node,
        bestScoreLabel: cc.Label,
        playGameBtn: cc.Button,
        leaderBoardBtn: cc.Button,
        soundBtn: cc.Button,
        vibrationBtn: cc.Button,
        shareBtn: cc.Button,
    },

    init(home) {
        this.home = home;
    },

    onLoad() {
        i18n.init(cc.sys.language);
        this.initView();
        this.initListener();
    },

    start() {

    },

    initView: function () {
        let bestScore = GameData.instance.bestScore;
        this.bestScore.active = bestScore > 0;
        this.bestScoreLabel.string = i18n.t('best_score') + ':' + GameData.instance.bestScore;
        this.coinLabel.string = GameData.instance.coinCount;
    },

    initListener: function () {
        this.playGameBtn.node.on('click', this.onPlayGame, this);
        this.leaderBoardBtn.node.on('click', this.onLeaderBoard, this);
        this.soundBtn.node.on('click', this.onSound, this);
        this.vibrationBtn.node.on('click', this.onVibration, this);
        this.shareBtn.node.on('click', this.onShare, this);
    },

    onPlayGame: function () {
        this.home.playGame();
    },

    onLeaderBoard: function () {

    },

    onSound: function () {

    },

    onVibration: function () {

    },

    onShare: function () {

    }

    // update (dt) {},
});
