'use strict';

if (!window.i18n) {
    window.i18n = {};
}

if (!window.i18n.languages) {
    window.i18n.languages = {};
}

window.i18n.languages['zh'] = {
    'play': "PLAY",
    'score': '分数',
    'best_score': '最高分',
    'new_game': '新游戏',
    'continue': '继续',
    'share': '分享',
    'free': '免费',
    'item': {
        'bomb': '炸弹',
        'rocket': '火箭',
        'hammer': '锤子',
        'refresh': '刷新'
    },
    'pause_dialog': {
        'title': '暂停',
    },
    'failed_dialog': {
        'title': '游戏结束',
        'your_score': '你的分数:',
        'rank': '好友排名',
    },
    'item_dialog': {
        'title': '获取道具',
    },
    'receive_coin_dialog': {
        'title': '获取金币',
        'now_you_have': '你有',
        'btn_receive': '只获取{0}个金币',
        'btn_reward': '获取{0}个金币'
    }
};