var GameData = require('GameData');
var i18n = require('LanguageData');
var Toggle = require('Toggle');

cc.Class({
    extends: cc.Component,

    properties: {
        coinLabel: cc.Label,
        bestScore: cc.Node,
        bestScoreLabel: cc.Label,
        playGameBtn: cc.Button,
        leaderBoardBtn: cc.Button,
        soundBtn: cc.Button,
        soundToggle: Toggle,
        vibrationBtn: cc.Button,
        vibrationToggle: Toggle,
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

        console.log(GameData.instance.sound == 'true');

        this.soundToggle.setCheck(GameData.instance.sound == 'true');
        this.vibrationToggle.setCheck(GameData.instance.vibration == 'true');
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
        let soundOn = GameData.instance.sound;
        if (soundOn == 'true') {
            GameData.instance.sound = false;
            this.soundToggle.setCheck(false);
        } else {
            GameData.instance.sound = true;
            this.soundToggle.setCheck(true);
        }
    },

    onVibration: function () {
        let vibrationOn = GameData.instance.vibration;
        if (vibrationOn == 'true') {
            GameData.instance.vibration = false;
            this.vibrationToggle.setCheck(false);
        } else {
            GameData.instance.vibration = true;
            this.vibrationToggle.setCheck(true);
        }
    },

    onShare: function () {

    }

    // update (dt) {},
});
