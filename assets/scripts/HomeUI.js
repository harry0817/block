var GameData = require('GameData');
var Toggle = require('Toggle');
const i18n = require('LanguageData');
i18n.init(cc.sys.language);

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
        dailyRewardDialogPrefab: cc.Prefab
    },

    init(home) {
        this.home = home;
        this.initView();
        this.initListener();
    },

    initView: function () {
        this.updateScoreLabel();
        this.updateCoinCount();
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

    updateScoreLabel: function () {
        let bestScore = GameData.instance.bestScore;
        this.bestScore.active = bestScore > 0;
        this.bestScoreLabel.string = i18n.t('best_score') + ':' + GameData.instance.bestScore;
    },

    updateCoinCount: function () {
        this.coinLabel.string = GameData.instance.coinCount;
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

    },

    showDailyRewardDialog : function () {
        let dialogNode = cc.instantiate(this.dailyRewardDialogPrefab);
        let dailyRewardDialog = dialogNode.getComponent('DailyRewardDialog');
        dailyRewardDialog.show(this.home);
    },

    // update (dt) {},
});
