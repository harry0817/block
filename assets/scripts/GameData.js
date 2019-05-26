
var GameData = cc.Class({
    properties: {
        statics: {
            default: null,
            instance: null
        },
        bestScore: {//最高分
            get: function () {
                let _bestScore = cc.sys.localStorage.getItem('best_score');
                if (_bestScore == undefined) {
                    return 0;
                }
                return _bestScore;
            },
            set: function (value) {
                cc.sys.localStorage.setItem('best_score', value);
            }
        },
        lastGameData: {//上局游戏数据
            get: function () {
                let _lastGameData = cc.sys.localStorage.getItem('last_game_data');
                return _lastGameData;
            },
            set: function (value) {
                cc.sys.localStorage.setItem('last_game_data', value);
            }
        },
        coinCount: {//金币
            get: function () {
                let _coinCount = cc.sys.localStorage.getItem('coin_count');
                if (_coinCount == undefined) {
                    return 0;
                }
                return _coinCount;
            },
            set: function (value) {
                cc.sys.localStorage.setItem('coin_count', value);
            }
        },
        refreshCount: {//刷新道具
            get: function () {
                let _refreshCount = cc.sys.localStorage.getItem('refresh_count');
                if (_refreshCount == undefined) {
                    return 0;
                }
                return _refreshCount;
            },
            set: function (value) {
                cc.sys.localStorage.setItem('refresh_count', value);
            }
        },
        hammerCount: {//锤子道具
            get: function () {
                let _hammerCount = cc.sys.localStorage.getItem('hammer_count');
                if (_hammerCount == undefined) {
                    return 0;
                }
                return _hammerCount;
            },
            set: function (value) {
                cc.sys.localStorage.setItem('hammer_count', value);
            }
        }
    },

    ctor() {

    },

})

GameData.instance = new GameData();
module.exports = GameData;
