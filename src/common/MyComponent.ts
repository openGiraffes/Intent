
import { Vue, Component, Inject } from "vue-property-decorator";
import R from "@/common/R";
import { Page } from '@/tool/Page';



@Component
export default class MyComponent extends Vue {
    R = R;

    declare $refs: any;
    // $page!: Page;

    get $page(): Page {
        const getPage = (vue: any): Page | null => {
            if (vue.$parent) {
                if (vue.$parent.__page) {
                    return vue.$parent.__page;
                } else {
                    return getPage(vue.$parent);
                }
            } else {
                return null;
            }
        }
        return getPage(this)!;
    }

}
