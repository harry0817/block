var GGManager = cc.Class({

    properties: {
        statics: {
            default: null,
            instance: null
        }
    },

    init() {
        if (this.hasInit) {
            return;
        }
        this.hasInit = true;
        console.log('GGManager init');
        this.loadInterAd();
        this.loadRewardedVideo();
    },

    loadInterAd: function () {
        console.log('loadInterAd');
        if (typeof FBInstant != 'undefined' && FBInstant.getSupportedAPIs().indexOf('getInterstitialAdAsync') != -1) {
            let self = this;
            FBInstant.getInterstitialAdAsync(
                '623450794796337_640113169796766',
            ).then(function (interstitial) {
                console.log('Get Interstitial')
                self.preloadedInterstitial = interstitial;
                return interstitial.loadAsync();
            }).then(function () {
                console.log('Interstitial preloaded')
            }).catch(function (err) {
                console.error('Interstitial failed to preload: ' + err.message);
            });
        } else {
            console.error('无法加载Interstitial');
        }
    },

    loadRewardedVideo: function () {
        console.log('loadRewardedVideo');
        if (typeof FBInstant != 'undefined' && FBInstant.getSupportedAPIs().indexOf('getRewardedVideoAsync') != -1) {
            let self = this;
            FBInstant.getRewardedVideoAsync(
                '623450794796337_640112573130159',
            ).then(function (rewarded) {
                console.log('Get Rewarded video')
                self.preloadedRewardedVideo = rewarded;
                return rewarded.loadAsync();
            }).then(function () {
                console.log('Rewarded video preloaded')
            }).catch(function (err) {
                console.error('Rewarded video failed to preload: ' + err.message);
            });
        } else {
            console.error('无法加载Rewarded video');
        }
    },

    showInterAd: function () {
        console.log('showInterAd');
        if (typeof FBInstant != 'undefined' && this.preloadedInterstitial != null) {
            let self = this;
            this.preloadedInterstitial.showAsync()
                .then(function () {
                    console.log('Interstitial ad finished successfully');
                    self.loadInterAd();
                })
                .catch(function (err) {
                    console.error(err.message);
                });
        }
    },

    showRewardedVideo: function () {
        console.log('showRewardedVideo');
        if (typeof FBInstant != 'undefined' && this.preloadedRewardedVideo != null) {
            let self = this;
            this.preloadedRewardedVideo.showAsync()
                .then(function () {
                    console.log('Rewarded Video finished successfully');
                    self.loadRewardedVideo();
                })
                .catch(function (err) {
                    console.error(err.message);
                });
        }
    },
})

GGManager.instance = new GGManager();
module.exports = GGManager;
