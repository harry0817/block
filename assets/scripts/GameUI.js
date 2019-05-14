

cc.Class({
    extends: cc.Component,

    properties: {
        pauseBtn: cc.Button,
        scoreLabel: cc.Label,
    },

    onLoad() {

    },

    start() {

    },

    updateScore: function (score) {
        this.scoreLabel.string = score;
    },


    // update (dt) {},
});
