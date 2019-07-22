'use strict';

if (!window.i18n) {
    window.i18n = {};
}

if (!window.i18n.languages) {
    window.i18n.languages = {};
}

window.i18n.languages['en'] = {
    'play': "PLAY",
    'score': 'Score',
    'best_score': 'Best Score',
    'new_game': 'NEW GAME',
    'continue': 'GO ON',
    'share': 'Share',
    'free': 'FREE',
    'item': {
        'bomb': 'Bomb',
        'rocket': 'Rocket',
        'hammer': 'Hammer',
        'refresh': 'Refresh'
    },
    'pause_dialog': {
        'title': 'PAUSE',
    },
    'failed_dialog': {
        'title': 'GAME OVER',
        'your_score': 'Your Score:',
        'rank': 'Friendly ranking',
    },
    'item_dialog': {
        'title': 'GET BOOST'
    },
    'receive_coin_dialog': {
        'title': 'GET COINS',
        'now_you_have': 'NOW YOU HAVE',
        'btn_receive': 'JUST GET {0} coin',
        'btn_reward': 'GET {0} COINS'
    }
};