import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import Prompt from "@/tool/Prompt";

import "@/assets/css/styles.scss";
import "@/common/Common";

import CommonUtils from "@/tool/Utils";
import { EventBus } from "@/tool/EventBus";

Vue.config.productionTip = false



const vue = new Vue({
    router,
    store,
    render: h => h(App)
});


Vue.prototype.$prompt = new Prompt();
Vue.prototype.$bus = EventBus;
Vue.prototype.$ct = new CommonUtils(vue);

vue.$mount('#app')

declare module "vue/types/vue" {
    interface Vue {
        $ct: CommonUtils;
        $prompt: Prompt;
        $bus: Vue;

        _inactive: boolean;
        _isBeingDestroyed: boolean;
        _isDestroyed: boolean;
        _isMounted: boolean;
        _uid: number;
        _watchers: any[]
    }
}
