import {
    CCFloat,
    Node,
    Enum,
    UIOpacity,
    _decorator,
    Vec3,
    tween,
    Widget,
} from 'cc';
import {TWindow} from 'rubix-lib-hf';
import {NAutoRegEventCom} from '../autoReg/NAutoRegEventCom';
import {gFunctions} from '../global/NGlobal';
const {ccclass, property} = _decorator;

export enum E_WIN_TYPE {
    NONE = 0,
    ENLARGER, //  放大
    FADEIN, //淡入
    SLIDEIN, //滑入
}

export enum E_SLIDEIN_DIRECTION {
    LEFT = 0,
    RIGHT,
    TOP,
    DOWN,
}

Enum(E_WIN_TYPE);
Enum(E_SLIDEIN_DIRECTION);

@ccclass('NWindow')
export class NWindow extends TWindow {
    @property({
        group: {name: 'Win Animation'},
        type: E_WIN_TYPE,
        tooltip:
            '三种窗体基础动画:\nNONE : 不使用动画\nENLARGER : 放大\nFADEIN : 淡入\nSLIDEIN : 滑入',
    })
    animation_type: E_WIN_TYPE = E_WIN_TYPE.NONE;

    @property({
        group: {name: 'Win Animation'},
        type: E_SLIDEIN_DIRECTION,
        tooltip: '滑入方向',
        visible: function (this: any) {
            return this.animation_type == E_WIN_TYPE.SLIDEIN;
            // return true;
        },
    })
    slide_direction: E_SLIDEIN_DIRECTION = E_SLIDEIN_DIRECTION.LEFT;

    @property({
        group: {name: 'Win Animation'},
        type: CCFloat,
        tooltip: '动画消耗时间',
        visible: function (this: any) {
            return this.animation_type != E_WIN_TYPE.NONE;
        },
    })
    time_animation: number = 0.1;

    private _autoRegEventCom: NAutoRegEventCom;

    onLoad() {
        super.onLoad();

        // 窗口的点击穿透
        this._autoRegEventCom = new NAutoRegEventCom(this);
        this.onEnterAnimation().then(() => {
            //自动调用注册
            this._autoRegEventCom.autoRegisteredEvent();
            gFunctions.closeWaitLayer();
        });
    }

    onEnterAnimation() {
        let node: Node = this.node;
        let widget_node: Widget = node.getComponent(Widget);
        let opa_UI: UIOpacity = node.getComponent(UIOpacity);
        if (!opa_UI) opa_UI = node.addComponent(UIOpacity);

        let scale: Vec3, opa: number;
        switch (this.animation_type) {
            case E_WIN_TYPE.ENLARGER: //放大
                opa_UI.opacity = 0;
                if (widget_node) widget_node.enabled = false;
                if (this.node) {
                    scale = Vec3.clone(this.node.scale);
                    this.node.setScale(0.8, 0.8, 0);
                } else {
                    scale = Vec3.clone(this.node.scale);
                    this.node.setScale(0.8, 0.8, 0);
                }
                return new Promise((res, _) => {
                    this.scheduleOnce(() => {
                        tween(node)
                            .to(
                                this.time_animation,
                                {scale: scale},
                                {
                                    onUpdate: (ta, ratio: number) => {
                                        opa_UI.opacity = ratio * 255;
                                    },
                                }
                            )
                            .call(() => {
                                if (widget_node) {
                                    widget_node.enabled = true;
                                    widget_node.updateAlignment();
                                }
                                res(null);
                            })
                            .start();
                    }, 0.1);
                });
                break;
            case E_WIN_TYPE.FADEIN:
                return new Promise((res, _) => {
                    tween(opa_UI)
                        .to(this.time_animation, {opacity: 255})
                        .call(() => {
                            res(null);
                        })
                        .start();
                });
                break;
            case E_WIN_TYPE.SLIDEIN:
                let widget: Widget = node.getComponent(Widget);
                if (!widget) widget = node.addComponent(Widget);
                let right: number, left: number, top: number, bottom: number;
                right = widget.right;
                left = widget.left;
                top = widget.top;
                bottom = widget.bottom;
                switch (this.slide_direction) {
                    case E_SLIDEIN_DIRECTION.LEFT:
                        widget.right = 1334;
                        widget.left = -1334;
                        break;
                    case E_SLIDEIN_DIRECTION.RIGHT:
                        widget.right = -1334;
                        widget.left = 1334;
                        break;
                    case E_SLIDEIN_DIRECTION.TOP:
                        widget.top = -750;
                        widget.bottom = 750;
                        break;
                    case E_SLIDEIN_DIRECTION.DOWN:
                        widget.top = 750;
                        widget.bottom = -750;
                        break;
                }
                widget.updateAlignment();
                return new Promise((res, rej) => {
                    tween(widget)
                        .to(this.time_animation, {
                            left: left,
                            right: right,
                            top: top,
                            bottom: bottom,
                        })
                        .call(() => {
                            res(null);
                        })
                        .start();
                });
                break;
            case E_WIN_TYPE.NONE:
                return new Promise((res, rej) => {
                    res(null);
                });
        }
    }

    onDestroy() {
        this._autoRegEventCom.clearReg();
    }
}
