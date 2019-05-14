
cc.Class({
    extends: cc.Component,

    properties: {
        dialogCanvas: cc.Node,
        dialogPrefab: cc.Prefab
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

        // let dialogNode = cc.instantiate(this.dialogPrefab);
        // let dialog = dialogNode.getComponent('BaseDialog');
        // dialog.show();

        // dialogNode.once('dismiss', function (event) {
        //     console.log('dismiss');
        // }, this);
    }

    // update (dt) {},
});
