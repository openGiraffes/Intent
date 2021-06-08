import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import Prompt from "@/tool/Prompt";

import "@/assets/css/styles.scss";
import "@/common/Common";
import "@/plugins";

import CommonUtils from "@/tool/Utils";
import { EventBus } from "@/tool/EventBus";
import Pager from "@/tool/Pager";

Vue.config.productionTip = false



const vue = new Vue({
    router,
    store,
    render: h => h(App)
});


Vue.prototype.$prompt = new Prompt();
Vue.prototype.$bus = EventBus;
Vue.prototype.$ct = new CommonUtils(vue);
Pager["options"].router = vue.$router;
Vue.prototype.$pager = new Pager();

const KaiOS = navigator.userAgent.indexOf("KAIOS") != -1 && window.Kaipay;

if (KaiOS || isDev) {
    vue.$mount('#app');
}

declare module "vue/types/vue" {
    interface Vue {
        $ct: CommonUtils;
        $prompt: Prompt;
        $bus: Vue;
        $pager: Pager;
        $super: this;

        _inactive: boolean;
        _isBeingDestroyed: boolean;
        _isDestroyed: boolean;
        _isMounted: boolean;
        _uid: number;
        _watchers: any[]
    }
}
