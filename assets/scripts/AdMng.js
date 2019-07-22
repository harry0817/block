var AdMng = cc.Class({

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
        console.log('AdMng init');
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
                console.log('Interstitial 获取')
                self.preloadedInterstitial = interstitial;
                return interstitial.loadAsync();
            }).then(function () {
                console.log('Interstitial 加载成功')
            }).catch(function (err) {
                console.error('Interstitial 加载失败: ' + err.message);
            });
        } else {
            console.error('Interstitial 无法加载');
        }
    },

    loadRewardedVideo: function () {
        console.log('loadRewardedVideo');
        if (typeof FBInstant != 'undefined' && FBInstant.getSupportedAPIs().indexOf('getRewardedVideoAsync') != -1) {
            let self = this;
            FBInstant.getRewardedVideoAsync(
                '623450794796337_640112573130159',
            ).then(function (rewarded) {
                console.log('Rewarded video 获取')
                self.preloadedRewardedVideo = rewarded;
                return rewarded.loadAsync();
            }).then(function () {
                console.log('Rewarded video 加载成功')
            }).catch(function (err) {
                console.error('Rewarded video 加载失败: ' + err.message);
            });
        } else {
            console.error('Rewarded video 无法加载');
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

    showRewardedVideo: function (callback) {
        console.log('showRewardedVideo');
        if (callback != undefined) {
            callback(true);
        }
        if (typeof FBInstant != 'undefined' && this.preloadedRewardedVideo != null) {
            let self = this;
            this.preloadedRewardedVideo.showAsync()
                .then(function () {
                    console.log('Rewarded Video finished successfully');
                    if (callback != undefined) {
                        callback(true);
                    }
                    self.loadRewardedVideo();
                })
                .catch(function (err) {
                    console.error(err.message);
                    if (callback != undefined) {
                        callback(false);
                    }
                });
        }
    },
})

AdMng.instance = new AdMng();
module.exports = AdMng;
