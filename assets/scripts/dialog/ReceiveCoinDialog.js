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
    },

    setCoinCount: function (coinCount) {
        this.coinCount = coinCount;
        this.coinCountLabel.string = coinCount + '/10';
        this.receiveLabel.string = i18n.t('receive_coin_dialog.btn_receive').replace('{0}', coinCount);
        this.videoLabel.string = i18n.t('receive_coin_dialog.btn_reward').replace('{0}', coinCount + 'X10');
    },

    onReceive: function () {
        this.onReceiveCoin(this.coinCount);
        this.dismiss();
    },

    onWatchVideo: function () {
        console.log("onWatchVideo");
        let self = this;
        AdMng.instance.showRewardedVideo(function (rewarded) {
            if(rewarded){
                self.onReceiveCoin(10 * self.coinCount);
                self.dismiss();
            }
        });
       
    },

    onReceiveCoin: function (coinCount) {
        GameData.instance.coinCount += coinCount;
        GameData.instance.storedCoinCount = 0;
        this.game.gameUI.updateCoinCount();
        this.game.gameUI.updateStoredCoinCount();
    },

    show: function (game) {
        this._super();
        this.game = game;
    },

    // update (dt) {},
});
