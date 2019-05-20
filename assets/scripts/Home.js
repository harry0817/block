
cc.Class({
    extends: cc.Component,

    properties: {
        bg: cc.Node,
        dialogPanel: cc.Node,
    },

    onLoad() {
        let canvas = cc.find('Canvas');
        console.log('canvas:' + canvas.getContentSize());
        cc.game.addPersistRootNode(this.dialogPanel);
        cc.director.preloadScene('Game');
    },

    start() {

    },

    startGame: function () {
        cc.director.loadScene('Game');
    }

    // update (dt) {},
});
