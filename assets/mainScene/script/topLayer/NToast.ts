import {
    Component,
    easing,
    Label,
    Sprite,
    SpriteFrame,
    tween,
    Tween,
    UIOpacity,
    v3,
    _decorator,
} from 'cc';

const {ccclass, property, menu} = _decorator;

export enum E_TOAST_TYPE {
    NONE = 0,
    correct = 1,
    ERROR = 2,
}

@ccclass
@menu('UI/TopLayer/HintLayer')
export default class NToast extends Component {
    @property(Label)
    lbl_hint: Label;

    @property(Sprite)
    sp_icon: Sprite;

    @property(SpriteFrame)
    spf_err: SpriteFrame;

    @property(SpriteFrame)
    spf_correct: SpriteFrame;

    start() {
        let opacity = this.node.getComponent(UIOpacity);
        opacity.opacity = 0;
    }
    showToast(msg: string, type: E_TOAST_TYPE) {
        this.node.active = true;
        Tween.stopAllByTarget(this.node);
        if (type == E_TOAST_TYPE.correct) {
            this.sp_icon.spriteFrame = this.spf_correct;
        } else {
            this.sp_icon.spriteFrame = this.spf_err;
        }
        this.lbl_hint.string = msg;
        let opacity = this.node.getComponent(UIOpacity);
        this.node.position = v3(0, 0, 0);
        opacity.opacity = 255;

        let tTime: number = 1.5;
        tween(this.node)
            .by(tTime, {
                position: v3(0, 200, 0),
            })
            .start();

        tween(opacity)
            .by(tTime, {
                opacity: -255,
            })
            .start();
    }
}
