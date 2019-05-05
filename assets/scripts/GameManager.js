
cc.Class({
    extends: cc.Component,

    properties: {
        gamePanel: {
            default: null,
            type: cc.Node
        },
        blockPrefab: {
            default: null,
            type: cc.Prefab
        }
    },

    // onLoad () {},

    start() {
        var node = cc.instantiate(this.blockPrefab);
        node.parent = this.gamePanel;
    
    },

    // update (dt) {},
});
