<template>
    <Page class="SelectWifi" :options="mPageOptions">
        <div class="Items wh-100 scroll-y" ref="Items">
            <div class="Item" v-focusable v-for="(item,index) in mItems" :key="index" @onFocus="onFocus(index)">{{item.ssid}}</div>
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
                title: "选择WIFI",
                padding: true,
            },
            navigationBar: {
                show: true,
                options: {
                    left: "",
                    get center() {
                        return context.mCurrent ? "选择" : "";
                    },
                    right: "返回",
                    on: {
                        keyPress: {
                            softLeft: () => {
                            },
                            softRight: () => {
                                // this.setResult(MyPage.RESULT_OK, { wifi: "aaaaa" });
                                this.back();
                            },
                            enter: () => {
                                if (!this.mCurrent) {
                                    return;
                                }
                                this.setResult(MyPage.RESULT_OK, { wifi: this.mCurrent });
                                this.back();
                            }
                        }
                    }
                },
                padding: true,
            }
        }
    }

    mItems: any[] = [{
        ssid: "LC",
    }, ...Array.from({ length: 20 }).map((o, index) => { return { ssid: "ssid" + index } })];

    mCurrent: string | null = null;

    mounted() {
        this.$tv.scrollEl = this.$refs.Items;
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
            background: white;
            font-size: 14px;
            padding: 10px 16px;
            box-shadow: 0 2px 6px 0 rgba($color: $colorPrimary, $alpha: 0.1);
            border-radius: 6px;
            &.focus {
                background: rgba($color: $colorPrimary, $alpha: 1);
                box-shadow: 0 2px 6px 0 rgba($color: $colorPrimary, $alpha: 0.5);
                color: white;
            }
            & + .Item {
                margin-top: 10px;
            }
        }
    }
}
</style>