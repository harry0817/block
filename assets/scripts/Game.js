var Utils = require('Utils');
var GameUI = require('GameUI');
var BlockState = require('BlockState');

cc.Class({
    extends: cc.Component,

    properties: {
        gameUI: GameUI,
        colCount: 5,
        rowCount: 7,
        paddingLeft: 0,
        paddingRight: 0,
        paddingTop: 0,
        paddingBottom: 0,
        spacing: new cc.Vec2(),
        blockSizeRatio: new cc.Vec2(),
        normalMoveDuration: 0.2,
        emissionDuration: 0.05,
        blockPanel: cc.Node,
        blockPrefab: cc.Prefab,
        blockSpriteFrame: [cc.SpriteFrame]
    },

    ctor() {
        this.score = 0;
        this.comboCount = 0;
        this.blockArr = new Array();

        this.tempSettlingBlockArr = new Array();
        this.tempUpgradeBlockArr = new Array();
        //key:Block value:Action
        this.tempUpgradeBlockMap = new Map();
        this.tempRemovedBlockArr = new Array();
        this.tempActionArr = new Array();
        for (let i = 0; i < this.rowCount + 1; i++) {
            this.blockArr[i] = new Array();
            for (let j = 0; j < this.colCount; j++) {
                this.blockArr[i][j] = undefined;
            }
        }
    },

    onLoad() {
        this.initData();
        this.initListener();
        this.initView();
        this.generateBlock();

        let action = cc.sequence(
            cc.moveBy(1,100,100),
            cc.callFunc(function () {
                console.log('1');
                
            }, this)
        );
        let newAction = cc.sequence(action, cc.callFunc(function(){
            console.log('2');
            
        }, this));
        this.blockPanel.runAction(newAction);
    },

    initData: function () {

    },

    initListener: function () {
        this.blockPanel.on(cc.Node.EventType.TOUCH_START, this.onblockPanelTouchEvent, this);
        this.blockPanel.on(cc.Node.EventType.TOUCH_MOVE, this.onblockPanelTouchEvent, this);
        this.blockPanel.on(cc.Node.EventType.TOUCH_END, this.onblockPanelTouchEvent, this);
        this.blockPanel.on(cc.Node.EventType.TOUCH_CANCEL, this.onblockPanelTouchEvent, this);
    },

    initView: function () {
        this.gameUI.updateScore(this.score);
        this.blockSize = new cc.Vec2();
        this.blockSize.x = (this.blockPanel.width - this.paddingLeft - this.paddingRight) / this.colCount - this.spacing.x;
        this.blockSize.y = this.blockSize.x * this.blockSizeRatio.y / this.blockSizeRatio.x;
        this.blockPanel.height = this.paddingTop + this.paddingBottom + (this.rowCount + 1) * this.blockSize.y + this.rowCount * this.spacing.y;
        console.log('block:' + this.blockSize);
        console.log('blockPanel:(' + this.blockPanel.width + ',' + this.blockPanel.height + ')');
    },

    start() {

    },

    onblockPanelTouchEvent: function (event) {
        // console.log('getLocation:' + event.getLocation());
        // console.log('getLocationInView:' + event.getLocationInView());
        // console.log('convertToNodeSpace:' + this.blockPanel.convertToNodeSpace(event.getLocation()));
        // console.log('convertToNodeSpaceAR:' + this.blockPanel.convertToNodeSpaceAR(event.getLocation()));

        switch (event.type) {
            case cc.Node.EventType.TOUCH_START:
            case cc.Node.EventType.TOUCH_MOVE:
                if (this.newBlock != undefined) {
                    let col = this.convertPositionToCol(this.blockPanel.convertToNodeSpaceAR(event.getLocation()));
                    if (col != this.newBlock.col) {
                        let position = this.convertIndexToPosition(this.rowCount, col);
                        this.newBlock.node.setPosition(position.x, position.y);
                    }
                }

                break;
            case cc.Node.EventType.TOUCH_END:
            case cc.Node.EventType.TOUCH_CANCEL:
                if (this.newBlock != undefined) {
                    console.log("cancel");
                    let col = this.convertPositionToCol(this.newBlock.node.getPosition());
                    let lastBlockThisCol = this.blockArr[this.rowCount - 1][col];
                    if (lastBlockThisCol != undefined && lastBlockThisCol.point != (this.newBlock.point)) {
                        //游戏失败
                        console.log('游戏失败');
                    } else {
                        this.blockArr[this.newBlock.row][col] = this.newBlock;
                        this.newBlock.col = col;

                        this.settleBlock(true);
                        this.comboCount = 0;
                    }
                    this.newBlock = undefined;
                }
                break;
        }
    },

    settleBlock: function (emission = false) {
        console.log('settleBlock');
        this.tempActionArr.splice(0, this.tempActionArr.length);
        this.tempSettlingBlockArr.splice(0, this.tempSettlingBlockArr.length);
        for (let col = 0; col < this.blockArr[0].length; col++) {
            let emptyRow = -1;
            for (let row = 0; row < this.blockArr.length; row++) {
                let block = this.blockArr[row][col];
                if (emptyRow == -1) {
                    if (block == undefined) {
                        emptyRow = row;
                    }
                } else {
                    if (block != undefined) {
                        let movingAction = this.generateAction(block, emptyRow, col);
                        this.tempActionArr.push(movingAction);
                        this.tempSettlingBlockArr.push(block);
                        emptyRow = row;
                    }
                }
            }
        }

        if (this.tempActionArr.length > 0) {
            let duration;
            for (let i = 0; i < this.tempActionArr.length; i++) {
                let movingAction = this.tempActionArr[i];
                let block = movingAction.block;
                duration = emission ? (block.row - movingAction.toRow) * this.emissionDuration : this.normalMoveDuration;
                this.blockArr[block.row][block.col] = undefined;
                this.blockArr[movingAction.toRow][movingAction.toCol] = block;
                block.row = movingAction.toRow;
                block.col = movingAction.toCol;
                let position = this.convertIndexToPosition(movingAction.toRow, movingAction.toCol);
                let action;
                if (i == this.tempActionArr.length - 1) {
                    let finished = cc.callFunc(this.combineBlock, this);
                    action = cc.sequence(cc.moveTo(duration, position), finished);
                } else {
                    action = cc.moveTo(duration, position);
                }
                block.node.runAction(action);
            }
        } else {
            this.combineBlock();
        }
    },

    combineBlock: function () {
        console.log('combineBlock');
        this.comboCount++;
        let tempMovingBlockArr = this.tempSettlingBlockArr.concat(this.tempUpgradeBlockArr);
        this.tempActionArr.splice(0, this.tempActionArr.length);
        this.tempUpgradeBlockMap.clear();
        this.tempSettlingBlockArr.splice(0, this.tempSettlingBlockArr.length);
        this.tempUpgradeBlockArr.splice(0, this.tempUpgradeBlockArr.length);
        this.tempRemovedBlockArr.splice(0, this.tempRemovedBlockArr.length);

        for (let i = 0; i < tempMovingBlockArr.length; i++) {
            this.findCombineBlock(tempMovingBlockArr[i]);
        }

        if (this.tempActionArr.length > 0) {
            //生成加分action
            for (let i = 0; i < this.tempActionArr.length; i++) {
                let action = this.tempActionArr[i];
                let targetBlock = this.blockArr[action.toRow][action.toCol];
                if (this.tempUpgradeBlockMap.has(targetBlock)) {
                    let action = this.tempUpgradeBlockMap.get(targetBlock);
                    action.combineCount++;
                } else {
                    let action = this.generateAction(targetBlock, targetBlock.row, targetBlock.col, true);
                    this.tempUpgradeBlockMap.set(targetBlock, action);
                }
            }
            let self = this;
            this.tempUpgradeBlockMap.forEach(function (value, key) {
                self.tempActionArr.push(value);
            }, this.tempUpgradeBlockMap);

            for (let i = 0; i < this.tempActionArr.length; i++) {
                let movingAction = this.tempActionArr[i];
                let block = movingAction.block;
                let action;
                if (movingAction.upgrade) {//加分
                    // this.scheduleOnce(function () {
                    //     let point = block.point * Math.pow(2, movingAction.combineCount - 1);
                    //     block.setPoint(point);
                    //     block.setBgSpriteFrame(this.blockSpriteFrame[this.calculateIndex(point)]);
                    //     this.score += (this.comboCount > 1 ? point * 4 : point * 2);
                    //     this.gameUI.updateScore(this.score);
                    // }, this.normalMoveDuration);

                    let finished = cc.callFunc(function () {
                        let point = block.point * Math.pow(2, movingAction.combineCount - 1);
                        block.setPoint(point);
                        block.setBgSpriteFrame(this.blockSpriteFrame[this.calculateIndex(point)]);
                        this.score += (this.comboCount > 1 ? point * 4 : point * 2);
                        this.gameUI.updateScore(this.score);
                    }, this);
                    action = cc.sequence(cc.delayTime(this.normalMoveDuration), finished);
                } else {//移动
                    console.log('move');
                    let position = this.convertIndexToPosition(movingAction.toRow, movingAction.toCol);
                    let finished = cc.callFunc(function () {
                        console.log('destroy:' + block.row + ',' + block.col);
                        block.node.destroy();
                        this.blockArr[block.row][block.col] = undefined;
                    }, this);
                    action = cc.sequence(cc.moveTo(this.normalMoveDuration, position), finished);
                }
                let newAction;
                if (i == this.tempActionArr.length - 1) {
                    newAction = cc.sequence(action, cc.callFunc(this.settleBlock, this));
                } else {
                    newAction = action;
                }
                block.node.runAction(newAction);
            }
            // this.scheduleOnce(function () {
            //     this.settleBlock();
            // }, this.normalMoveDuration);
        } else {
            this.generateBlock();
        }
    },

    generateAction: function (block, toRow, toCol, upgrade = false) {
        let movingAction = new Object();
        movingAction.block = block;
        movingAction.toRow = toRow;
        movingAction.toCol = toCol;
        movingAction.upgrade = upgrade;
        movingAction.combineCount = upgrade ? 2 : 0;
        return movingAction;
    },

    findCombineBlock: function (block) {
        if (this.tempUpgradeBlockArr.indexOf(block) != -1 || this.tempRemovedBlockArr.indexOf(block) != -1) {
            return;
        }
        console.log('findCombineBlock:' + block.col + ',' + block.row);

        let row = block.row;
        let col = block.col;
        let topBlock = this.findTop(block);
        let leftBlock = this.findLeft(block);
        let rightBlock = this.findRight(block);
        if (topBlock != undefined && leftBlock == undefined && rightBlock == undefined) {//只有上方有
            console.log('只有上');
            let movingAction = this.generateAction(block, topBlock.row, topBlock.col);
            this.tempActionArr.push(movingAction);
            this.tempUpgradeBlockArr.push(topBlock);
            this.tempRemovedBlockArr.push(block);
        } else {
            if (topBlock != undefined) {//上
                console.log('上');
                let movingAction = this.generateAction(topBlock, row, col);
                this.tempActionArr.push(movingAction);
                if (this.tempUpgradeBlockArr.indexOf(block) == -1) {
                    this.tempUpgradeBlockArr.push(block);
                }
                this.tempRemovedBlockArr.push(topBlock);
            }
            if (leftBlock != undefined && this.tempUpgradeBlockArr.indexOf(leftBlock) == -1) {//左
                console.log('左');
                let movingAction = this.generateAction(leftBlock, row, col);
                this.tempActionArr.push(movingAction);
                if (this.tempUpgradeBlockArr.indexOf(block) == -1) {
                    this.tempUpgradeBlockArr.push(block);
                }
                this.tempRemovedBlockArr.push(leftBlock);
                //递归
                this.findCombineBlock(leftBlock);
            }
            if (rightBlock != undefined && this.tempUpgradeBlockArr.indexOf(rightBlock) == -1) {//右
                console.log('右');
                let movingAction = this.generateAction(rightBlock, row, col);
                this.tempActionArr.push(movingAction);
                if (this.tempUpgradeBlockArr.indexOf(block) == -1) {
                    this.tempUpgradeBlockArr.push(block);
                }
                this.tempRemovedBlockArr.push(rightBlock);
                //递归
                this.findCombineBlock(rightBlock);
            }
        }
    },

    findTop: function (block) {
        let row = block.row;
        let col = block.col;
        if (row > 0 && this.blockArr[row - 1][col] != undefined) {
            if (this.blockArr[row - 1][col].point == block.point) {
                return this.blockArr[row - 1][col];
            }
        }
        return undefined;
    },

    findLeft: function (block) {
        let row = block.row;
        let col = block.col;
        if (col > 0 && this.blockArr[row][col - 1] != undefined) {
            if (this.blockArr[row][col - 1].point == block.point) {
                return this.blockArr[row][col - 1];
            }
        }
        return undefined;
    },

    findRight: function (block) {
        let row = block.row;
        let col = block.col;
        if (col < this.colCount - 1 && this.blockArr[row][col + 1] != undefined) {
            if (this.blockArr[row][col + 1].point == block.point) {
                return this.blockArr[row][col + 1];
            }
        }
        return undefined;
    },

    /**
     * blockPanel中的position转换为列数
     */
    convertPositionToCol: function (position) {
        let positionInPlayAreaX = position.x - this.paddingLeft;
        positionInPlayAreaX = Math.max(0, positionInPlayAreaX);
        positionInPlayAreaX = Math.min(this.blockPanel.width - this.paddingLeft - this.paddingRight, positionInPlayAreaX);
        let col = Math.ceil(positionInPlayAreaX / (this.blockSize.x + this.spacing.x)) - 1;
        col = Math.max(0, col);
        return col;
    },

    /**
     * 行列数转换为blockPanel中的position
     */
    convertIndexToPosition: function (row, col) {
        let x = this.paddingLeft + this.spacing.x / 2 + this.blockSize.x / 2 + col * (this.blockSize.x + this.spacing.x);
        let y = -this.paddingTop - this.blockSize.y / 2 - row * (this.blockSize.y + this.spacing.y);
        return new cc.Vec2(x, y);
    },

    generateBlock: function () {
        let blockNode = cc.instantiate(this.blockPrefab);
        blockNode.width = this.blockSize.x;
        blockNode.height = this.blockSize.y;

        let block = blockNode.getComponent("Block");
        block.row = this.rowCount;
        block.col = Math.floor(this.colCount / 2);
        let point = this.randomPoint();
        block.setPoint(point);
        block.setBgSpriteFrame(this.blockSpriteFrame[this.calculateIndex(point)]);
        let position = this.convertIndexToPosition(block.row, block.col);
        blockNode.setPosition(position);

        this.blockPanel.addChild(blockNode);
        this.newBlock = block;
    },

    randomPoint: function () {
        let exponent = Utils.randomNum(3);
        return Math.pow(2, exponent);
    },

    calculateIndex: function (point) {
        let index = 0;
        while (point > 2) {
            point /= 2;
            index++;
        }
        return index;
    }

    // update (dt) {},
});
