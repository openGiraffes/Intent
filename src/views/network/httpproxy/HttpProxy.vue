<template>
    <Page class="HttpProxy" :options="mPageOptions">
        <div class="flex-v wh-100 scroll-y" ref="Items">
            <Input v-focusable :value="mWifi && mWifi.ssid"
                label="WIFI" placeholder="请选择" disabled
                @click.native="onClick_SelectWifi"></Input>
            <!-- <div class="SelectWifi " v-focusable @click="onClick_SelectWifi">选择Wifi:{{mWifi}}</div> -->
            <Input v-focusable v-model="mIpAndPort"
                label="代理地址" placeholder="示例：127.0.0.1:8080"></Input>
        </div>
    </Page>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { PageOptions } from "@/components/Page.vue";
import MyPage from "@/common/MyPage";
import R from "@/common/R";

@Component
export default class HttpProxy extends MyPage {

    static REQUEST_CODE_SELECT_WIFI = 1;

    @Prop({ default: "标题" }) readonly title!: string;

    mPageOptions = this.createPageOptions();
    createPageOptions(): PageOptions {
        let context = this;
        return {
            statusBar: {
                padding: true,
            },
            toolBar: {
                show: true,
                title: "设置HTTP代理",
                padding: true,
            },
            navigationBar: {
                show: true,
                options: {
                    get left() {
                        return context.isVaild ? (context.mIpAndPort ? "设置代理" : "清空代理") : "";
                    },
                    center: "",
                    right: "返回",
                    on: {
                        keyPress: {
                            softLeft: () => {
                                if (!this.isVaild) {
                                    return;
                                }
                                this.onClick_Set();
                            },
                            softRight: () => {
                                this.back();
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

    onClick_Set() {
        let http: any = null;
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
                this.$prompt.showToast("输入格式有误");
            }
        }
        let request = navigator.mozWifiManager.setHttpProxy(this.mWifi, http);
        request.onsuccess = (result) => {
            this.$prompt.showToast("设置成功");
        };
        request.onerror = (error) => {
            this.$prompt.showToast("设置失败");
        };
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