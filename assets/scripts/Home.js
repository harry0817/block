var HomeUI = require('HomeUI');

cc.Class({
    extends: cc.Component,

    properties: {
        homeUI: HomeUI,
        dialogPanel: cc.Node,
    },

    onLoad() {
        // cc.sys.localStorage.clear();
        this.homeUI.init(this);
        cc.game.addPersistRootNode(this.dialogPanel);
        cc.director.preloadScene('Game');
    },

    playGame: function () {
        cc.director.loadScene('Game');
    }

});
