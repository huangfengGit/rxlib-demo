import {E_StageType} from '../global/NEnum';
import {_decorator} from 'cc';
import {TLayer} from 'rubix-lib-hf';
import {DEBUG} from 'cc/env';
import {C_BUNDLE_LIST} from '../global/NConst';

const {ccclass} = _decorator;
@ccclass('NDebugLayer')
export class NDebugLayer extends TLayer {
    enterStage(key: number): void {
        if (DEBUG) {
            switch (key) {
                case E_StageType.LOBBY:
                    this.addPrefabToLayer(
                        'debug/lobbyDebugLayer',
                        C_BUNDLE_LIST.LOBBY
                    );
                    break;

                default:
                    break;
            }
        }
    }

    exitStage(key: number, lastKey?: number): void {
        if (DEBUG) {
            this.node.removeAllChildren();
        }
    }
}
