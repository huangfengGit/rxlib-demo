import {E_Battle_Type, E_StageType} from '../global/NEnum';
import {_decorator} from 'cc';
import {C_BUNDLE_LIST} from '../global/NConst';
import {TLayer} from 'rubix-lib-hf';
import {NGlobal} from '../global/NGlobal';

const {ccclass} = _decorator;
@ccclass('NMainUILayer')
export class NMainUILayer extends TLayer {
    enterStage(key: number): void {
        switch (key) {
            case E_StageType.LOADING:
                this.addPrefabToLayer(
                    'mainUI/loadingMainUI',
                    C_BUNDLE_LIST.LOADING
                );
                break;
            case E_StageType.LOBBY:
                this.addPrefabToLayer(
                    'mainUI/lobbyMainUI',
                    C_BUNDLE_LIST.LOBBY
                );
                break;
            case E_StageType.BATTLE:
                // switch (
                //     NGlobal.userData.stageInitDataUD.battleData.battleType
                // ) {
                // case E_Battle_Type.PVP:
                this.addPrefabToLayer(
                    'mainUI/battleMainUI',
                    C_BUNDLE_LIST.BATTLE
                );
                //         break;
                // }

                break;

            default:
                break;
        }
    }

    exitStage(key: number, lastKey?: number): void {
        this.node.destroyAllChildren();
    }
}
