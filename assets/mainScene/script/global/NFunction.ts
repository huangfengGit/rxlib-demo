import {assetManager, isValid, Sprite, SpriteFrame, sys} from 'cc';
import {C_BUNDLE_LIST} from './NConst';
import {E_StageType, E_SysType} from './NEnum';
import {E_TOAST_TYPE} from '../topLayer/NToast';
import {NMainScene} from '../../../NMainScene';
import {NAssetsMgr} from '../mgr/NAssetsMgr';
import {NAudioMgr} from '../mgr/NAudioMgr';

export class NFunctionClass {
    private _mainScene: NMainScene;
    public set mainScene(v: NMainScene) {
        this._mainScene = v;
    }

    private _assetsMgr: NAssetsMgr;
    public set assetsMgr(v: NAssetsMgr) {
        this._assetsMgr = v;
    }

    private _audioMgr: NAudioMgr;
    public set audioMgr(v: NAudioMgr) {
        this._audioMgr = v;
    }

    constructor() {}

    getBundleNameByStageKey(key: E_StageType) {
        let ret: string;
        switch (key) {
            case E_StageType.LOADING:
                ret = C_BUNDLE_LIST.LOADING;
                break;
            case E_StageType.LOBBY:
                ret = C_BUNDLE_LIST.LOBBY;
                break;
            case E_StageType.BATTLE:
                ret = C_BUNDLE_LIST.BATTLE;
                break;
        }
        return ret;
    }

    setSpriteSprieFrameByUrl(sp: Sprite, url: string, bundleName: string) {
        let aBundle = assetManager.getBundle(bundleName);

        let spf = aBundle.get<SpriteFrame>(url);
        if (!spf) {
            this._assetsMgr
                .loadResAsync<SpriteFrame>(url, bundleName, SpriteFrame)
                .then((spf: SpriteFrame) => {
                    //可能对象已经调用了destory
                    if (isValid(sp.node, true)) {
                        sp.spriteFrame = spf;
                    }
                });
        } else {
            sp.spriteFrame = spf;
        }
    }

    showToast(s: string, toastType: E_TOAST_TYPE = E_TOAST_TYPE.correct) {
        this._mainScene.getTopLayer().showToast(s, toastType);
    }

    showWaitLayer(showAnimaDelay: number = 0.5) {
        this._mainScene.getTopLayer().showWaittingLayer(showAnimaDelay);
    }

    closeWaitLayer(bClean: boolean = false) {
        this._mainScene.getTopLayer().closeWaittingLayer(bClean);
    }
}
