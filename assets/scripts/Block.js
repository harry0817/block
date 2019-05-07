
cc.Class({
    extends: cc.Component,

    properties: {
        bgSprite: {
            default: null,
            type: cc.Sprite
        },
        pointLabel: {
            default: null,
            type: cc.Label
        },
        point: {
            default: 0
        },
        row: -1,
        col: -1
    },

    // onLoad () {},

    start() {

    },

    setPoint: function (point) {
        this.point = point;
        this.pointLabel.string = point;
    },

    setBgSprite: function (texture) {
        this.bgSprite.texture = texture;
    }

    // update (dt) {},
});
