import {EventTarget} from 'cc';
import {TGlobal} from 'rubix-lib-hf';
import {NMainScene} from '../../../NMainScene';
import {NAssetsMgr} from '../mgr/NAssetsMgr';
import {NAudioMgr} from '../mgr/NAudioMgr';
import {NWinMgr} from '../mgr/NWinMgr';
import {NNetMgr} from '../netWork/NNetMgr';
import {NUserData} from '../userData/NUserData';
import {NFunctionClass} from './NFunction';

export let gFunctions = new NFunctionClass();

class NGlobalClass {
    private _mainScene: NMainScene;
    public get mainScene(): NMainScene {
        return this._mainScene;
    }
    public set mainScene(value: NMainScene) {
        this._mainScene = value;
    }

    public get AssteMgr(): NAssetsMgr {
        return TGlobal.assteMgr as NAssetsMgr;
    }

    public get eventMgr(): EventTarget {
        return TGlobal.eventMgr;
    }

    private _winMgr: NWinMgr;
    public get winMgr(): NWinMgr {
        return this._winMgr;
    }

    private _netMgr: NNetMgr;
    public get netMgr(): NNetMgr {
        return this._netMgr;
    }

    private _userData: NUserData;
    public get userData(): NUserData {
        return this._userData;
    }

    private _audioMgr: NAudioMgr;
    public get audioMgr(): NAudioMgr {
        return this._audioMgr;
    }

    constructor() {}

    public Init(ms: NMainScene) {
        this._mainScene = ms;
        TGlobal.assteMgr = new NAssetsMgr();

        TGlobal.eventMgr = new EventTarget();
        this._netMgr = new NNetMgr(TGlobal.eventMgr, gFunctions);
        this._winMgr = new NWinMgr(
            this._mainScene.getWinLayer().node,
            gFunctions
        );
        this._userData = new NUserData(gFunctions, this._netMgr);
        this._audioMgr = new NAudioMgr(this._mainScene, this._userData);

        gFunctions.mainScene = this.mainScene;
        gFunctions.assetsMgr = this.AssteMgr;
        gFunctions.audioMgr = this._audioMgr;
    }
}
export let NGlobal = new NGlobalClass();
