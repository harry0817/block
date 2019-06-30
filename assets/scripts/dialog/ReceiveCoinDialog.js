var BaseDialog = require('BaseDialog');
var i18n = require('LanguageData');
var GameData = require('GameData');

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
        this.receiveLabel.string = i18n.t('receive_coin_dialog.btn_receive').replace('%s', coinCount);
        this.videoLabel.string = i18n.t('receive_coin_dialog.btn_reward').replace('%s', coinCount + 'X10');
    },

    onReceive: function () {
        this.onReceiveCoin(this.coinCount);
        this.dismiss();
    },

    onWatchVideo: function () {
        var preloadedRewardedVideo = null;

        FBInstant.getRewardedVideoAsync(
            '623450794796337_640112573130159', // Your Ad Placement Id
        ).then(function (rewarded) {
            // Load the Ad asynchronously
            preloadedRewardedVideo = rewarded;
            return preloadedRewardedVideo.loadAsync();
        }).then(function () {
            console.log('Rewarded video preloaded');
            preloadedRewardedVideo.showAsync()
                .then(function () {
                    // Perform post-ad success operation
                    console.log('Rewarded video watched successfully');
                    this.onReceiveCoin(10 * this.coinCount);
                    this.dismiss();
                })
                .catch(function (e) {
                    console.error(e.message);
                });

        }).catch(function (err) {
            console.error('Rewarded video failed to preload: ' + err.message);
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
