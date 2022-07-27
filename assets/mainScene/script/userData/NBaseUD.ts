import {TAutoRegEventCom} from 'rubix-lib-hf';
import {NFunctionClass} from '../global/NFunction';

export class NBaseUD {
    protected _autoRegCom: TAutoRegEventCom;
    protected _gFunc: NFunctionClass;

    constructor(gFunc: NFunctionClass) {
        this._autoRegCom = new TAutoRegEventCom(this);
        this._autoRegCom.addEventRegExp(/_NetRespone$/);
        this._autoRegCom.autoRegisteredEvent();

        this._gFunc = gFunc;
    }

    destory() {
        this._autoRegCom.clearReg();
    }
}
