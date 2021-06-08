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
                title: "网络",
            },
            navigationBar: {
                show:true,
                options: {
                    right: "返回",
                    on: {
                        keyPress: {
                            softRight: () => {
                                this.back();
                            },
                        }
                    }
                },
            }
        }
    }

    mItems = [
        {
            text: "设置HTTP代理",
            click: () => {
                this.$pager.navigateTo("HttpProxy");
            }
        },
    ]

    mounted() {
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
