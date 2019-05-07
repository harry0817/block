
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

        this.generateBlock();
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
                if (this.newBlockNode != null) {
                    let col = this.convertPositionToCol(this.gamePanel.convertToNodeSpaceAR(event.getLocation()));
                    let position = this.convertIndexToPosition(this.rowCount, col);
                    this.newBlockNode.setPosition(position.x, position.y);
                }

                break;
            case cc.Node.EventType.TOUCH_END:
            case cc.Node.EventType.TOUCH_CANCEL:
                console.log("cancel");
                if (this.newBlockNode != null) {
                    this.settleBlock(this.newBlockNode);
                    this.newBlockNode = null;
                }
                break;
        }
    },

    settleBlock: function (blockNode) {
        let block = blockNode.getComponent('Block');
        let col = this.convertPositionToCol(blockNode.getPosition());
        let lastBlockThisCol = this.blockArr[this.rowCount - 1][col];
        if (lastBlockThisCol != null && lastBlockThisCol.point != (block.point)) {
            //游戏失败
        } else {
            let row = -1;
            for (let i = 0; i < this.rowCount; i++) {
                if (this.blockArr[i][col] == null) {
                    row = i;
                    break;
                }
            }
            this.blockArr[row][col] = block;
            block.row = row;
            block.col = col;
            let position = this.convertIndexToPosition(row, col);
            let action = cc.moveTo(this.moveDuration, position);
            blockNode.runAction(action);
            //
            this.scheduleOnce(function () {

                this.combineBlock(blockNode, row, col);
            }, this.moveDuration);
        }
    },

    combineBlock: function (blockNode, row, col) {
        console.log('combineBlock:' + row + ',' + col);
        let block = blockNode.getComponent('Block');
        let combineBlockArr = [];
        let targetBlock = null;
        let finalPoint = block.point;
        if (row > 0 && this.blockArr[row - 1][col] != null) {//上
            if (this.blockArr[row - 1][col].point == block.point) {
                console.log('上');
                targetBlock = this.blockArr[row - 1][col];
                combineBlockArr.push(block);
                finalPoint *= 2;
            }
        }
        if (col > 0 && this.blockArr[row][col - 1] != null) {//左
            if (this.blockArr[row][col - 1].point == block.point) {
                console.log('左');
                targetBlock = block;
                combineBlockArr.push(this.blockArr[row][col - 1]);
                finalPoint *= 2;
            }
        }
        if (col < this.colCount - 1 && this.blockArr[row][col + 1] != null) {//右
            if (this.blockArr[row][col + 1].point == block.point) {
                console.log('右');
                targetBlock = block;
                combineBlockArr.push(this.blockArr[row][col + 1]);
                finalPoint *= 2;
            }
        }

        if (combineBlockArr.length > 0) {//可以合并
            let targetPosition = this.convertIndexToPosition(targetBlock.row, targetBlock.col);
            let action = cc.moveTo(this.moveDuration, targetPosition);
            for (let i = 0; i < combineBlockArr.length; i++) {
                let block = combineBlockArr[i];
                block.node.runAction(action);
            }
            this.scheduleOnce(function () {
                targetBlock.setPoint(finalPoint);
                combineBlockArr.forEach(block => {
                    let row = block.row;
                    let col = block.col;
                    this.blockArr[row][col] = null;
                    block.node.destroy();
                });
                // this.combineBlock(blockNode, row, col);
            }, this.moveDuration);

        } else {
            this.generateBlock();
        }
    },

    /**
     * gamePanel中的position转换为列数
     */
    convertPositionToCol: function (position) {
        let positionInPlayAreaX = position.x - this.paddingLeft;
        positionInPlayAreaX = Math.max(0, positionInPlayAreaX);
        positionInPlayAreaX = Math.min(this.gamePanel.width - this.paddingLeft - this.paddingRight, positionInPlayAreaX);
        let col = Math.ceil(positionInPlayAreaX / this.blockSize.x) - 1;
        col = Math.max(0, col);
        return col;
    },

    /**
     * 行列数转换为gamePanel中的position
     */
    convertIndexToPosition: function (row, col) {
        let x = this.paddingLeft + this.blockSize.x / 2 + col * this.blockSize.x;
        let y = -this.blockSize.y / 2 - row * this.blockSize.y;
        return new cc.Vec2(x, y);
    },

    generateBlock: function () {
        let point = this.randomPoint();
        let blockNode = cc.instantiate(this.blockPrefab);
        blockNode.width = this.blockSize.x;
        blockNode.height = this.blockSize.y;
        this.gamePanel.addChild(blockNode);
        let position = this.convertIndexToPosition(this.rowCount, Math.floor(this.colCount / 2));
        blockNode.setPosition(position);

        let block = blockNode.getComponent("Block");
        block.setPoint(point);
        this.newBlockNode = blockNode;
    },

    randomPoint: function () {
        let exponent = Utils.randomNum(3);
        return Math.pow(2, exponent);
    },

    // update (dt) {},
});
