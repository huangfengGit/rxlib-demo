import {
    AssetManager,
    log,
    ResolutionPolicy,
    screen,
    Size,
    UITransform,
    view,
    _decorator,
} from 'cc';
import {DEBUG} from 'cc/env';
import {TAutoRegEventCom, TScene} from 'rubix-lib-hf';
import {E_StageType} from './mainScene/script/global/NEnum';
import {gFunctions, NGlobal} from './mainScene/script/global/NGlobal';
import {NDebugLayer} from './mainScene/script/layer/NDebugLayer';
import {NTopLayer} from './mainScene/script/layer/NTopLayer';
import {NWinLayer} from './mainScene/script/layer/NWinLayer';

const {ccclass} = _decorator;
@ccclass('NMainScene')
export class NMainScene extends TScene {
    private _nextStage: E_StageType;
    public get nextStage(): E_StageType {
        return this._nextStage;
    }

    private _autoRegCom: TAutoRegEventCom;

    onLoad() {
        super.onLoad();
        NGlobal.Init(this);
        this._autoRegCom = new TAutoRegEventCom(this);
        this._autoRegCom.addEventRegExp(/_NetRespone$/);
        this.getDebugLayer().node.active = false;
        if (!DEBUG) {
            this.getDebugLayer().destroy();
        }
    }

    start() {
        this._autoRegCom.autoRegisteredEvent();
        this._lastStageKey = E_StageType.NONE;
        this._stageKey = E_StageType.NONE;

        // assetManager.loadBundle('common', () => {
        //     this.enterStage(E_StageType.LOBBY);
        //     this.initAudio();
        // });
    }

    public autoAdapterSize() {
        log('autoAdapterSize');
        let dr = view.getDesignResolutionSize();
        let s = screen.windowSize;
        log('screen size', s.width, s.height);
        let rw = s.width;
        let rh = s.height;
        let finalW = rw;
        let finalH = rh;

        if (rw / rh > dr.width / dr.height) {
            finalH = dr.height;
            finalW = (finalH * rw) / rh;
        } else {
            finalW = dr.width;
            finalH = (rh / rw) * finalW;
        }

        view.setDesignResolutionSize(finalW, finalH, ResolutionPolicy.UNKNOWN);
        let cvs = this.getComponent(UITransform);
        cvs.width = finalW;
        cvs.height = finalH;
        log('final size', finalW, finalH);
    }

    /**
     * getContentSize
     */
    public getContentSize(): Size {
        let cvs = this.getComponent(UITransform);
        return new Size(cvs.width, cvs.height);
    }

    /**
     * getWinLayer
     */
    public getWinLayer(): NWinLayer {
        return this.layerList[2];
    }

    public getTopLayer(): NTopLayer {
        return this.layerList[3] as NTopLayer;
    }

    public getDebugLayer(): NDebugLayer {
        return this.layerList[4] as NDebugLayer;
    }

    public enterStage(stageKey: number): void {
        if (this._stageKey != E_StageType.LOADING) {
            this._nextStage = stageKey;
            stageKey = E_StageType.LOADING;
        } else {
            this._nextStage = E_StageType.NONE;
        }
        NGlobal.AssteMgr.loadBundleAsync(
            gFunctions.getBundleNameByStageKey(stageKey)
        ).then((_: AssetManager.Bundle) => {
            super.enterStage(stageKey);
            NGlobal.winMgr.currStageKey = stageKey;
        });
    }

    public exitStage(lastStageKey: number, stageKey: number): any {
        // NOTE: 清理资源等等
        log(lastStageKey);
        switch (stageKey) {
            case E_StageType.LOBBY:
                break;

            default:
                break;
        }
    }
}
