var BlockState = require('BlockState');

cc.Class({
    extends: cc.Component,

    properties: {
        bgSprite: cc.Sprite,
        pointLabel: cc.Label,
        point: 0,
        row: -1,
        col: -1,
        state: {
            default: BlockState.STATE.NORMAL,
            type: cc.Enum(BlockState.STATE)
        }
    },

    // onLoad () {},

    start() {

    },

    setPoint: function (point) {
        this.point = point;
        this.pointLabel.string = point;
    },

    setBgSpriteFrame: function (spriteFrame) {
        this.bgSprite.spriteFrame = spriteFrame;
    }

    // update (dt) {},
});
