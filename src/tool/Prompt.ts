
import { Vue, Component } from "vue-property-decorator";

@Component
export default class Prompt extends Vue {

    mLoading: any;


    showToast(msg: string | any) {
        if (msg == undefined || msg == null) {
            return;
        }
        const create = this.createComponent(require("@/components/Toast.vue"));
        const com = new create.component({
            propsData: { msg, },
        });
        com.$on("close", () => {
            com.$destroy();
            create.remove();
        })
        com.$mount(create.layout);
    }

    showLoading(msg?: string | any) {
        const create = this.createComponent(require("@/components/Loading.vue"));
        const com = new create.component({
            propsData: { msg, },
        });
        com.$on("close", () => {
            com.$destroy();
            create.remove();
        })
        com.$mount(create.layout);
        this.mLoading = () => {
            com.$destroy();
            create.remove();
        };
    }

    closeLoading() {
        if (this.mLoading) {
            this.mLoading();
            this.mLoading = null;
        }
    }

    private createComponent = (com: any) => {
        const el = document.body;
        const div = el.appendChild(document.createElement("div"));
        const div2 = div.appendChild(document.createElement("div"));
        const MyVue = Vue.extend() as any;
        return {
            component: MyVue.extend(com.default),
            remove: () => {
                el.removeChild(div);
            },
            layout: div2,
        }
    }
}

