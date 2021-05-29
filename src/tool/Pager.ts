
import { Component, Vue } from 'vue-property-decorator';
import { RouteConfig, Route, NavigationGuard, NavigationGuardNext } from 'vue-router'
import MyDialog from '@/common/MyDialog';
import { Page } from '@/tool/Page';
import MyPage from '@/common/MyPage';

interface PageResult {
    requestPageId: string,
    requestCode: number,
    resultCode?: number,
    data?: any,
}

@Component
export default class Pager extends Vue {

    App: any;
    KeepAlive = true;
    PageResults: PageResult[] = []

    navigateTo(nameOrConfig: string | Object, params?: any) {
        let config: any = {};
        let requestPageId:string | null = null;
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


    close(id: string) {
        if (!this.App) {
            return;
        }
        window.history.go(-1);
        this.App.destroyPage(id);
    }

    reload(vueUid = 0) {
        this.$children[0]["reloadCurrentPage"]();
    }

    currentPage(): MyPage {
        return this.App.currentPage();
    }

}
