var GameData = require('GameData');
var Types = require('Types');

cc.Class({
    extends: cc.Component,

    properties: {
        //top
        pauseBtn: cc.Button,
        scoreLabel: cc.Label,
        giftBtn: cc.Button,
        storedCoinLabel: cc.Label,
        //bottom
        coinLabel: cc.Label,
        hammerBtn: cc.Button,
        hammerCountLabel: cc.Label,
        refreshbtn: cc.Button,
        refreshCountLabel: cc.Label,
        //game
        combo: cc.Node,
        comboSprite: cc.Sprite,
        comboSpriteFrameArr: [cc.SpriteFrame],
        //dialog prefab
        pauseDialogPrefab: cc.Prefab,
        receiveCoinDialogPrefab: cc.Prefab,
        failedDialogPrefab: cc.Prefab,
        itemDialogPrefab: cc.Prefab,
        bombSpriteFrame: cc.SpriteFrame,
        rocketSpriteFrame: cc.SpriteFrame,
        refreshSpriteFrame: cc.SpriteFrame,
        hammerSpriteFrame: cc.SpriteFrame,
    },

    init(game) {
        this.game = game;
    },

    onLoad() {
        this.initView();
        this.initListener();
    },

    initView: function () {
        this.updateCoinCount();
        this.updateItemCount();
        this.updateStoredCoinCount();
    },

    initListener: function () {
        this.pauseBtn.node.on('click', this.showPauseDialog, this);
        this.giftBtn.node.on('click', this.showReceiveCoinDialog, this);
        this.refreshbtn.node.on('click', this.onRefreshBtnClick, this);
        this.hammerBtn.node.on('click', this.onHammerBtnClick, this);
    },

    updateCoinCount: function () {
        this.coinLabel.string = GameData.instance.coinCount;
    },

    updateItemCount: function () {
        this.hammerCountLabel.string = GameData.instance.hammerCount;
        this.refreshCountLabel.string = GameData.instance.refreshCount;
    },

    updateScore: function (score) {
        this.scoreLabel.string = score;
    },

    updateStoredCoinCount: function () {
        this.storedCoinLabel.string = GameData.instance.storedCoinCount + '/10';
    },

    showPauseDialog: function () {
        let dialogNode = cc.instantiate(this.pauseDialogPrefab);
        let pauseDialog = dialogNode.getComponent('PauseDialog');
        pauseDialog.setScore(this.game.score);
        pauseDialog.setBestScore(GameData.instance.bestScore);
        pauseDialog.show(this.game);
    },

    showReceiveCoinDialog: function () {
        let dialogNode = cc.instantiate(this.receiveCoinDialogPrefab);
        let receiveCoinDialog = dialogNode.getComponent('ReceiveCoinDialog');
        receiveCoinDialog.setCoinCount(GameData.instance.storedCoinCount);
        receiveCoinDialog.show(this.game);
    },

    showFailedDialog: function () {
        let dialogNode = cc.instantiate(this.failedDialogPrefab);
        let failedDialog = dialogNode.getComponent('FailedDialog');
        failedDialog.setScore(this.game.score);
        failedDialog.show(this.game);
    },

    showItemDialog: function (itemType) {
        let dialogNode = cc.instantiate(this.itemDialogPrefab);
        let itemDialog = dialogNode.getComponent('ItemDialog');
        itemDialog.setItemType(itemType);
        switch (itemType) {
            case Types.ItemType.Bomb:
                itemDialog.setItemSprite(this.bombSpriteFrame);
                break;
            case Types.ItemType.Rocket:
                itemDialog.setItemSprite(this.rocketSpriteFrame);
                break;
            case Types.ItemType.Refresh:
                itemDialog.setItemSprite(this.refreshSpriteFrame);
                break;
            case Types.ItemType.Hammer:
                itemDialog.setItemSprite(this.hammerSpriteFrame);
                break;
        }
        itemDialog.show(this.game);
    },

    /**
     * 刷新
     */
    onRefreshBtnClick: function () {
        this.game.refreshNewBlock();
    },

    /**
     * 锤子
     */
    onHammerBtnClick: function () {
        this.game.setHammerEnabled(true);
    },

    showCombo: function (comboCount) {
        console.log('comboCount:' + comboCount);

        if (comboCount >= 2) {
            let index = Math.min(this.comboSpriteFrameArr.length - 1, comboCount - 2);
            this.comboSprite.node.active = true;
            this.comboSprite.spriteFrame = this.comboSpriteFrameArr[index];
            this.comboSprite.node.opacity = 0;
            let fadeIn = cc.fadeIn(0.5);
            let fadeOut = cc.fadeOut(0.5);
            let action = cc.sequence(
                fadeIn,
                cc.delayTime(2),
                fadeOut, cc.callFunc(function () {
                    this.comboSprite.active = false;
                }, this));
            this.comboSprite.node.runAction(action);
        }
    },

    // update (dt) {},
});
