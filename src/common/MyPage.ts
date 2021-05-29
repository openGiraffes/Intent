import { Vue, Component, Prop, Watch, Mixins } from "vue-property-decorator";
import { Page } from '@/tool/Page';
import Loading from "@/mixins/Loading";
@Component
export default class MyPage extends Mixins(Vue, Loading) {
    $refs!: any;

    static RESULT_OK = -1;
    static RESULT_CANCEL = 0;

    __page: Page = null as any;

    get $page() {
        return this.__page;
    }

    isActivated = false;

    private mScrollableEls?: {
        x: { el: Element, value: number }[],
        y: { el: Element, value: number }[],
    } | null;

    created() {

        if (!this.__page) {
            this.__page = new Page(this);
        }
    }

    mounted() {
        this.onStart();
        this.isActivated = true;
    }

    destroyed() {
        // this.$tv.resetLimitingEl();
    }

    activated() {
        this.onResume();
        if (this.isActivated) {
            return;
        }
        this.isActivated = true;
    }

    deactivated() {
        this.isActivated = false;
    }

    saveScrollableEls() {
        let x = this.$el.getElementsByClassName("scroll-x");
        let xEls: { el: Element, value: number }[] = [];
        for (let i = 0; i < x.length; i++) {
            const element = x[i];
            xEls.push({ el: element, value: element.scrollLeft });
        }
        let y = this.$el.getElementsByClassName("scroll-y");
        let yEls: { el: Element, value: number }[] = [];
        for (let i = 0; i < y.length; i++) {
            const element = y[i];
            yEls.push({ el: element, value: element.scrollTop });
        }
        this.mScrollableEls = {
            x: xEls,
            y: yEls,
        }
    }

    loadScrollableEls() {
        if (!this.mScrollableEls) {
            return;
        }
        this.mScrollableEls.x.forEach(item => {
            item.el && (item.el.scrollLeft = item.value);
        });
        this.mScrollableEls.y.forEach(item => {
            item.el && (item.el.scrollTop = item.value);
        });
        this.mScrollableEls = null;
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

    close() {
        this.__page.close();
    }

    reload() {
        this.__page.reload();
    }

    onStart(fromBack = false) {
        // console.log(this.$page.name, "onStart", fromBack);
        this.__page.onStart(fromBack);
        this.loadScrollableEls();
        this.$tv.limitingEl = this.$el;
        if (!fromBack) {
            this.$nextTick(() => {
                let el = this.$el.querySelector("[focusable]");
                el && this.$tv.requestFocus(el);
            })
        }
    }

    onResume() {
    }

    onPause() {
    }

    onStop() {
        this.saveScrollableEls();
    }

    startPageForResult(config: any, requestCode: number,) {
        this.$page.startPageForResult(config, requestCode);
    }

    setResult(resultCode: number, data?: any) {
        this.$page.setResult(resultCode, data);
    }

    onPageResult(requestCode: number, resultCode: number, data: any) {

    }


}
