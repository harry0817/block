var BaseDialog = require('BaseDialog');
var i18n = require('LanguageData');
var GameData = require('GameData');
var AdMng = require('AdMng');

cc.Class({
    extends: BaseDialog,

    properties: {
        coinCountLabel: cc.Label,
        receiveBtn: cc.Button,
        receiveLabel: cc.Label,
        videoBtn: cc.Button,
        videoLabel: cc.Label,
    },

    onLoad() {
        this._super();
        this.receiveBtn.node.on('click', this.onReceive, this);
        this.videoBtn.node.on('click', this.onWatchVideo, this);
        this.setCoinCount(30);
    },

    setCoinCount: function (coinCount) {
        this.coinCount = coinCount;
        this.coinCountLabel.string = 'x' + coinCount;
        this.receiveLabel.string = i18n.t('btn_receive').replace('{0}', coinCount);
        this.videoLabel.string = i18n.t('btn_reward').replace('{0}', coinCount + 'x3');
    },

    onReceive: function () {
        this.onReceiveCoin(this.coinCount);
        this.dismiss();
    },

    onWatchVideo: function () {
        console.log("onWatchVideo");
        let self = this;
        AdMng.instance.showRewardedVideo(function (rewarded) {
            if (rewarded) {
                self.onReceiveCoin(3 * self.coinCount);
                self.dismiss();
            }
        });
    },

    onReceiveCoin: function (coinCount) {
        GameData.instance.coinCount += coinCount;
        this.home.homeUI.updateCoinCount();
    },

    show: function (home) {
        this._super();
        this.home = home;
    },

    // update (dt) {},
});
