/*
 * npm install  CryptoES
 * npm install  Pako
 * */

import {log} from 'cc';
import CryptoES from 'crypto-es';
import {C_CUSTOM_EVENT} from '../../global/NConst';
import {NGlobal} from '../../global/NGlobal';
import NP from '../netProtocol.js';
import {
    C2S_Plat_Token_Login,
    C2S_Request_Select_Zone,
    E_Net_Compresstype,
    S2C_PLAT_TOKEN_LOGIN,
    S2C_REQUEST_SELECT_ZONE,
} from './uniLibCore';

const C_GAME_ID = 8001;
const C_ZONE_ID = 1004;

// const C_LOGIN_SVR_URL = 'http://47.108.206.61:8000/httplogin';
/*
 *   游客登录
 * */

export namespace uniLib {
    export class LoginRegisterCom {
        private _platTokenLoginData: S2C_PLAT_TOKEN_LOGIN;
        private _loginUrl: string;

        private _wsSvrUrl: string;

        constructor() {
            NGlobal.eventMgr!.on(
                C_CUSTOM_EVENT.Net_Connect_Success,
                this.Net_Connect_Success_CSEvent,
                this
            );
        }

        /*
         *   游客登录
         * */
        public platTokenLogin(
            url: string,
            uid?: string,
            token?: string,
            platid?: number
        ) {
            this._loginUrl = url;
            let param: C2S_Plat_Token_Login = {
                do: 'plat-token-login',
                data: {
                    platinfo: {
                        cacheToken: false,
                        uid: uid,
                        platid: platid,
                        osname: '_',
                        plattoken: token,
                    },
                },
                gameid: C_GAME_ID,
                zoneid: C_ZONE_ID,
            };

            NGlobal.netMgr.http.post(
                this._loginUrl,
                param,
                this.platTokenLogin_Respone.bind(this)
            );
            log('sendData:C2S_Plat_Token_Login', param);
        }

        /*
         * 获取网关地址
         * */
        protected platTokenLogin_Respone(xhr: XMLHttpRequest) {
            this._platTokenLoginData = JSON.parse(xhr.response);
            log('revdata:', this._platTokenLoginData);

            let aTime = Math.floor(new Date().getTime() / 1000);
            let cmd: C2S_Request_Select_Zone = {
                do: 'request-select-zone',
                data: {},
                gameid: this._platTokenLoginData.gameid,
                zoneid: this._platTokenLoginData.zoneid,
                uid: this._platTokenLoginData.data.uid,
                unigame_plat_login: this._platTokenLoginData.unigame_plat_login,
                unigame_plat_timestamp: aTime,
            };
            let unigame_plat_sign =
                'unigame_plat_sign=' +
                CryptoES.MD5(
                    JSON.stringify(cmd).toString() +
                        aTime +
                        this._platTokenLoginData.unigame_plat_key
                ).toString();
            let sDo = 'do=' + cmd.do;
            let sUrl = this._loginUrl + '?' + unigame_plat_sign + '&' + sDo;

            NGlobal.netMgr.http.post(
                sUrl,
                cmd,
                this.requestSelectZone_Respone.bind(this)
            );
            log('sendData:', 'request-select-zone', cmd);
        }

        /*
         * 网关验证
         * */
        protected requestSelectZone_Respone(xhr: XMLHttpRequest) {
            let data: S2C_REQUEST_SELECT_ZONE = JSON.parse(xhr.response);
            log('revdata:', data);
            if (data.errno == 0) {
                this._wsSvrUrl = data.data.gatewayurlws + '/json';
                log('ws connent:', this._wsSvrUrl);
                NGlobal.netMgr.ws.connect(this._wsSvrUrl);
                // let cmd: NP.Pmd.WebSocketForwardUserPmd_C =
                //     NP.Pmd.WebSocketForwardUserPmd_C.create();
                // cmd.do = 'Pmd.WebSocketForwardUserPmd_C';
                // cmd.data = {
                //     accountid: this._platTokenLoginData.data.platinfo.account,
                // };
                // cmd.gameid = this._platTokenLoginData.gameid;
                // cmd.zoneid = this._platTokenLoginData.zoneid;
                // cmd.uid = data.uid;
                // cmd.unigame_plat_timestamp = data.unigame_plat_timestamp;
                // cmd.unigame_plat_login = data.unigame_plat_login;
                // let urlParam =
                //     '?unigame_plat_sign=' +
                //     CryptoES.MD5(
                //         JSON.stringify(cmd.toJSON()) +
                //             cmd.unigame_plat_timestamp +
                //             this._platTokenLoginData.unigame_plat_key
                //     ).toString() +
                //     '&do=' +
                //     cmd.do;
                // NGlobal.netMgr.http.post(
                //     data.data.gatewayurl + urlParam,
                //     cmd,
                //     this.PmdWebSocketForwardUserPmd_Respone.bind(this)
                // );
                // log('sendData:', 'Pmd.WebSocketForwardUserPmd_C', cmd);
            }
        }

        /*
         * 开始网关登录
         * */
        // protected PmdWebSocketForwardUserPmd_Respone(xhr: XMLHttpRequest) {
        //     let data: NP.Pmd.IWebSocketForwardUserPmd_S = JSON.parse(
        //         xhr.response
        //     );
        //     log('revdata:', data);
        //     if (data.errno != '0') {
        //     } else {
        //         this._wsSvrUrl = data.data.jsongatewayurl;
        //         log('ws connent:', this._wsSvrUrl);
        //         NGlobal.netMgr.ws.connect(this._wsSvrUrl);
        //     }
        // }

        /**
         *
         * websocket 连接成功
         * 发送验证信息到服务器
         */
        public Net_Connect_Success_CSEvent() {
            log('Connect_Success');
            let cmd: NP.Pmd.UserLoginTokenLoginUserPmd_C =
                NP.Pmd.UserLoginTokenLoginUserPmd_C.create();

            cmd.cmd_name = 'Pmd.UserLoginTokenLoginUserPmd_C';
            cmd.accountid = Number(this._platTokenLoginData.data.uid);
            cmd.url = this._wsSvrUrl;
            cmd.gameid = this._platTokenLoginData.gameid;
            cmd.zoneid = this._platTokenLoginData.zoneid;
            cmd.timestamp = Math.floor(new Date().getTime() / 1000);
            cmd.logintempid = 0;
            cmd.compress = 'flate';
            cmd.tokenmd5 = CryptoES.MD5(
                String(cmd.accountid) +
                    String(cmd.logintempid) +
                    String(cmd.timestamp) +
                    this._platTokenLoginData.unigame_plat_key
            ).toString();

            NGlobal.netMgr.ws.sendData(cmd.toJSON());
            NGlobal.netMgr.ws.compressType = E_Net_Compresstype.FLATE;
        }
    }
}
