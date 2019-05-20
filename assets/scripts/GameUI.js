

cc.Class({
    extends: cc.Component,

    properties: {
        pauseBtn: cc.Button,
        scoreLabel: cc.Label,
        pauseDialogPrefab: cc.Prefab
    },

    init(game) {
        this.game = game;
    },

    onLoad() {
        this.pauseBtn.node.on('click', this.showPauseDialog, this);
    },

    start() {

    },

    updateScore: function (score) {
        this.scoreLabel.string = score;
    },

    showPauseDialog: function () {
        let dialogNode = cc.instantiate(this.pauseDialogPrefab);
        let dialog = dialogNode.getComponent('PauseDialog');
        dialog.show(this.game);

        dialogNode.once('dismiss', function (event) {
            
        }, this);
    }

    // update (dt) {},
});
