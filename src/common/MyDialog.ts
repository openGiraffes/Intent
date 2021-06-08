import { Vue, Component, Prop, Watch, PropSync, Emit } from "vue-property-decorator";
import { Page } from '@/tool/Page';
import R from "./R";
import MyComponent from "./MyComponent";
@Component
export default class MyDialog extends MyComponent {

    @PropSync("show", { type: Boolean }) syncedShow!: boolean;

    get mStatusBarHeight() {
        return R.dimen.statusBarHeight + "px";
    }


    @Watch("syncedShow")
    onChange_Show(value) {
        if (value) {
            this.push();
            this.onShow();
        } else {
            this.remove();
        }
    }

    onShow() {

    }

    @Emit("on-close")
    onClose() {

    }

    push() {
        if (this.$page) {
            this.$page.pushDialog(this);
        } else {
            this.$pager.pushDialog(this);
        }
    }

    remove() {
        if (this.$page) {
            this.$page.removeDialog(this);
        } else {
            this.$pager.removeDialog(this);
        }
    }

    isSupportClose(): boolean {
        return true;
    }

    close(): boolean {
        if (this.isSupportClose()) {
            this.syncedShow = false;
            return true;
        }
        return false;
    }
}