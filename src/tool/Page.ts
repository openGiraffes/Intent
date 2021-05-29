import MyPage from "@/common/MyPage";
import MyDialog from '@/common/MyDialog';
import MyFragment from '@/common/MyFragment';
import Vue from "vue";

export class Page {
    private mVue: MyPage;
    params: {
        [key: string]: any
    } & Object = {};
    tempParams: any;
    private dialogs: Record<string, MyDialog> = {};
    name: string = "";
    id?: string;
    meta?: any;

    private fragments: Record<string, MyFragment> = {}

    pageRequestData = {
        resultCode: MyPage.RESULT_CANCEL,
        data: {},
    };
    requestPageId?: string;

    constructor(vue: MyPage) {
        this.mVue = vue;
        this.init();
    }

    init() {
        let context = this.mVue;
        this.name = context.$route.name || "";
        this.meta = context.$route.meta;

        if (context.$route.query) {
            if (context.$route.query.params) {
                this.params = JSON.parse((context.$route.query as any).params);
            }
            this.id = context.$route.query.pageId as string;
            this.requestPageId = context.$route.query.requestPageId as string;

        }

        if (context.$route.params) {
            this.tempParams = context.$route.params;
        }
    }

    removeParam(paramName: string) {
        if (this.params.hasOwnProperty(paramName)) {
            delete this.params[paramName];
            this.syncParams();
        }
    }

    pushParam(paramName: string, value: any) {
        if (this.params[paramName] == value) {
            return;
        }
        this.params[paramName] = value;
        this.syncParams();
    }

    syncParams() {
        const query = Object.assign({}, this.mVue.$route.query, {
            params: JSON.stringify(this.params)
        })
        this.mVue.$router.replace({ query });
    }

    pushDialog(vue: MyDialog) {
        this.mVue.onPause();
        this.dialogs[vue._uid] = vue;
    }

    removeDialog(vue: MyDialog) {
        delete this.dialogs[vue._uid];
        this.mVue.onResume();
    }

    getTopDialog() {
        const keys = Object.keys(this.dialogs);
        if (keys.length == 0) {
            return null;
        }
        return this.dialogs[keys[keys.length - 1]];
    }

    reload() {
        this.mVue.$pager.reload(this.mVue._uid);
    }

    close() {
        this._close();
    }

    private _close() {
        if (this.requestPageId) {
            let find = this.mVue.$pager.PageResults.find(o => o.requestPageId == this.requestPageId);
            if (find) {
                find.resultCode = this.pageRequestData.resultCode;
                find.data = this.pageRequestData.data;
            }
        }
        this.mVue.$pager.close(this.id!);
    }


    pushFragment(vue: MyFragment) {
        // this.mVue.onPause();
        this.fragments[vue._uid] = vue;
    }

    removeFragment(vue: MyFragment) {
        delete this.fragments[vue._uid];
    }

    onStart(fromBack: boolean) {
        if (fromBack) {
            let findIndex = this.mVue.$pager.PageResults.findIndex(o => o.requestPageId == this.id);
            if (findIndex !== -1) {
                let data = this.mVue.$pager.PageResults.splice(findIndex, 1)[0];
                this.onPageResult(data.requestCode, data.resultCode!, data.data!);
            }
        }
    }

    startPageForResult(config: any, requestCode: number,) {
        this.mVue.$pager.PageResults.push({
            requestCode: requestCode,
            requestPageId: this.id!,
        });
        this.mVue.$pager.navigateTo(Object.assign({ requestPageId: this.id }, config));
    }

    setResult(resultCode: number, data: any = {}) {
        this.pageRequestData.resultCode = resultCode;
        this.pageRequestData.data = data;
    }

    onPageResult(requestCode: number, resultCode: number, data: any) {
        this.mVue.onPageResult(requestCode, resultCode, data);
        for (const key in this.fragments) {
            this.fragments[key].onPageResult(requestCode, resultCode, data);
        }
    }
}