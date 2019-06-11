
var AdManager = cc.Class({
    properties: {
        statics: {
            default: null,
            instance: null
        },
    },

    ctor() {
        // this.loadAd();
    },

    loadAd: function () {
        console.log('FBInstant.getSupportedAPIs():' + FBInstant.getSupportedAPIs());

        FBInstant.getRewardedVideoAsync(
            '623450794796337_640112573130159', // Your Ad Placement Id
        ).then(function (rewarded) {
            // Load the Ad asynchronously
            this.preloadedRewardedVideo = rewarded;
            return this.preloadedRewardedVideo.loadAsync();
        }).then(function () {
            console.log('Rewarded video preloaded')
        }).catch(function (err) {
            console.error('Rewarded video failed to preload: ' + err.message);
        });
    },

    showRewardedVideo: function (callback) {
        if (this.preloadedRewardedVideo != undefined) {
            this.preloadedRewardedVideo.showAsync()
                .then(function () {
                    // Perform post-ad success operation
                    console.log('Rewarded video watched successfully');
                })
                .catch(function (e) {
                    console.error(e.message);
                });
        }
    },

})

AdManager.instance = new AdManager();
module.exports = AdManager;
