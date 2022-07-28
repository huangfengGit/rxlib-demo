import {TWebSocket} from 'rubix-lib-hf';
import {C_CUSTOM_EVENT} from '../../../mainScene/script/global/NConst';
import {EventTarget, log} from 'cc';
import {
    E_Net_Compresstype,
    packagaMsg,
    unPackageMsg,
} from './uniLib/uniLibCore';
import {NFunctionClass} from '../global/NFunction';

export class NWebScoket extends TWebSocket {
    private _eventMgr: EventTarget;
    private _gFunc: NFunctionClass;

    private _compressType: E_Net_Compresstype;
    public set compressType(v: E_Net_Compresstype) {
        this._compressType = v;
    }
    public get compressType() {
        return this._compressType;
    }

    constructor(eventMgr: EventTarget, gFunc: NFunctionClass) {
        super();
        this._eventMgr = eventMgr;
        this._gFunc = gFunc;
        this._compressType = E_Net_Compresstype.NONE;
    }

    protected onOpen(_: Event): any {
        this._eventMgr.emit(C_CUSTOM_EVENT.Net_Connect_Success);
    }

    /**
     * send data
     */
    public sendData(data: any): void {
        let s: string = data.do || data.cmd_name;
        if (s != 'Pmd.TickReturnNullUserPmd_CS') {
            this._gFunc.showWaitLayer();
            console.log('ws send data : ', s, data);
        }
        super.sendData(packagaMsg(data, this._compressType));
    }

    protected onMessage(event: MessageEvent): any {
        let rcv: any = unPackageMsg(event.data, this._compressType);
        if (Array.isArray(rcv)) {
            for (const aRcv of rcv) {
                this.dealMsg(aRcv);
            }
        } else {
            this.dealMsg(rcv);
        }
    }

    private dealMsg(msg: any) {
        let eventName: string = msg.cmd_name || msg.do;
        if (!eventName) {
            log('Message Error :', msg);
            this._gFunc.showToast('Message Error');
            return;
        }

        if (eventName != 'Pmd.TickRequestNullUserPmd_CS') {
            this._gFunc.closeWaitLayer();
            console.log('ws reve data :', eventName, msg);
        }

        if (eventName) {
            this._eventMgr.emit(eventName.toUpperCase().replace('.', '_'), msg);
        }
    }

    protected onClose(_: Event): any {
        log('socket is close');
    }

    protected onError(e: Event): any {
        log('socket on error:', e);
    }

    protected tick() {
        //
    }
}
