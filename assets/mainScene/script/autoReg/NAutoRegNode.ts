import {NAutoRegEventCom} from './NAutoRegEventCom';
import {Component, _decorator} from 'cc';

const {ccclass} = _decorator;
@ccclass('NAutoRegNode')
export class NAutoRegNode extends Component {
    protected _autoRegEventCom: NAutoRegEventCom;

    onLoad() {
        this._autoRegEventCom = new NAutoRegEventCom(this);
    }

    start() {
        this._autoRegEventCom.autoRegisteredEvent();
    }

    onDestroy() {
        if (this._autoRegEventCom) {
            this._autoRegEventCom.clearReg();
        }
    }
}
