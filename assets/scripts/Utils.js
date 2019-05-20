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

function calculateIndex(point) {
    let index = 0;
    while (point > 2) {
        point /= 2;
        index++;
    }
    return index;
}

function logBlockArr(blockArr) {
    for (let row = 0; row < blockArr.length; row++) {
        let colStr = '';
        for (let col = 0; col < blockArr[row].length; col++) {
            if (blockArr[row][col] != null) {
                colStr += blockArr[row][col].point + ' ';
            } else {
                colStr += '* ';
            }
        }
        console.log(colStr);
    }
}

function toIntegerArr(blockArr) {
    let arr = [];
    for (let row = 0; row < blockArr.length; row++) {
        arr.push(new Array());
        for (let col = 0; col < blockArr[row].length; col++) {
            let block = blockArr[row][col];
            if (block != undefined) {
                arr[row].push(block.point);
            } else {
                arr[row].push(-1);
            }
        }
    }
    return arr;
}

module.exports = {
    randomPoint: randomPoint,
    randomNum: randomNum,
    calculateIndex: calculateIndex,
    logBlockArr: logBlockArr,
    toIntegerArr: toIntegerArr,
};
