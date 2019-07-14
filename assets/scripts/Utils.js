
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

function logBlockArr(blockArr) {
    for (let row = 0; row < blockArr.length; row++) {
        let colStr = '';
        for (let col = 0; col < blockArr[row].length; col++) {
            if (blockArr[row][col] != undefined) {
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
                arr[row][col] = block.point;
            } else {
                arr[row][col] = 0;
            }
        }
    }
    return arr;
}

module.exports = {
    randomNum: randomNum,
    logBlockArr: logBlockArr,
    toIntegerArr: toIntegerArr,
};
