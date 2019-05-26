var HomeUI = require('HomeUI');
var GameData = require('GameData');

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

    start() {

    },

    playGame: function () {
        cc.director.loadScene('Game');
    }

    // update (dt) {},
});
