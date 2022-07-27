import {NHttpRequest} from './NHttpRequest';
import {NWebScoket} from './NWebSocket';
import {EventTarget} from 'cc';
import {NFunctionClass} from '../global/NFunction';

export class NNetMgr {
    private _http: NHttpRequest;
    public get http(): NHttpRequest {
        return this._http;
    }
    private _ws: NWebScoket;

    public get ws(): NWebScoket {
        return this._ws;
    }

    constructor(eventMgr: EventTarget, gFunc: NFunctionClass) {
        this._http = new NHttpRequest(eventMgr, gFunc);
        this._ws = new NWebScoket(eventMgr, gFunc);
    }
}
