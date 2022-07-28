import Pako from 'pako';
import CryptoES from 'crypto-es';

export enum E_Net_Compresstype {
    NONE = 0,
    FLATE = 1,
    ZLIB = 2,
    GZIP = 3,
    LZW = 4,
}

export const wordArrayToUint8Array = (wordArray: any) => {
    let len = wordArray.words.length;
    let u8_array = new Uint8Array(len << 2);
    let offset = 0;
    let word = 0;
    for (let i: number = 0; i < len; i++) {
        word = wordArray.words[i];
        u8_array[offset++] = word >> 24;
        u8_array[offset++] = (word >> 16) & 0xff;
        u8_array[offset++] = (word >> 8) & 0xff;
        u8_array[offset++] = word & 0xff;
    }
    return u8_array;
};

export const packagaMsg = (data: JSON, compressType: E_Net_Compresstype) => {
    let u8 = wordArrayToUint8Array(
        CryptoES.enc.Utf8.parse(JSON.stringify(data))
    );
    let sendData: any;
    switch (compressType) {
        case E_Net_Compresstype.NONE:
            sendData = JSON.stringify(data);
            break;
        case E_Net_Compresstype.FLATE:
            sendData = Pako.deflate(u8, {raw: true});
            break;
        case E_Net_Compresstype.GZIP:
            sendData = Pako.deflate(u8);
            break;
    }
    return sendData;
};

export const unPackageMsg = (data: any, compressType: E_Net_Compresstype) => {
    let u8 = new Uint8Array(data);
    let sRcv: string;
    switch (compressType) {
        case E_Net_Compresstype.NONE:
            sRcv = JSON.parse(data);
            break;
        case E_Net_Compresstype.FLATE:
            sRcv = JSON.parse(
                Pako.inflate(u8, {
                    to: 'string',
                    raw: true,
                })
            );
            break;
        case E_Net_Compresstype.GZIP:
            sRcv = JSON.parse(Pako.inflate(u8, {to: 'string'}));
            break;
    }
    return sRcv;
};

export interface C2S_Plat_Token_Login {
    do: string;
    data: {
        platinfo: {
            cacheToken: boolean;
            uid: string;
            platid: number;
            osname: string;
            plattoken: string;
        };
    };
    gameid: number;
    zoneid: number;
}

/*
 * 获取网关地址
 * */
export interface C2S_Request_Select_Zone {
    do: string;
    data: {};
    gameid: number;
    zoneid: number;
    uid: string;
    unigame_plat_login: string;
    unigame_plat_timestamp: number;
}

// /*
//  * 网关验证
//  * */
export interface C2S_WebSocketForwardUserPmd {
    do: string;
    gameid: number;
    zoneid: number;
    uid: string;
    unigame_plat_login: string;
    unigame_plat_timestamp: number;
    data: {
        accountid: number;
    };
}

export interface S2C_PLAT_TOKEN_LOGIN {
    do: string;
    data: {
        platinfo: {
            account: number;
            cacheToken: boolean;
            gameid: number;
            osname: string;
            platid: number;
            uid: string;
        };
        sid: string;
        timezone_name: string;
        timezone_offset: number;
        uid: string;
        unigame_plat_key: string;
        unigame_plat_login: string;
        unigame_plat_login_life: number;
    };
    gameid: number;
    zoneid: number;
    unigame_plat_key: string;
    unigame_plat_login: string;
    unigame_plat_login_timeout: number;
}

export interface S2C_REQUEST_SELECT_ZONE {
    do: string;
    uid: string;
    unigame_plat_login: string;
    unigame_plat_timestamp: number;
    data: {
        accountid: string;
        gameid: number;
        gatewayurl: string;
        gatewayurlws: string;
    };
    errno: number;
}
