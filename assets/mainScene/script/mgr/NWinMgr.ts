import {Node} from 'cc';
import * as rx from 'rubix-lib-hf';
import {TWindow} from 'rubix-lib-hf';
import {E_StageType} from '../global/NEnum';
import {NFunctionClass} from '../global/NFunction';

export class NWinMgr extends rx.TWinMgr {
    private _gFunc: NFunctionClass;

    private _currStageKey: E_StageType;
    public get currStageKey(): E_StageType {
        return this._currStageKey;
    }
    public set currStageKey(v: E_StageType) {
        this._currStageKey = v;
    }

    private _lastWinPathList: Array<TWindow>;

    constructor(winLayer: Node, gfunc: NFunctionClass) {
        super(winLayer);
        this._gFunc = gfunc;
        this._lastWinPathList = new Array<TWindow>();
    }

    public showWin(
        winPath: string,
        winData?: any,
        onClose?: (data: any) => void
    ): Promise<TWindow> {
        this._gFunc.showWaitLayer();
        let bundleName = this._gFunc.getBundleNameByStageKey(
            this._currStageKey
        );
        return super.showWin(winPath, bundleName, winData, onClose);
    }

    /**
     * recordWinPath
     */
    public recordWinPath() {
        this._lastWinPathList.length = 0;
        for (const aWin of this._winList) {
            this._lastWinPathList.push(aWin);
        }
    }

    /**
     * removeAllWin
     */
    public removeAllWin() {
        for (const aWin of this._winList) {
            aWin.node.removeFromParent();
        }
        this._winList.length = 0;
    }

    /**
     * reBuildLobbyWin
     */
    public async reBuildLobbyWin() {
        for (const win of this._lastWinPathList) {
            this._winLayer.addChild(win.node);
            this._winList.push(win);
        }
    }
}
