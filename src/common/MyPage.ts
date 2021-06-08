import { Vue, Component, Prop, Watch, Mixins } from "vue-property-decorator";
import { Page } from '@/tool/Page';
import Loading from "@/mixins/Loading";
import PageLifeCycle from "@/mixins/PageLifeCycle";
import { PageRawLocation } from "@/tool/Pager";

@Component
export default class MyPage extends Mixins(Vue, Loading, PageLifeCycle) {

    declare $refs: any;

    static RESULT_OK = -1;
    static RESULT_CANCEL = 0;

    __page: Page = null as any;

    get $page() {
        return this.__page;
    }

    created() {
        if (!this.__page) {
            this.__page = new Page(this);
        }
    }


    requestFocus(el?: Element) {
        if (el) {
            this.$tv.requestFocus(el);
        } else {
            let firstEl = this.$el.querySelector("[focusable]");
            firstEl && this.$tv.requestFocus(firstEl);
        }
    }


    isSupportClose(): boolean {
        return true;
    }

    onBackPressed() {
        if (this.isSupportClose()) {
            this.close();
        }
    }

    back() {
        const dialog = this.$page.getTopDialog();
        if (dialog && dialog.close()) {
            return;
        }
        this.onBackPressed();
    }

    close(back = true) {
        this.__page.close(back);
    }

    reload() {
        this.__page.reload();
    }

    protected _onStart(restart = false) {
        // console.log("onStart", this.$vnode.tag, restart);
        // fromBack && this.__page.reload();
        this.__page.onStart(restart);
        this.onStart();
        this.$tv.limitingEl = this.$el;
        if (!restart) {
            this.$nextTick(() => {
                this.requestFocus();
            })
        }
    }

    protected _onStop() {
        this.onStop();
    }

    startPage(config: PageRawLocation) {
        this.$pager.navigateTo(config);
    }

    startPageForResult(config: PageRawLocation, requestCode: number,) {
        this.$page.startPageForResult(config, requestCode);
    }

    setResult(resultCode: number, data?: any) {
        this.$page.setResult(resultCode, data);
    }

    onPageResult(requestCode: number, resultCode: number, data: any) {

    }


}
