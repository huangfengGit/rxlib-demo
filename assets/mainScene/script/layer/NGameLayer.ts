import {E_Battle_Type, E_StageType} from '../global/NEnum';
import {_decorator} from 'cc';
import {C_BUNDLE_LIST} from '../global/NConst';
import {TLayer} from 'rubix-lib-hf';
import {NGlobal} from '../global/NGlobal';

const {ccclass} = _decorator;
@ccclass('NGameLayer')
export class NGameLayer extends TLayer {
    enterStage(key: number): void {
        switch (key) {
            case E_StageType.LOBBY:
                this.addPrefabToLayer(
                    'game/onHookGame/onHookGame',
                    C_BUNDLE_LIST.LOBBY
                );
                break;
            case E_StageType.BATTLE:
                switch (
                    NGlobal.userData.stageInitDataUD.battleData.battleType
                ) {
                    case E_Battle_Type.PVE:
                        this.addPrefabToLayer(
                            'gameLayer/battleGame',
                            C_BUNDLE_LIST.BATTLE
                        );
                        break;
                    case E_Battle_Type.PVP:
                        break;
                    case E_Battle_Type.SHOW_PVE:
                        this.addPrefabToLayer(
                            'gameLayer/SEPveGameLayer',
                            C_BUNDLE_LIST.BATTLE
                        );
                        break;
                    case E_Battle_Type.SHOW_PVP:
                        this.addPrefabToLayer(
                            'gameLayer/SEPvpGameLayer',
                            C_BUNDLE_LIST.BATTLE
                        );
                        break;
                    case E_Battle_Type.ECSTEST:
                        this.addPrefabToLayer(
                            'gameLayer/battleECSTest',
                            C_BUNDLE_LIST.BATTLE
                        );
                }

                break;
            default:
                break;
        }
    }

    exitStage(key: number, lastKey?: number): void {
        this.node.removeAllChildren();
    }
}
