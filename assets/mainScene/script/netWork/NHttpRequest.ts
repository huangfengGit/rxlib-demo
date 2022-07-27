import {THttpRequest} from 'rubix-lib-hf';
import {EventTarget} from 'cc';
import {NFunctionClass} from '../global/NFunction';

export class NHttpRequest extends THttpRequest {
    private _eventMgr: EventTarget;
    private _gFunc: NFunctionClass;
    constructor(eventMgr: EventTarget, gFunc: NFunctionClass) {
        super();
        this._eventMgr = eventMgr;
        this._gFunc = gFunc;
    }

    /**
     * Quick helper to get string xhr type.
     *
     * @ignore
     * @param xhr - The request to check.
     * @return The type.
     */
    protected reqType(xhr: XMLHttpRequest) {
        return xhr.toString().replace('object ', '');
    }

    protected OnError(xhr: XMLHttpRequest): void {
        console.error(
            `${this.reqType(xhr)} Request failed. Status: ${
                xhr.status
            }, text: "${xhr.statusText}"`
        );
    }

    protected broadcastMsg(xhr: XMLHttpRequest): void {
        //
    }
}
