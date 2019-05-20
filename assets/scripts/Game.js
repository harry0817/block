var Utils = require('Utils');
var GameUI = require('GameUI');

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
        this.tempRemovedBlockArr = new Array();
        this.tempActionArr = new Array();
        for (let i = 0; i < this.rowCount + 1; i++) {
            this.blockArr[i] = new Array();
            for (let j = 0; j < this.colCount; j++) {
                this.blockArr[i][j] = undefined;
            }
        }
        this.userCanOperate = true;
    },

    onLoad() {
        this.gameUI.init(this);
        this.initData();
        this.initListener();
        this.initView();

        this.generateBlock();
    },

    start() {

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
        console.log('blockPanel:' + this.blockPanel.width + ',' + this.blockPanel.height);
    },

    gotoHome: function () {

        let intArr = Utils.toIntegerArr(this.blockArr);
        let gameData = {
            blockArr: intArr,
            score: this.score
        };
        console.log(JSON.stringify(gameData));

        cc.sys.localStorage.setItem('gameData', JSON.stringify(gameData));
        cc.director.loadScene('Home');
    },

    newGame: function () {
        console.log('newGame');
        for (let row = 0; row < this.blockArr.length; row++) {
            for (let col = 0; col < this.blockArr[row].length; col++) {
                let block = this.blockArr[row][col];
                if (block != undefined) {
                    block.node.destroy();
                    this.blockArr[row][col] = undefined;
                }
            }
        }
        if (this.newBlock != null) {
            this.newBlock.node.destroy();
            this.newBlock = undefined;
        }
        this.userCanOperate = true;
        this.generateBlock();
    },

    onblockPanelTouchEvent: function (event) {
        // console.log('getLocation:' + event.getLocation());
        // console.log('getLocationInView:' + event.getLocationInView());
        // console.log('convertToNodeSpace:' + this.blockPanel.convertToNodeSpace(event.getLocation()));
        // console.log('convertToNodeSpaceAR:' + this.blockPanel.convertToNodeSpaceAR(event.getLocation()));

        if (!this.userCanOperate) {
            return;
        }
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
                    console.log('手指up');
                    this.userCanOperate = false;
                    let col = this.convertPositionToCol(this.newBlock.node.getPosition());
                    let lastBlockThisCol = this.blockArr[this.rowCount - 1][col];
                    if (lastBlockThisCol != undefined && lastBlockThisCol.point != (this.newBlock.point)) {
                        //游戏失败
                        this.gameUI.showFailedDialog();
                    } else {
                        this.comboCount = 0;
                        this.blockArr[this.newBlock.row][col] = this.newBlock;
                        this.newBlock.col = col;

                        this.randomBombItem();
                        this.settleBlock(true);
                    }
                }
                break;
        }
    },

    settleBlock: function (emission = false) {
        // console.log('settleBlock');
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
                        emptyRow++;
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
            this.scheduleOnce(this.combineBlock, 0.2);
        }
    },

    combineBlock: function () {
        console.log('combineBlock');
        let tempMovingBlockArr = this.tempSettlingBlockArr.concat(this.tempUpgradeBlockArr);
        this.tempActionArr.splice(0, this.tempActionArr.length);
        this.tempSettlingBlockArr.splice(0, this.tempSettlingBlockArr.length);
        this.tempUpgradeBlockArr.splice(0, this.tempUpgradeBlockArr.length);
        this.tempRemovedBlockArr.splice(0, this.tempRemovedBlockArr.length);

        for (let i = 0; i < tempMovingBlockArr.length; i++) {
            this.findCombineBlock(tempMovingBlockArr[i]);
        }

        if (this.tempActionArr.length > 0) {
            this.comboCount++;
            //移动
            for (let i = 0; i < this.tempActionArr.length; i++) {
                let movingAction = this.tempActionArr[i];
                let block = movingAction.block;
                // console.log('move:' + block.toString() + ' to (' + movingAction.toRow + ',' + movingAction.toCol + ')');
                let position = this.convertIndexToPosition(movingAction.toRow, movingAction.toCol);
                let action = cc.moveTo(this.normalMoveDuration, position);
                block.node.runAction(action);
            }
            //加分
            let upgradeAction = cc.callFunc(function () {
                for (let i = 0; i < this.tempUpgradeBlockArr.length; i++) {
                    let upgradeBlock = this.tempUpgradeBlockArr[i];
                    let point = upgradeBlock.point * Math.pow(2, upgradeBlock.combineBlockArr.length);
                    // console.log('upgrade:' + upgradeBlock.toString() + ' to ' + point);
                    upgradeBlock.setPoint(point);
                    upgradeBlock.setBgSpriteFrame(this.blockSpriteFrame[Utils.calculateIndex(point)]);
                    this.score += (this.comboCount >= 2 ? point * 4 : point * 2);
                    this.gameUI.updateScore(this.score);

                    for (let j = 0; j < upgradeBlock.combineBlockArr.length; j++) {
                        let combineBlock = upgradeBlock.combineBlockArr[j];
                        // console.log('destroy:' + combineBlock.toString());
                        combineBlock.node.destroy();
                        this.blockArr[combineBlock.row][combineBlock.col] = undefined;
                    }
                    upgradeBlock.clearCombineBlock();
                }
            }, this);
            let action = cc.sequence(cc.delayTime(this.normalMoveDuration), upgradeAction, cc.callFunc(this.settleBlock, this));
            this.node.runAction(action);
        } else {
            this.generateBlock();
            this.userCanOperate = true;
            this.gameUI.showCombo(this.comboCount);
        }
    },

    generateAction: function (block, toRow, toCol) {
        let movingAction = new Object();
        movingAction.block = block;
        movingAction.toRow = toRow;
        movingAction.toCol = toCol;
        return movingAction;
    },

    /**
     * 找到能和block合成的块
     */
    findCombineBlock: function (block) {
        if (this.tempUpgradeBlockArr.indexOf(block) != -1 || this.tempRemovedBlockArr.indexOf(block) != -1) {
            return;
        }
        // console.log('findCombineBlock:' + block.toString());

        let row = block.row;
        let col = block.col;
        let topBlock = this.findTop(block);
        let bottomBlock = this.findBottom(block);
        let leftBlock = this.findLeft(block);
        let rightBlock = this.findRight(block);
        if (topBlock != undefined && leftBlock == undefined && rightBlock == undefined) {//只有上方有
            // console.log('只有上:' + block.toString() + ' to ' + topBlock.toString());
            topBlock.pushCombineBlock(block);
            let movingAction = this.generateAction(block, topBlock.row, topBlock.col);
            this.tempActionArr.push(movingAction);
            this.tempUpgradeBlockArr.push(topBlock);
            this.tempRemovedBlockArr.push(block);
        } else {
            if (topBlock != undefined) {//上
                // console.log('上:' + topBlock.toString() + ' to ' + block.toString());
                block.pushCombineBlock(topBlock);
                let movingAction = this.generateAction(topBlock, row, col);
                this.tempActionArr.push(movingAction);
                if (this.tempUpgradeBlockArr.indexOf(block) == -1) {
                    this.tempUpgradeBlockArr.push(block);
                }
                //递归
                this.findCombineBlock(topBlock);
                this.tempRemovedBlockArr.push(topBlock);
            }
            if (bottomBlock != undefined) {//下
                // console.log('下:' + bottomBlock.toString() + ' to ' + block.toString());
                block.pushCombineBlock(bottomBlock);
                let movingAction = this.generateAction(bottomBlock, row, col);
                this.tempActionArr.push(movingAction);
                if (this.tempUpgradeBlockArr.indexOf(block) == -1) {
                    this.tempUpgradeBlockArr.push(block);
                }
                //递归
                this.findCombineBlock(bottomBlock);
                this.tempRemovedBlockArr.push(bottomBlock);
            }
            if (leftBlock != undefined) {//左
                // console.log('左:' + leftBlock.toString() + ' to ' + block.toString());
                block.pushCombineBlock(leftBlock);
                let movingAction = this.generateAction(leftBlock, row, col);
                this.tempActionArr.push(movingAction);
                if (this.tempUpgradeBlockArr.indexOf(block) == -1) {
                    this.tempUpgradeBlockArr.push(block);
                }
                //递归
                this.findCombineBlock(leftBlock);
                this.tempRemovedBlockArr.push(leftBlock);
            }
            if (rightBlock != undefined) {//右
                // console.log('右:' + rightBlock.toString() + ' to ' + block.toString());
                block.pushCombineBlock(rightBlock);
                let movingAction = this.generateAction(rightBlock, row, col);
                this.tempActionArr.push(movingAction);
                if (this.tempUpgradeBlockArr.indexOf(block) == -1) {
                    this.tempUpgradeBlockArr.push(block);
                }
                //递归
                this.findCombineBlock(rightBlock);
                this.tempRemovedBlockArr.push(rightBlock);
            }
        }
    },

    findTop: function (block) {
        let row = block.row;
        let col = block.col;
        if (row > 0) {
            let targetBlock = this.blockArr[row - 1][col];
            if (targetBlock != undefined && this.tempRemovedBlockArr.indexOf(targetBlock) == -1 && this.tempUpgradeBlockArr.indexOf(targetBlock) == -1) {
                if (targetBlock.point == block.point) {
                    return targetBlock;
                }
            }
        }
        return undefined;
    },

    findBottom: function (block) {
        let row = block.row;
        let col = block.col;
        if (row < this.rowCount - 1) {
            let targetBlock = this.blockArr[row + 1][col];
            if (targetBlock != undefined && this.tempRemovedBlockArr.indexOf(targetBlock) == -1 && this.tempUpgradeBlockArr.indexOf(targetBlock) == -1) {
                if (targetBlock.point == block.point) {
                    return targetBlock;
                }
            }
        }
        return undefined;
    },

    findLeft: function (block) {
        let row = block.row;
        let col = block.col;
        if (col > 0) {
            let targetBlock = this.blockArr[row][col - 1];
            if (targetBlock != undefined && this.tempRemovedBlockArr.indexOf(targetBlock) == -1 && this.tempUpgradeBlockArr.indexOf(targetBlock) == -1) {
                if (targetBlock.point == block.point) {
                    return targetBlock;
                }
            }
        }
        return undefined;
    },

    findRight: function (block) {
        let row = block.row;
        let col = block.col;
        if (col < this.colCount - 1) {
            let targetBlock = this.blockArr[row][col + 1];
            if (targetBlock != undefined && this.tempRemovedBlockArr.indexOf(targetBlock) == -1 && this.tempUpgradeBlockArr.indexOf(targetBlock) == -1) {
                if (targetBlock.point == block.point) {
                    return targetBlock;
                }
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

    /**
     * 随机生成新的块
     */
    generateBlock: function () {
        let blockNode = cc.instantiate(this.blockPrefab);
        //size、position
        blockNode.width = this.blockSize.x;
        blockNode.height = this.blockSize.y;
        let block = blockNode.getComponent("Block");
        block.init(this);
        block.row = this.rowCount;
        block.col = Math.floor(this.colCount / 2);
        let position = this.convertIndexToPosition(block.row, block.col);
        blockNode.setPosition(position);
        //point
        let point = Utils.randomPoint();
        block.setPoint(point);
        block.setBgSpriteFrame(this.blockSpriteFrame[Utils.calculateIndex(point)]);
        //
        this.blockPanel.addChild(blockNode);
        this.newBlock = block;
        //
        Utils.logBlockArr(this.blockArr);
    },

    /**
     * 刷新待加入的块
     */
    refreshNewBlock: function () {
        if (this.userCanOperate) {
            if (this.newBlock != undefined) {
                var point = this.newBlock.point;
                while (point == this.newBlock.point) {
                    point = Utils.randomPoint();
                }
                this.newBlock.setPoint(point);
                this.newBlock.setBgSpriteFrame(this.blockSpriteFrame[Utils.calculateIndex(point)]);
            }
        }
    },

    /**
     * 随机分配道具
     */
    randomBombItem: function () {
        for (let row = 0; row < this.rowCount; row++) {
            for (let col = 0; col < this.colCount; col++) {
                let block = this.blockArr[row][col];
                if (block != undefined) {
                    block.setBomb(Utils.randomNum(10) <= 2);
                }
            }
        }
    },

    /**
     * 炸弹道具
     */
    onBomb: function (block) {
        let startRow = Math.max(0, block.row - 1);
        let endRow = Math.min(this.rowCount - 1, block.row + 1);
        let startCol = Math.max(0, block.col - 1);
        let endCol = Math.min(this.colCount - 1, block.col + 1);
        for (let row = startRow; row <= endRow; row++) {
            for (let col = startCol; col <= endCol; col++) {
                let block = this.blockArr[row][col];
                if (block != undefined) {
                    block.node.destroy();
                    this.blockArr[row][col] = undefined;
                }
            }
        }
        this.settleBlock();
    },

    /**
     * 火箭道具
     */
    onRocket: function (block) {
        for (let col = 0; col < this.colCount; col++) {
            let block = this.blockArr[block.row][col];
            if (block != undefined) {
                block.node.destroy();
                this.blockArr[block.row][col] = undefined;
            }
        }
        this.settleBlock();
    }

    // update (dt) {},
});
