import {TLayer} from 'rubix-lib-hf';
import {Animation, BlockInputEvents, Button, _decorator} from 'cc';
import NToast, {E_TOAST_TYPE} from '../topLayer/NToast';
import {NGlobal} from '../global/NGlobal';
import {DEBUG} from 'cc/env';

const {ccclass, property} = _decorator;
@ccclass('NTopLayer')
export class NTopLayer extends TLayer {
    @property(Button)
    btn_debug: Button;

    @property(NToast)
    toast: NToast;

    @property(Animation)
    waitAnima: NToast;

    private _waitLayerCount: number = 0;
    private _blockEvent: BlockInputEvents = null;
    enterStage(_: number): void {}

    exitStage(_: number, _1: number): void {}

    onLoad() {
        if (DEBUG) {
            this.btn_debug.node.on(
                Button.EventType.CLICK,
                this.btn_debug_click,
                this
            );
        } else {
            this.btn_debug.node.destroy();
        }
    }

    start() {
        this._blockEvent = this.getComponent(BlockInputEvents);
        this._blockEvent.enabled = false;
        this.waitAnima.node.active = false;
    }

    /**
     * btn_debug_click
     */
    public btn_debug_click(_: Button) {
        NGlobal.mainScene.getDebugLayer().node.active = true;
    }

    public showToast(s: string, toastType: E_TOAST_TYPE) {
        this.toast.showToast(s, toastType);
    }

    public showWaittingLayer(showAnimaDelay: number = 0.5) {
        this._waitLayerCount += 1;
        this._blockEvent.enabled = true;
        this.waitAnima.node.active = true;
        if (this._waitLayerCount == 1) {
            this.scheduleOnce(this.delayShowWait, showAnimaDelay);
        }
    }

    private delayShowWait() {
        this.waitAnima.node.active = true;
    }

    public closeWaittingLayer(bClean: boolean) {
        this._waitLayerCount = bClean
            ? 0
            : this._waitLayerCount > 0
            ? this._waitLayerCount - 1
            : 0;
        if (this._blockEvent.enabled && this._waitLayerCount == 0) {
            this._blockEvent.enabled = false;
            this.waitAnima.node.active = false;
            this.unschedule(this.delayShowWait);
            this._waitLayerCount = 0;
            this.waitAnima.node.active = false;
        }
    }

    /**
     * isWaiting
     */
    public isWaiting(): boolean {
        return this._waitLayerCount > 0;
    }
}
