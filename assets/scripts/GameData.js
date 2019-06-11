
var GameData = cc.Class({
    properties: {
        statics: {
            default: null,
            instance: null
        },
        bestScore: {//最高分
            get: function () {
                if (this._bestScore == undefined) {
                    this._bestScore = cc.sys.localStorage.getItem('best_score');
                }
                return this._bestScore == undefined ? 0 : this._bestScore;
            },
            set: function (value) {
                this._bestScore = value;
                cc.sys.localStorage.setItem('best_score', value);
            }
        },
        lastGameData: {//上局游戏数据
            get: function () {
                if (this._lastGameData == undefined) {
                    this._lastGameData = cc.sys.localStorage.getItem('last_game_data');
                }
                return this._lastGameData;
            },
            set: function (value) {
                this._lastGameData = value;
                cc.sys.localStorage.setItem('last_game_data', value);
            }
        },
        coinCount: {//金币
            get: function () {
                if (this._coinCount == undefined) {
                    this._coinCount = cc.sys.localStorage.getItem('coin_count');
                }
                return this._coinCount == undefined ? 0 : this._coinCount;
            },
            set: function (value) {
                this._coinCount = value;
                cc.sys.localStorage.setItem('coin_count', value);
            }
        },
        storedCoinCount: {//未获取的金币
            get: function () {
                if (this._storedCoinCount == undefined) {
                    this._storedCoinCount = cc.sys.localStorage.getItem('stored_coin_count');
                }
                return this._storedCoinCount == undefined ? 0 : this._storedCoinCount;
            },
            set: function (value) {
                this._storedCoinCount = value;
                cc.sys.localStorage.setItem('stored_coin_count', value);
            }
        },
        /**
         * 道具
         */
        refreshCount: {//刷新
            get: function () {
                if (this._refreshCount == undefined) {
                    this._refreshCount = cc.sys.localStorage.getItem('refresh_count');
                }
                return this._refreshCount == undefined ? 0 : this._refreshCount;
            },
            set: function (value) {
                this._refreshCount = value;
                cc.sys.localStorage.setItem('refresh_count', value);
            }
        },
        hammerCount: {//锤子
            get: function () {
                if (this._hammerCount == undefined) {
                    this._hammerCount = cc.sys.localStorage.getItem('hammer_count');
                }
                return this._hammerCount == undefined ? 0 : this._hammerCount;
            },
            set: function (value) {
                this._hammerCount = value;
                cc.sys.localStorage.setItem('hammer_count', value);
            }
        },
        //设置
        sound: {//声音
            get: function () {
                if (this._sound == undefined) {
                    this._sound = cc.sys.localStorage.getItem('setting_sound');
                }
                return this._sound == undefined ? true : this._sound;
            },
            set: function (value) {
                this._sound = value;
                cc.sys.localStorage.setItem('setting_sound', value);
            }
        },
        vibration: {//震动
            get: function () {
                if (this._vibration == undefined) {
                    this._vibration = cc.sys.localStorage.getItem('setting_vibration');
                }
                return this._vibration == undefined ? true : this._vibration;
            },
            set: function (value) {
                this._vibration = value;
                cc.sys.localStorage.setItem('setting_vibration', value);
            }
        }
    },

    ctor() {

    },

})

GameData.instance = new GameData();
module.exports = GameData;
