import {Button} from 'cc';
import {C_AUDIO_KEY} from './NConst';
import {NGlobal} from './NGlobal';

function setButtonSound(): void {
    if (Button.prototype['touchBeganClone']) return;

    Button.prototype['touchBeganClone'] = Button.prototype['_onTouchEnded'];

    Button.prototype['_onTouchEnded'] = function (event) {
        if (this.interactable && this.enabledInHierarchy) {
            // 播放自己的按钮音效
            NGlobal.audioMgr.playSound(C_AUDIO_KEY.BUTTON_CLICK);
        }
        this.touchBeganClone(event);
    };
}

setButtonSound();
