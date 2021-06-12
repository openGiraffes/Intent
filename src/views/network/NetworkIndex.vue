<template>
    <Page class="NetworkIndex" :options="mPageOptions">
        <div class="Items wh-100 scroll-y" ref="Items" v-keep-scroll>
            <div class="Item card" v-focusable v-for="(item,index) in mItems" :key="index" @click="item.click">{{item.text}}</div>
        </div>
    </Page>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { PageOptions } from "@/components/Page.vue";
import MyPage from "@/common/MyPage";
import R from "@/common/R";

@Component
export default class NetworkIndex extends MyPage {
    declare $refs: {
        Items: Element;
    }


    mPageOptions = this.createPageOptions();
    createPageOptions(): PageOptions {
        let context = this;
        return {
            toolBar: {
                title: context.$t("network") as string,
            },
            navigationBar: {
                show:true,
                options: {
                    right: context.$t("back"),
                    on: {
                        keyPress: {
                            softRight: () => {
                                context.back();
                            },
                        }
                    }
                },
            }
        }
    }

    mItems = [
        {
            text: this.$t("set-http-proxy"),
            click: () => {
                this.startPage("HttpProxy");
            }
        },
    ]

    onStart() {
        this.$super.onStart();
        this.$tv.scrollEl = this.$refs.Items;
    }

}
</script>

<style lang="scss" scoped>
.NetworkIndex {
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
