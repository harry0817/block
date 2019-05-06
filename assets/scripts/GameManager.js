
var Utils = require('Utils');

cc.Class({
    extends: cc.Component,

    properties: {
        colCount: 5,
        rowCount: 7,
        paddingLeft: 0,
        paddingRight: 0,
        blockSize: {
            default: null,
            type: cc.Vec2
        },
        blockSizeRatio: {
            default: null,
            type: cc.Vec2
        },
        moveDuration: 1,
        gamePanel: {
            default: null,
            type: cc.Node
        },
        blockPrefab: {
            default: null,
            type: cc.Prefab
        }
    },

    onLoad() {
        this.initListener();
        this.blockArr = new Array();
        for (let i = 0; i < this.rowCount; i++) {
            this.blockArr[i] = new Array();
            for (let j = 0; j < this.colCount; j++) {
                this.blockArr[i][j] = null;
            }
        }
        this.blockSize.x = (this.gamePanel.width - this.paddingLeft - this.paddingRight) / 5;
        this.blockSize.y = this.blockSize.x * this.blockSizeRatio.y / this.blockSizeRatio.x;
        this.gamePanel.height = this.blockSize.y * 8;

        this.generateBlock(this.randomPoint());
    },

    start() {

    },

    initListener: function () {
        this.gamePanel.on(cc.Node.EventType.TOUCH_START, this.onGamePanelTouchEvent, this);
        this.gamePanel.on(cc.Node.EventType.TOUCH_MOVE, this.onGamePanelTouchEvent, this);
        this.gamePanel.on(cc.Node.EventType.TOUCH_END, this.onGamePanelTouchEvent, this);
        this.gamePanel.on(cc.Node.EventType.TOUCH_CANCEL, this.onGamePanelTouchEvent, this);
    },

    onGamePanelTouchEvent: function (event) {
        // console.log('getLocation:' + event.getLocation());
        // console.log('getLocationInView:' + event.getLocationInView());
        // console.log('convertToNodeSpace:' + this.gamePanel.convertToNodeSpace(event.getLocation()));
        // console.log('convertToNodeSpaceAR:' + this.gamePanel.convertToNodeSpaceAR(event.getLocation()));

        switch (event.type) {
            case cc.Node.EventType.TOUCH_START:
            case cc.Node.EventType.TOUCH_MOVE:
                if (this.currentBlockNode != null) {
                    var col = this.convertPositionToCol(this.gamePanel.convertToNodeSpaceAR(event.getLocation()));
                    var position = this.convertIndexToPosition(col, this.rowCount);
                    this.currentBlockNode.setPosition(position.x, position.y);
                }

                break;
            case cc.Node.EventType.TOUCH_END:
            case cc.Node.EventType.TOUCH_CANCEL:
                console.log("cancel");
                if (this.currentBlockNode != null) {
                    var col = this.convertPositionToCol(this.currentBlockNode.getPosition());
                    var row = -1;
                    for (let i = 0; i < this.rowCount; i++) {
                        if (this.blockArr[col][i] == null) {
                            row = i;
                            break;
                        }
                    }
                    if (row != -1) {
                        var position = this.convertIndexToPosition(col, row);
                        var action = cc.moveTo(this.moveDuration, position);
                        this.currentBlockNode.runAction(action);
                        this.currentBlockNode = null;
                    } else {
                        //游戏失败
                    }
                }
                break;
        }
    },

    /**
     * gamePanel中的position转换为列数
     */
    convertPositionToCol: function (position) {
        var positionInPlayAreaX = position.x - this.paddingLeft;
        positionInPlayAreaX = Math.max(0, positionInPlayAreaX);
        positionInPlayAreaX = Math.min(this.gamePanel.width - this.paddingLeft - this.paddingRight, positionInPlayAreaX);
        var col = Math.ceil(positionInPlayAreaX / this.blockSize.x) - 1;
        col = Math.max(0, col);
        return col;
    },

    /**
     * 行列数转换为gamePanel中的position
     */
    convertIndexToPosition: function (col, row) {
        var x = this.paddingLeft + this.blockSize.x / 2 + col * this.blockSize.x;
        var y = -this.blockSize.y / 2 - row * this.blockSize.y;
        return new cc.Vec2(x, y);
    },

    randomPoint: function () {
        var exponent = Utils.randomNum(5);
        return Math.pow(2, exponent);
    },

    generateBlock: function (point) {
        var blockNode = cc.instantiate(this.blockPrefab);
        blockNode.width = this.blockSize.x;
        blockNode.height = this.blockSize.y;
        this.gamePanel.addChild(blockNode);
        var position = this.convertIndexToPosition(Math.floor(this.colCount / 2), this.rowCount);
        blockNode.setPosition(position);

        var blockComp = blockNode.getComponent("Block");
        blockComp.setPoint(point);
        this.currentBlockNode = blockNode;
    },


    // update (dt) {},
});
