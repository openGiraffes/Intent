import Vue from 'vue'
import VueI18n, { LocaleMessages } from "vue-i18n";
import Axios from "axios";

Vue.use(VueI18n);

export let i18n: VueI18n;

export const init = (callback: (i18n: VueI18n) => void) => {

    Axios.get("lang/lang.json",).then((res) => {
        let lang = res.data as string[];
        if (!lang.length) {
            return;
        }
        Axios.all(lang.map(o => { return Axios.get(`lang/${o}.json`,) })).then((res) => {
            const messages: LocaleMessages = {};
            lang.forEach((item, index) => {
                messages[item] = res[index].data;
            });
            i18n = new VueI18n({
                locale: navigator.language || "zh",
                //   fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || "zh",
                messages: messages,
            });
            callback(i18n);
        })
    })

}

export default {
    init: init,
}
