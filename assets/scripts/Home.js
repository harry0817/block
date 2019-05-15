
cc.Class({
    extends: cc.Component,

    properties: {
        dialogCanvas: cc.Node,
    },

    onLoad() {
        cc.game.addPersistRootNode(this.dialogCanvas);
        let childNodeArr = this.dialogCanvas.children;
        for (let i = 0; i < childNodeArr.length; i++) {

            // cc.game.addPersistRootNode(childNodeArr[i]);

        }
    },

    start() {

    },

    startGame: function () {
        cc.director.loadScene("Game");
    }

    // update (dt) {},
});
