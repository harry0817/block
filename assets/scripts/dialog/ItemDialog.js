var BaseDialog = require('BaseDialog');
var Types = require('Types');

cc.Class({
    extends: BaseDialog,

    properties: {
        itemLabel: cc.Label,
        itemSprite: cc.Sprite,
        purchaseBtn: cc.Button,
        videoBtn: cc.Button,
    },

    onLoad() {
        this._super();
        this.purchaseBtn.node.on('click', this.onPurchase, this);
        this.videoBtn.node.on('click', this.onWatchVideo, this);
    },

    setItemLabel: function (text) {
        this.itemLabel.string = text;
    },

    setItemType: function (itemType) {
        this.itemType = itemType;
    },

    setBlock: function (block) {
        this.block = block;
    },

    setItemSprite: function (itemSpriteFrame) {
        let rect = itemSpriteFrame.getRect();
        let spWidth = rect.width;
        let spHeight = rect.height;
        let width;
        let height;
        if (spWidth > spHeight) {
            width = 300;
            height = width * spHeight / spWidth;
        } else {
            height = 300;
            width = height * spWidth / spHeight;
        }
        this.itemSprite.node.width = width;
        this.itemSprite.node.height = height;
        this.itemSprite.spriteFrame = itemSpriteFrame;
    },

    onPurchase: function () {
        //TODO
        this.onPurchaseResult(true);
        this.dismiss();
    },

    onWatchVideo: function () {
        //TODO
        onWatchVideoResult(true);
        this.dismiss();
    },

    onPurchaseResult: function (success) {
        this.onResult(success);
    },

    onWatchVideoResult: function (reward) {
        this.onResult(success);
    },

    onResult: function (success) {
        if (success) {
            switch (this.itemType) {
                case Types.ItemType.Bomb:
                    this.game.onBomb(this.block);
                    break;
                case Types.ItemType.Rocket:
                    this.game.onRocket(this.block);
                    break;
                case Types.ItemType.Refresh:
                    this.game.refreshNewBlock();
                    break;
                case Types.ItemType.Hammer:

                    break;
            }
        }
    },

    show: function (game) {
        this._super();
        this.game = game;
    },

    // update (dt) {},
});
