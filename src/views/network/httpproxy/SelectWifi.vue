<template>
    <Page class="SelectWifi" :options="mPageOptions">
        <div class="Items wh-100 scroll-y" ref="Items" v-keep-scroll>
            <div class="Item card" v-focusable v-for="(item,index) in mItems" :key="index" @onFocus="onFocus(index)">{{item.ssid}}</div>
        </div>
    </Page>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { PageOptions } from "@/components/Page.vue";
import MyPage from "@/common/MyPage";
import R from "@/common/R";
@Component
export default class SelectWifi extends MyPage {

    mPageOptions = this.createPageOptions();
    createPageOptions(): PageOptions {
        let context = this;
        return {
            statusBar: {
                padding: true,
            },
            toolBar: {
                show: true,
                title: context.$t("select-known-wifi") as string,
                padding: true,
            },
            navigationBar: {
                show: true,
                options: {
                    left: "",
                    get center() {
                        return context.mCurrent ? context.$t("select") : "";
                    },
                    right: context.$t("back"),
                    on: {
                        keyPress: {
                            softLeft: () => {
                            },
                            softRight: () => {
                                // this.setResult(MyPage.RESULT_OK, { wifi: "aaaaa" });
                                context.back();
                            },
                            enter: () => {
                                if (!context.mCurrent) {
                                    return;
                                }
                                context.setResult(MyPage.RESULT_OK, { wifi: context.mCurrent });
                                context.back();
                            }
                        }
                    }
                },
                padding: true,
            }
        }
    }

    mItems: { ssid: string }[] = [];

    mCurrent: any | null = null;

    mounted() {
        this.loadData();
    }

    onStart() {
        this.$super.onStart();
        this.$tv.scrollEl = this.$refs.Items;
    }

    loadData() {
        let request = navigator.mozWifiManager.getKnownNetworks();
        request.onsuccess = (result) => {
            this.mItems = result.target.result;//.find((o) => o.ssid == "LC");
        };
        request.onerror = (error) => {
            this.$prompt.showToast(this.$t("get-failed"));
        };
    }

    onFocus(index: number) {
        this.mCurrent = this.mItems[index];
    }
}
</script>

<style lang="scss" scoped>
.SelectWifi {
    position: relative;
    background: rgba($color: #eeeeee, $alpha: 1);
    .Items {
        padding: 10px 16px 0 16px;
        // padding: 10px 16px;
        position: relative;
        &::after {
            content: "";
            height: 10px;
            display: block;
        }
        .Item {
            & + .Item {
                margin-top: 10px;
            }
        }
    }
}
</style>