import {
    Button,
    Component,
    Label,
    Mask,
    Sprite,
    UITransform,
    _decorator,
    Input,
    EventTouch,
    Rect,
    JsonAsset,
    Vec2,
} from 'cc';
import {C_BUNDLE_LIST} from '../global/NConst';
import {NGlobal} from '../global/NGlobal';

// enum E_TargerType {
//     NONE = 0,
//     STAGE_MAINUI = 1,
//     TOP_WIN = 2,
// }

interface IGuide {
    btn: string;
    clickEvent: string;
    hint: string;
    target: number;
}

const {ccclass, property} = _decorator;
@ccclass('NGuideLyt')
export class NGuideLyt extends Component {
    @property(Mask)
    mask: Mask;

    @property(Sprite)
    sp_mask: Sprite;

    @property(Label)
    lbl_hint: Label;

    private _jsonPath: string;
    public set jsonPath(v: string) {
        this._jsonPath = v;
        this.startGuide();
    }

    private _targetCom: Component;
    private _nodeUIT: UITransform;
    private _guideIdx: number = 0;
    private _guideList: Array<IGuide>;

    onLoad() {
        this._nodeUIT = this.node.getComponent(UITransform);
    }

    start() {
        this.node.on(Input.EventType.TOUCH_END, this.TouchEnd, this);
        this.node.on(Input.EventType.TOUCH_START, this.TouchStart, this);
    }
    /**
     * onClick
     */
    public TouchStart(event: EventTouch) {
        if (this.hitTest(event.getLocation())) {
            event.preventSwallow = true;
        }
    }

    /**
     * onClick
     */
    public TouchEnd(event: EventTouch) {
        if (this.hitTest(event.getLocation())) {
            event.preventSwallow = true;
            this.waitRunNext();
        }
    }

    public hitTest(point: Vec2) {
        let r: Rect = new Rect();
        let p = this._targetCom.node.getWorldPosition();
        let s = this._targetCom.getComponent(UITransform).contentSize;

        r.x = p.x - s.width * 0.5;
        r.y = p.y - s.height * 0.5;
        r.width = s.width;
        r.height = s.height;
        if (r.contains(point)) {
            return true;
        } else {
            return false;
        }
    }

    private startGuide() {
        NGlobal.AssteMgr.loadResAsync(
            this._jsonPath,
            C_BUNDLE_LIST.COMMON,
            JsonAsset
        ).then(() => {
            this.node.active = true;
            this._guideIdx = 0;
            this.runNext();
        });
    }

    private runNext() {
        if (this._guideIdx < this._guideList.length) {
        } else {
            this.node.active = false;
        }
    }

    private waitRunNext() {
        if (!NGlobal.mainScene.getTopLayer().isWaiting) {
            this.scheduleOnce(this.waitRunNext, 0.3);
        } else {
            this.runNext();
        }
    }

    /**
     * guide
     */
    public guideButton(btn: Button, sHint: string) {
        this.node.active = true;
        this._targetCom = btn;

        let p = this._nodeUIT.convertToNodeSpaceAR(btn.node.getWorldPosition());
        this.mask.getComponent(UITransform).contentSize =
            btn.node.getComponent(UITransform).contentSize;
        this.mask.node.setPosition(p);
        this.sp_mask.node.setPosition(-p.x, -p.y, 1);

        this.lbl_hint.string = sHint;
    }
}
