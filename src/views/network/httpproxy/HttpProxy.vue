<template>
    <Page class="HttpProxy" :options="mPageOptions">
        <div class="flex-v wh-100 scroll-y" ref="Items" v-keep-scroll>
            <Input v-focusable :value="mWifi && mWifi.ssid"
                :label="$t('wifi')" :placeholder="$t('please-select')" disabled
                @click.native="onClick_SelectWifi"></Input>
            <Input v-focusable v-model="mIpAndPort" ref="IpAndPort" type="text"
                :label="$t('proxy-address')" placeholder="xxx.xxx.xxx.xxx:xxxx"
                @click.native="onClick_IpAndPort" @onFocus.native="onFocus('IpAndPort')" @onBlur.native="onBlur('IpAndPort')"></Input>
        </div>
    </Page>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { PageOptions } from "@/components/Page.vue";
import MyPage from "@/common/MyPage";
import R from "@/common/R";

type Type = "IpAndPort" | null;

@Component
export default class HttpProxy extends MyPage {

    static REQUEST_CODE_SELECT_WIFI = 1;

    declare $refs: {
        IpAndPort: Vue;
        Items: Element;
    }

    @Prop({ default: "title" }) readonly title!: string;

    mPageOptions = this.createPageOptions();
    createPageOptions(): PageOptions {
        let context = this;
        return {
            statusBar: {
                padding: true,
            },
            toolBar: {
                show: true,
                title: context.$t("set-http-proxy") as string,
                padding: true,
            },
            navigationBar: {
                show: true,
                options: {
                    get left() {
                        return context.isVaild ? (context.mIpAndPort ? context.$t("set-proxy") : context.$t("clear-proxy")) : "";
                    },
                    get center() {
                        return context.mFocusedName == "IpAndPort" ? context.$t("additional-separator") : "";
                    },
                    right: context.$t("back"),
                    on: {
                        keyPress: {
                            softLeft: () => {
                                if (!context.isVaild) {
                                    return;
                                }
                                context.onClick_Set();
                            },
                            softRight: () => {
                                context.back();
                            },
                        }
                    }
                },
                padding: true,
            }
        }
    }

    mWifi: any = null;
    mIpAndPort = "";
    mFocusedName = "";

    get isVaild() {
        return this.mWifi;
    }

    mounted() {
        this.$tv.scrollEl = this.$refs.Items;
    }

    onClick_SelectWifi() {
        this.startPageForResult({
            name: "SelectWifi",
        }, HttpProxy.REQUEST_CODE_SELECT_WIFI)
    }

    onClick_IpAndPort() {
        if (!this.mIpAndPort) {
            return;
        }
        const reg1 = /(^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$)|(^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$)|(^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$)/;
        const reg2 = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
        if (reg1.test(this.mIpAndPort)) {
            this.mIpAndPort += ".";
        } else if (reg2.test(this.mIpAndPort)) {
            this.mIpAndPort += ":";
        } else {
            // this.$prompt.showToast("无需追加符号");
        }
    }

    onClick_Set() {
        let http: HttpProxyInfo = {
            httpProxyHost: null,
            httpProxyPort: null,
        };
        if (this.mIpAndPort) {
            const reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\:([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-5]{2}[0-3][0-5])$/;
            const b = reg.test(this.mIpAndPort);
            if (b) {
                let array = this.mIpAndPort.split(":");
                http = {
                    httpProxyHost: array[0],
                    httpProxyPort: Number.parseInt(array[1]),
                };
            } else {
                this.$prompt.showToast(this.$t("invalid-input-format"));
            }
        }
        let request = navigator.mozWifiManager.setHttpProxy(this.mWifi, http);
        request.onsuccess = (result) => {
            this.$prompt.showToast(this.$t("setup-successful"));
        };
        request.onerror = (error) => {
            this.$prompt.showToast(this.$t("setup-failed"));
        };
    }

    onFocus(type: Type) {
        if (type == "IpAndPort") {
            this.mFocusedName = "IpAndPort";
        }
    }

    onBlur(type: Type) {
        this.mFocusedName = "";
    }

    onPageResult(requestCode: number, resultCode: number, data: any) {
        this.$super.onPageResult(requestCode, resultCode, data);
        // console.log(requestCode, resultCode, data);
        if (resultCode != MyPage.RESULT_OK) {
            return;
        }
        if (requestCode == HttpProxy.REQUEST_CODE_SELECT_WIFI) {
            this.mWifi = data.wifi;
        }
    }
}
</script>

<style lang="scss" scoped>
.HttpProxy {
    .SelectWifi {
        padding: 10px 16px;
        &.focus {
            background: rgba($color: #000000, $alpha: 0.1);
        }
    }
}
</style>