<template>
    <Page class="HttpProxy" :options="mPageOptions">
        <div class="flex-v wh-100">
            <div class="SelectWifi " v-focusable @click="onClick_SelectWifi">选择Wifi:{{mWifi}}</div>
            <div ref="AA"></div>
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
                        return context.isVaild ? "设置" : "";
                    },
                    center: "",
                    right: "返回",
                    on: {
                        keyPress: {
                            softLeft: () => {
                                if (!this.isVaild) {
                                    return;
                                }

                            },
                            softRight: () => {
                                this.back();
                            },
                            "A": () => {
                                this.$tv.limitingEl = this.$refs.AA;
                            }
                        }
                    }
                },
                padding: true,
            }
        }
    }

    mWifi = "";

    get isVaild() {
        return !!this.mWifi;
    }

    mounted() {

    }

    onClick_SelectWifi() {
                                this.$tv.limitingEl = this.$refs.AA;
        this.startPageForResult({
            name: "SelectWifi",
        }, HttpProxy.REQUEST_CODE_SELECT_WIFI)
    }

    onPageResult(requestCode: number, resultCode: number, data: any) {
        this.$super.onPageResult(requestCode, resultCode, data);
        console.log(requestCode, resultCode, data);
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