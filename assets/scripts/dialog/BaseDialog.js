
var BaseDialog = cc.Class({
    extends: cc.Component,

    properties: {
        closeBtn: cc.Button,
        blackOverlayAnimation: cc.Animation,
        panel: cc.Node,
    },

    onLoad() {
        this.closeBtn.node.on('click', this.dismiss, this);
    },

    start() {

    },

    onDestroy() {
        this.dialogManager.dicideBlackOverlay(-1);
    },

    show: function () {
        let dialogPanel = cc.find('DialogPanel');
        if (dialogPanel != undefined) {
            this.dialogManager = dialogPanel.getComponent('DialogManager');
            this.node.parent = this.dialogManager.dialogRoot;
        }
    },

    dismiss: function () {
        this.blackOverlayAnimation.play('black_overlay_dismiss');
        let panelAnimation = this.panel.getComponent(cc.Animation);
        panelAnimation.play('dialog_dismiss');
        this.blackOverlayAnimation.on('finished', function () {
            this.node.destroy();
            this.node.dispatchEvent(new cc.Event.EventCustom('dismiss'));
        }, this);
    }

    // update (dt) {},
});
