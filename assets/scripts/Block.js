cc.Class({
    extends: cc.Component,

    properties: {
        bgSprite: cc.Sprite,
        pointLabel: cc.Label,
        bomb: cc.Node,
        rocket: cc.Node,
        btn: cc.Button,
        point: 0,
        row: -1,
        col: -1,
        hasBomb: false,
        hasRocket: false
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
        this.pointLabel.string = point;
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

    onClick: function () {
        if (this.hasBomb) {
            this.game.onBomb(this);
        } else if (this.hasRocket) {
            this.game.onRocket(this);
        }
    },

    toString: function () {
        return '(' + this.row + ',' + this.col + ')';
    }

    // update (dt) {},
});
