var HomeUI = require('HomeUI');
var GGManager = require('GGManager');

cc.Class({
    extends: cc.Component,

    properties: {
        homeUI: HomeUI,
        dialogPanel: cc.Node,
    },

    onLoad() {
        cc.sys.localStorage.clear();
        this.homeUI.init(this);
        cc.game.addPersistRootNode(this.dialogPanel);
        cc.director.preloadScene('Game');

        GGManager.instance.init();
    },

    playGame: function () {
        cc.director.loadScene('Game');
    }

});
