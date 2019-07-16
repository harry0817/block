var BaseDialog = require('BaseDialog');
var Types = require('Types');
var i18n = require('LanguageData');
var GameData = require('GameData');
var AdManager = require('AdManager');

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

    setBlock: function (block) {
        this.block = block;
    },

    setItemType: function (itemType) {
        this.itemType = itemType;
        switch (this.itemType) {
            case Types.ItemType.Bomb:
                this.itemLabel.string = i18n.t('item.bomb') + ' x1';
                break;
            case Types.ItemType.Rocket:
                this.itemLabel.string = i18n.t('item.rocket') + ' x1';
                break;
            case Types.ItemType.Refresh:
                this.itemLabel.string = i18n.t('item.refresh') + ' x1';
                break;
            case Types.ItemType.Hammer:
                this.itemLabel.string = i18n.t('item.hammer') + ' x1';
                break;
        }
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
        // if (GameData.instance.coinCount >= 30) {
        //     GameData.instance.coinCount -= 30;
        //     this.onPurchaseResult(true);
        //     this.game.gameUI.updateCoinCount();
        //     this.dismiss();
        // } else {
        //     //TODO 提示金币不足

        // }

        this.onPurchaseResult(true);
        this.dismiss();
    },

    onWatchVideo: function () {
        //TODO
        AdManager.instance.showRewardedVideo();
        
        this.onWatchVideoResult(true);
        this.dismiss();
    },

    onPurchaseResult: function (success) {
        this.onResult(success);
    },

    onWatchVideoResult: function (reward) {
        this.onResult(reward);
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
                    GameData.instance.refreshCount++;
                    this.game.gameUI.updateItemCount();
                    break;
                case Types.ItemType.Hammer:
                    GameData.instance.hammerCount++;
                    this.game.gameUI.updateItemCount();
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
