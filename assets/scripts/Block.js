
cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
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
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },

    setPoint: function (point) {
        this.point = point;
        this.pointLabel.string = point;
    }

    // update (dt) {},
});
