
const BlockPointManager = cc.Class({

    statics: {
        firstLimitPoint: 2048,
        firstLimitExponent: 7,
    },

    properties: {

    },

    ctor() {
        this.reset();
    },

    set: function (highestPoint, highestExponent, reachHighestPointCount) {
        this.highestPoint = highestPoint;
        this.highestExponent = highestExponent;
        this.reachHighestPointCount = reachHighestPointCount;
    },

    reset: function () {
        console.log('reset');
        this.highestPoint = 4;
        this.highestExponent = 2;
        this.reachHighestPointCount = 0;
    },

    setPoint: function (point) {
        if (point >= this.highestPoint) {
            this.highestPoint = point;
            if (point >= BlockPointManager.firstLimitPoint) {
                this.reachHighestPointCount++;
                if (this.reachHighestPointCount > 3) {
                    this.reachHighestPointCount = 0;
                    this.highestExponent++;
                    return true;
                } else {
                    return false;
                }
            } else {
                let exponent = Math.log2(point);
                this.highestExponent = Math.min(exponent, BlockPointManager.firstLimitExponent - 1);
            }
        }
        return true;
    },

    randomPoint: function () {
        let exponent = randomNum(this.highestExponent);
        return Math.pow(2, exponent);
    },

    randomNum: function (minNum, maxNum) {
        switch (arguments.length) {
            case 1:
                return parseInt(Math.random() * minNum + 1, 10);
            case 2:
                return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
            default:
                return 0;
        }
    },
});

module.exports = BlockPointManager;