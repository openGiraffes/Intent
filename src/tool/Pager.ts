
import { Component, Vue } from 'vue-property-decorator';
import { RouteConfig, Route, NavigationGuard, NavigationGuardNext } from 'vue-router'
import MyDialog from '@/common/MyDialog';
import { Page } from '@/tool/Page';
import MyPage from '@/common/MyPage';
import { VNode } from 'vue';

interface PageResult {
    requestPageId: string,
    requestCode: number,
    resultCode?: number,
    data?: any,
}

export interface PageLocation {
    name?: string
    path?: string
    hash?: string
    params?: Record<string, any>;
    tempParams?: Record<string, any>;
    append?: boolean
    replace?: boolean
}

export type PageRawLocation = string | PageLocation;

@Component
export default class Pager extends Vue {

    App: any;
    KeepAlive = true;
    PageResults: PageResult[] = []
    private Dialogs: Record<string, MyDialog> = {};

    navigateTo(nameOrConfig: PageRawLocation, params?: any) {
        let config: any = {};
        let requestPageId: string | null = null;
        if (typeof (nameOrConfig) == 'string') {
            config['name'] = nameOrConfig;
        } else {
            if (nameOrConfig["requestPageId"]) {
                requestPageId = nameOrConfig["requestPageId"];
            }
            config = Object.assign(config, nameOrConfig);
        }
        let _params = {
            // pageId: this.createPageId(),
        };
        if (params) {
            Object.assign(_params, params);
        } else {
            if (config["params"]) {
                Object.assign(_params, config["params"]);
            }
        }
        config["query"] = { params: JSON.stringify(_params) }
        if (requestPageId) {
            config["query"].requestPageId = requestPageId;
        }
        const tempParams = config["tempParams"]
        if (tempParams) {
            delete config.tempParams;
            config["params"] = tempParams;
        }

        //params && (config["query"] = params);
        this.$router.push(config);
    }


    close(id: string, back: boolean) {
        if (!this.App) {
            return;
        }
        back && window.history.go(-1);
        this.destroyPage(id);
    }

    reload(id: string) {
        this.destroyPage(id);
        this.navigateTo("Reload");
    }

    pushDialog(vue: MyDialog) {
        this.currentPage()?.onPause();
        this.Dialogs[vue._uid] = vue;
    }

    removeDialog(vue: MyDialog) {
        delete this.Dialogs[vue._uid];
        this.currentPage()?.onResume();
    }

    currentPage(): MyPage | null {
        let router = this.App?.$refs.RouterView;
        if (!router) {
            // throw new Error("页面异常");
            return null;
        }
        let cache: { [key: string]: VNode } = router.$options.parent!.cache;
        let keys: string[] = router.$options.parent.keys;
        return cache[keys[keys.length - 1]].componentInstance as MyPage;
    }

    destroyPage(id: string) {
        let router = this.App.$refs.RouterView;
        if (!router) {
            return;
        }
        let cache: { [key: string]: VNode } = router.$options.parent.cache;
        let keys: string[] = router.$options.parent.keys;
        keys.splice(keys.indexOf(id), 1);
        let vue = cache[id].componentInstance;
        vue && vue.$destroy();
        delete cache[id];
    }

    destroyAllPage() {
        let router = this.App.$refs.RouterView;
        if (!router) {
            return;
        }
        let cache: { [key: string]: VNode } = router.$options.parent.cache;
        let keys: string[] = router.$options.parent.keys;
        keys.forEach(id => {
            keys.splice(keys.indexOf(id), 1);
            let vue = cache[id].componentInstance;
            vue && vue.$destroy();
            delete cache[id];
        });
    }

}
