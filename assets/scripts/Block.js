cc.Class({
    extends: cc.Component,

    properties: {
        bgSprite: cc.Sprite,
        pointLabel: cc.Label,
        bomb: cc.Node,
        rocket: cc.Node,
        coin: cc.Node,
        btn: cc.Button,
        /**
         * >0:方块
         * =0:空
         * -1:金币
         */
        point: 0,
        row: -1,
        col: -1,
        hasBomb: false,
        hasRocket: false,
        isCoin: false,
    },

    onLoad() {
        this.combineBlockArr = [];
    },

    start() {

    },

    init(game) {
        this.game = game;
    },

    setPoint: function (point) {
        this.point = point;
        if (point > 0) {
            this.pointLabel.string = point;
        }
    },

    setBgSpriteFrame: function (spriteFrame) {
        this.bgSprite.spriteFrame = spriteFrame;
    },

    pushCombineBlock: function (block) {
        this.combineBlockArr.push(block);
    },

    clearCombineBlock: function () {
        this.combineBlockArr.splice(0, this.combineBlockArr.length);
    },

    setBomb: function (show) {
        this.btn.enabled = show;
        this.hasBomb = show;
        this.bomb.active = show;
    },

    setRocket: function (show) {
        this.btn.enabled = show;
        this.hasRocket = show;
        this.rocket.active = show;
    },

    setHammerEnabled(enabled) {
        this.btn.enabled = enabled;
        this.hammerEnabled = enabled;
    },

    setCoin: function () {
        this.isCoin = true;
        this.coin.active = true;
    },

    onClick: function () {
        if (this.hammerEnabled) {
            this.game.onHammer(this);
        } else if (this.hasBomb) {
            this.game.onBombClick(this);
        } else if (this.hasRocket) {
            this.game.onRocketClick(this);
        }
    },

    toString: function () {
        return '(' + this.row + ',' + this.col + ')';
    }

    // update (dt) {},
});
