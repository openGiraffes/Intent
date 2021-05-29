import { Vue, Component, Prop, Watch, PropSync, Emit } from "vue-property-decorator";
import { Page } from '@/tool/Page';
import R from "./R";
@Component
export default class MyDialog extends Vue {

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
        this.$pager.currentPage().$page.pushDialog(this)
    }

    remove() {
        this.$pager.currentPage().$page.removeDialog(this)
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