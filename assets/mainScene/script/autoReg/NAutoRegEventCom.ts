import {TAutoRegEventCom} from 'rubix-lib-hf';

// 指定项目需要处理的注册函数
export class NAutoRegEventCom extends TAutoRegEventCom {
    constructor(checkOb: any) {
        super(checkOb);

        this.addEventRegExp(/_NetRespone$/);
        this.addEventRegExp(/_click$/);
        this.addEventRegExp(/_toggle$/);
        this.addEventRegExp(/_CSEvent$/);
    }

    // 增加正则处理
    // protected registeredEvent(regInfo: IRegInfo): void {
    //     switch (regInfo.regType) {
    //         case 'CVEvent':
    //             NGlobal.eventMgr!.on(
    //                 regInfo.eventName.toUpperCase(),
    //                 regInfo.callback,
    //                 this._checkObject
    //             );
    //             break;
    //         default:
    //             super.registeredEvent(regInfo);
    //             break;
    //     }
    // }
}
