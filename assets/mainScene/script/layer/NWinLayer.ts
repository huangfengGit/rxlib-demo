import {E_StageType} from '../global/NEnum';
import {_decorator} from 'cc';
import {TLayer} from 'rubix-lib-hf';
import {NGlobal} from '../global/NGlobal';

const {ccclass} = _decorator;
@ccclass('NWinLayer')
export class NWinLayer extends TLayer {
    enterStage(key: number): void {
        switch (key) {
            case E_StageType.LOBBY:
                NGlobal.winMgr.reBuildLobbyWin();
                break;

            default:
                break;
        }
    }

    exitStage(key: number, lastKey?: number): void {
        switch (lastKey) {
            case E_StageType.LOBBY:
                switch (NGlobal.mainScene.nextStage) {
                    case E_StageType.BATTLE: // Lobby -> Battle
                        NGlobal.winMgr.recordWinPath();
                        NGlobal.winMgr.removeAllWin();
                        break;
                    default:
                        break;
                }
                break;
            default:
                NGlobal.winMgr.closeAllWin();
                break;
        }
    }
}
