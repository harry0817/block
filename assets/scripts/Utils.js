function randomPoint() {
    let exponent = randomNum(3);
    return Math.pow(2, exponent);
}

function randomNum(minNum, maxNum) {
    switch (arguments.length) {
        case 1:
            return parseInt(Math.random() * minNum + 1, 10);
        case 2:
            return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
        default:
            return 0;
    }
}

function calculateIndex (point) {
    let index = 0;
    while (point > 2) {
        point /= 2;
        index++;
    }
    return index;
}

module.exports = {
    randomPoint: randomPoint,
    randomNum: randomNum,
    calculateIndex: calculateIndex,
};
