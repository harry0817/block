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
        comboSpArr: [cc.SpriteFrame],
        //dialog prefab
        pauseDialogPrefab: cc.Prefab,
        failedDialogPrefab: cc.Prefab,
    },

    init(game) {
        this.game = game;
    },

    onLoad() {
        this.pauseBtn.node.on('click', this.showPauseDialog, this);
        this.refreshbtn.node.on('click', this.onRefreshBtnClick, this);
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
        pauseDialog.setBestScore(999);
        pauseDialog.show(this.game);
    },

    showFailedDialog: function () {
        let dialogNode = cc.instantiate(this.failedDialogPrefab);
        let dialog = dialogNode.getComponent('FailedDialog');
        dialog.show(this.game);

        dialogNode.once('dismiss', function (event) {

        }, this);
    },

    onRefreshBtnClick: function () {
        this.game.refreshNewBlock();
    },

    showCombo: function (comboCount) {
        console.log('comboCount:' + comboCount);

        if (comboCount >= 2) {
            let index = Math.min(this.comboSpArr.length - 1, comboCount - 2);
            this.comboSprite.node.active = true;
            this.comboSprite.spriteFrame = this.comboSpArr[index];
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
