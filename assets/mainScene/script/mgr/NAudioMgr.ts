import {AudioClip, AudioSource} from 'cc';
import {NMainScene} from '../../../NMainScene';
import {C_AUDIO_KEY, C_LOCAL_CACHE_KEY} from '../global/NConst';
import {E_StageType} from '../global/NEnum';
import {NUserData} from '../userData/NUserData';
import {NAssetsMgr} from './NAssetsMgr';

/**音频管理器 */
export class NAudioMgr {
    protected _clipList: Map<string, AudioClip>;
    protected _soundAudioSource: AudioSource;
    protected _musicAudioSource: AudioSource;

    private _isLoading: boolean;

    private _isPlayMusic: boolean;
    public get isPlayMusic(): boolean {
        return this._isPlayMusic;
    }
    public set isPlayMusic(v: boolean) {
        this._isPlayMusic = v;
        this._userdata.localCache.setLocalDataForKey(
            C_LOCAL_CACHE_KEY.MUSIC,
            v
        );
        this.playMusic();
    }

    private _isPlaySound: boolean;
    public get isPlaySound(): boolean {
        return this._isPlaySound;
    }
    public set isPlaySound(v: boolean) {
        this._userdata.localCache.setLocalDataForKey(
            C_LOCAL_CACHE_KEY.SOUND,
            v
        );
        this._isPlaySound = v;
    }

    private _mainScene: NMainScene;
    private _userdata: NUserData;

    constructor(mainScene: NMainScene, userdata: NUserData) {
        this._mainScene = mainScene;
        this._userdata = userdata;
        this._isLoading = false;
        this._clipList = new Map();
        this._soundAudioSource = new AudioSource();
        this._musicAudioSource = new AudioSource();
        // this._soundAudioSource.volume = 0.5;
        this._musicAudioSource.volume = 0.2;
    }

    public async init(
        resMrg: NAssetsMgr,
        bundleName: string,
        resPath: string,
        SoudList: any
    ) {
        for (const key in SoudList) {
            let clip = await resMrg.loadResAsync(
                resPath + SoudList[key],
                bundleName,
                AudioClip
            );
            this._clipList[SoudList[key]] = clip;
        }
        this._isLoading = true;
        this._isPlayMusic =
            this._userdata.localCache.getLocalDataForKey(
                C_LOCAL_CACHE_KEY.MUSIC,
                'true'
            ) == 'true';

        this._isPlaySound =
            this._userdata.localCache.getLocalDataForKey(
                C_LOCAL_CACHE_KEY.SOUND,
                'true'
            ) == 'true';
    }

    public playSound(key: string) {
        if (!this._isLoading || !this._isPlaySound) {
            return;
        }
        this._soundAudioSource.playOneShot(this._clipList[key]);
    }

    public playMusic() {
        if (!this._isLoading) return;

        if (this._isPlayMusic) {
            this.stopMusic();
            switch (this._mainScene.stageKey) {
                case E_StageType.LOBBY:
                    this._musicAudioSource.clip =
                        this._clipList[C_AUDIO_KEY.BGM];
                    break;
                case E_StageType.BATTLE:
                    this._musicAudioSource.clip =
                        this._clipList[C_AUDIO_KEY.BATTLEBGM];
                    break;
            }
            this._musicAudioSource.loop = true;
            this._musicAudioSource.play();
        } else {
            this.stopMusic();
        }
    }

    /**
     * stopMusic
     */
    public stopMusic() {
        this._musicAudioSource.stop();
    }
}
