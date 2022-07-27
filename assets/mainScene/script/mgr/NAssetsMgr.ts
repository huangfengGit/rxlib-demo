import {
    assetManager,
    instantiate,
    Node,
    Prefab,
    sp,
    Sprite,
    SpriteFrame,
} from 'cc';
import {TAssetsMgr} from 'rubix-lib-hf';
import {C_BUNDLE_LIST} from '../global/NConst';

export class NAssetsMgr extends TAssetsMgr {
    /**
     * create Prefab
     * @param url
     * @param bundleName
     */
    public async creatorPrefab(
        url: string,
        bundleName?: string
    ): Promise<Node> {
        let n = await this.loadResAsync(url, bundleName, Prefab);
        return instantiate(n);
    }

    /**
     * create Sprite
     * @param url
     * @param bundleName
     */
    public async createSprite(
        url: string,
        bundleName?: string
    ): Promise<Sprite> {
        let spf = await this.loadResAsync(url, bundleName, SpriteFrame);
        let node: Node = new Node();
        let sp = node.addComponent(Sprite);
        sp.spriteFrame = spf;
        return sp;
    }

    /**
     * creator spine
     * @param url
     * @param bundleName
     */
    public async creatorSpine(url: string, bundleName?: string) {
        let spnData = await this.loadResAsync(url, bundleName, sp.SkeletonData);
        let node: Node = new Node();
        let spn = node.addComponent(sp.Skeleton);
        spn.skeletonData = spnData;
        return spn;
    }
}
