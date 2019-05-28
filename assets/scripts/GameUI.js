var GameData = require('GameData');
var Types = require('Types');

cc.Class({
    extends: cc.Component,

    properties: {
        //top
        pauseBtn: cc.Button,
        scoreLabel: cc.Label,
        giftBtn: cc.Button,
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
        this.pauseBtn.node.on('click', this.showPauseDialog, this);
        this.refreshbtn.node.on('click', this.onRefreshBtnClick, this);
        this.hammerBtn.node.on('click', this.onHammerBtnClick, this);

        this.coinLabel.string = GameData.instance.coinCount;
    },

    start() {

    },

    updateScore: function (score) {
        this.scoreLabel.string = score;
    },

    showPauseDialog: function () {
        let dialogNode = cc.instantiate(this.pauseDialogPrefab);
        let pauseDialog = dialogNode.getComponent('PauseDialog');
        pauseDialog.setScore(this.game.score);
        pauseDialog.setBestScore(GameData.instance.bestScore);
        pauseDialog.show(this.game);
    },

    showFailedDialog: function () {
        let dialogNode = cc.instantiate(this.failedDialogPrefab);
        let failedDialog = dialogNode.getComponent('FailedDialog');
        failedDialog.setScore(this.game.score);
        failedDialog.show(this.game);
    },

    showItemDialog: function (itemType, itemSpriteFrame) {
        let dialogNode = cc.instantiate(this.itemDialogPrefab);
        let itemDialog = dialogNode.getComponent('ItemDialog');
        itemDialog.setItemSprite(itemSpriteFrame);
        itemDialog.setItemType(itemType);
        itemDialog.show(this.game);
    },

    onRefreshBtnClick: function () {
        if (GameData.instance.refreshCount > 0) {
            GameData.instance.refreshCount--;
            this.game.refreshNewBlock();
        } else {
            this.showItemDialog(Types.ItemType.Refresh, this.rocketSpriteFrame);
        }
    },

    onHammerBtnClick: function () {
        if (GameData.instance.hammerCount > 0) {
            GameData.instance.hammerCount--;
            //TODO
        } else {
            this.showItemDialog(Types.ItemType.Hammer, this.hammerSpriteFrame);
        }
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
