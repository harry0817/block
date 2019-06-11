var Utils = require('Utils');

const BlockPointUtil = cc.Class({

    statics: {
        firstLimitPoint: 2048,
        firstLimitExponent: 7,
    },

    properties: {
        highestPoint: 4,
        highestExponent: 2,
        reachHighestPointCount: 0,
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
            if (point >= BlockPointUtil.firstLimitPoint) {
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
                this.highestExponent = Math.min(exponent, BlockPointUtil.firstLimitExponent - 1);
            }
        }
        return true;
    },

    randomPoint: function () {
        let exponent = Utils.randomNum(this.highestExponent);
        return Math.pow(2, exponent);
    },
});

module.exports = BlockPointUtil;