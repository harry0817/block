const showDuration = 0.3;
const dismissDuration = 0.3;

var BaseDialog = cc.Class({
    extends: cc.Component,

    properties: {
        closeBtn: cc.Button,
        blackOverlay: cc.Node,
        panel: cc.Node,
    },

    onLoad() {
        this.closeBtn.node.on('click', this.dismiss, this);

        this.panel.scale = 0;
        this.panel.runAction(cc.scaleTo(showDuration, 1).easing(cc.easeElasticOut(0.7)));
        this.blackOverlay.opacity = 0;
        this.blackOverlay.runAction(cc.fadeTo(showDuration, 255 * 0.3));
    },

    start() {

    },

    show: function () {
        let dialogPanel = cc.find('DialogPanel');
        if (dialogPanel != undefined) {
            this.dialogManager = dialogPanel.getComponent('DialogManager');
            this.node.parent = this.dialogManager.dialogRoot;
        }
    },

    dismiss: function () {
        let panelAction = cc.sequence(
            cc.scaleTo(dismissDuration, 0),
            cc.callFunc(function () {
                this.node.dispatchEvent(new cc.Event.EventCustom('dismiss'));
                this.node.destroy();
            }, this)
        )
        this.panel.runAction(panelAction);
        this.blackOverlay.runAction(cc.fadeTo(dismissDuration, 0));
    }

    // update (dt) {},
});
