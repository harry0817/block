
cc.Class({
    extends: cc.Component,

    properties: {
        sprite: cc.Sprite,
        checkSpriteFrame: cc.SpriteFrame,
        uncheckSpriteFrame: cc.SpriteFrame,
    },

    onLoad() {
        
    },

    setCheck(check) {
        this.sprite.spriteFrame = check ? this.checkSpriteFrame : this.uncheckSpriteFrame;
    }
});
