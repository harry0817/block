
var Utils = require('Utils');

cc.Class({
    extends: cc.Component,

    properties: {
        colCount: 5,
        rowCount: 7,
        paddingLeft: 0,
        paddingRight: 0,
        blockSize: {
            default: new cc.Vec2(),
            type: cc.Vec2
        },
        blockSizeRatio: {
            default: new cc.Vec2(),
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
        this.tempSettlingBlockArr = new Array();
        this.tempSettlingActionArr = new Array();
        this.tempCombiningBlockArr = new Array();
        this.tempCombiningActionArr = new Array();
        for (let i = 0; i < this.rowCount + 1; i++) {
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
                if (this.newBlock != null) {
                    let col = this.convertPositionToCol(this.gamePanel.convertToNodeSpaceAR(event.getLocation()));
                    let position = this.convertIndexToPosition(this.rowCount, col);
                    this.newBlock.node.setPosition(position.x, position.y);
                }

                break;
            case cc.Node.EventType.TOUCH_END:
            case cc.Node.EventType.TOUCH_CANCEL:
                if (this.newBlock != null) {
                    console.log("cancel");
                    let col = this.convertPositionToCol(this.newBlock.node.getPosition());
                    let lastBlockThisCol = this.blockArr[this.rowCount - 1][col];
                    if (lastBlockThisCol != null && lastBlockThisCol.point != (this.newBlock.point)) {
                        //游戏失败
                        console.log('游戏失败');
                    } else {
                        this.blockArr[this.blockArr.length - 1][col] = this.newBlock;
                        this.newBlock.row = this.blockArr.length - 1;
                        this.newBlock.col = col;
                        this.settleBlock();
                    }
                    this.newBlock = null;
                }
                break;
        }
    },

    settleBlock: function () {
        console.log('settleBlock');
        this.tempSettlingBlockArr.splice(0, this.tempSettlingBlockArr.length);
        this.tempSettlingActionArr.splice(0, this.tempSettlingActionArr.length);
        for (let col = 0; col < this.blockArr[0].length; col++) {
            let emptyRow = -1;
            for (let row = 0; row < this.blockArr.length; row++) {
                let block = this.blockArr[row][col];
                if (emptyRow == -1) {
                    if (block == null) {
                        emptyRow = row;
                        console.log('第' + row + '行,第' + col + '列空');

                    }
                } else {
                    if (block != null) {
                        this.tempSettlingBlockArr.push(block);
                        let movingAction = this.generateAction(block, emptyRow, col);
                        this.tempSettlingActionArr.push(movingAction);
                        console.log('tempSettlingActionArr:' + this.tempSettlingActionArr.length);
                        break;
                    }
                }
            }
        }

        if (this.tempSettlingActionArr.length > 0) {
            for (let i = 0; i < this.tempSettlingActionArr.length; i++) {
                let movingAction = this.tempSettlingActionArr[i];
                let block = movingAction.block;
                this.blockArr[block.row][block.col] = null;
                this.blockArr[movingAction.toRow][movingAction.toCol] = block;
                block.row = movingAction.toRow;
                block.col = movingAction.toCol;
                let position = this.convertIndexToPosition(movingAction.toRow, movingAction.toCol);
                let action = cc.moveTo(this.moveDuration, position);
                block.node.runAction(action);
            }
            this.scheduleOnce(function () {
                this.combineBlock();
            }, this.moveDuration);
        } else {
            this.combineBlock();
        }
    },

    generateAction: function (block, row, col, upgrade = false, point = 0) {
        let movingAction = new Object();
        movingAction.block = block;
        movingAction.toRow = row;
        movingAction.toCol = col;
        movingAction.upgrade = upgrade;
        movingAction.point = point;
        return movingAction;
    },

    combineBlock: function () {
        console.log('combineBlock');
        let tempMovingBlockArr = this.tempSettlingBlockArr.concat(this.tempCombiningBlockArr);
        let tempCombiningBlockMap = new Map();
        console.log('tempMovingBlockArr:' + tempMovingBlockArr.length);

        this.tempCombiningBlockArr.splice(0, this.tempCombiningBlockArr.length);
        this.tempCombiningActionArr.splice(0, this.tempCombiningActionArr.length);
        for (let i = 0; i < tempMovingBlockArr.length; i++) {
            let block = tempMovingBlockArr[i];
            let row = block.row;
            let col = block.col;
            if (row > 0 && this.blockArr[row - 1][col] != null) {//上
                if (this.blockArr[row - 1][col].point == block.point) {
                    console.log('上');
                    let movingAction = this.generateAction(block, row - 1, col);
                    this.tempCombiningActionArr.push(movingAction);
                    //TODO

                }
            } else {
                if (col > 0 && this.blockArr[row][col - 1] != null) {//左
                    if (this.blockArr[row][col - 1].point == block.point) {
                        console.log('左');
                        let movingAction = this.generateAction(this.blockArr[row][col - 1], row, col);
                        this.tempCombiningActionArr.push(movingAction);
                    }
                }
                if (col < this.colCount - 1 && this.blockArr[row][col + 1] != null) {//右
                    if (this.blockArr[row][col + 1].point == block.point) {
                        console.log('右');
                        let movingAction = this.generateAction(this.blockArr[row][col + 1], row, col);
                        this.tempCombiningActionArr.push(movingAction);
                    }
                }
            }
        }

        if (this.tempCombiningActionArr.length > 0) {
            //生成加分action
            for (let i = 0; i < this.tempCombiningActionArr.length; i++) {
                let action = this.tempCombiningActionArr[i];
                let targetBlock = this.blockArr[action.toRow][action.toCol];
                if (tempCombiningBlockMap.has(targetBlock)) {
                    let action = tempCombiningBlockMap.get(targetBlock);
                    action.point = 2 * action.point;
                } else {
                    let action = this.generateAction(targetBlock, targetBlock.row, targetBlock.col, true, targetBlock.point * 2);
                    tempCombiningBlockMap.set(targetBlock, action);
                }
            }
            let self = this;
            tempCombiningBlockMap.forEach(function (value, key) {
                self.tempCombiningActionArr.push(value);
            }, tempCombiningBlockMap);

            for (let i = 0; i < this.tempCombiningActionArr.length; i++) {
                let movingAction = this.tempCombiningActionArr[i];
                let block = movingAction.block;
                this.tempCombiningBlockArr.push(block);
                if (movingAction.upgrade) {//加分
                    this.scheduleOnce(function () {
                        block.setPoint(movingAction.point);
                    }, this.moveDuration);
                } else {//移动
                    let position = this.convertIndexToPosition(movingAction.toRow, movingAction.toCol);
                    let action = cc.moveTo(this.moveDuration, position);
                    block.node.runAction(action);
                    this.scheduleOnce(function () {
                        this.blockArr[block.row][block.col] = null;
                        block.node.destroy();
                    }, this.moveDuration);
                }
            }
            this.scheduleOnce(function () {
                this.settleBlock();
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
        this.newBlock = block;
    },

    randomPoint: function () {
        let exponent = Utils.randomNum(3);
        return Math.pow(2, exponent);
    },

    // update (dt) {},
});
