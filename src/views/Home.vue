<template>
    <Page class="Home" :options="mPageOptions">
        <div class="Items wh-100 top scroll-y" ref="Items">
            <div class="cell Item card flex-v bottom" v-focusable v-keep-scroll
                v-for="(item,index) in mItems" :key="index" @click="item.click">
                <div class="Big">{{item.text}}</div>
                <div>{{item.text}}</div>
            </div>
        </div>
    </Page>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { PageOptions } from "@/components/Page.vue";
import MyPage from "@/common/MyPage";
import R from "@/common/R";

@Component
export default class Home extends MyPage {
    declare $refs: {
        Items: Element;
    }


    mPageOptions = this.createPageOptions();
    createPageOptions(): PageOptions {
        let context = this;
        return {
            statusBar: {
                padding: false,
                // backgroundColor: R.color.transparent,
                backgroundColor: R.color.primaryAlpha(0.95),
            },
            toolBar: {
                show: true,
                title: "Intent",
                padding: false,
                backgroundColor: R.color.primaryAlpha(0.95),
            },
            navigationBar: {
                show: false,
            }
        }
    }

    mItems = [
        {
            text: this.$t("display"),
            click: () => {
                this.startPage("Display");
            }
        },
        {
            text: this.$t("network"),
            click: () => {
                this.startPage("Network");
            }
        },
        {
            text: this.$t("other"),
            click: () => {
                this.startPage("Other");
            }
        },
    ]

    mounted() {
        this.$tv.scrollEl = this.$refs.Items;
    }

}
</script>

<style lang="scss" scoped>
.Home {
    position: relative;
    background: rgba($color: #eeeeee, $alpha: 1);
    .Items {
        padding: calc(10px + #{$dimenStatusBarHeight} + #{$dimenToolBarHeight}) 16px 0 16px;
        // padding: 10px 16px;
        position: relative;
        @include columnsFlex(2, 7px, 7px);
        &::after {
            content: "";
            height: calc(10px + #{$dimenNavigationBarHeight});
            display: block;
        }
        .Item {
            overflow: hidden;
            position: relative;
            height: 60px;
            .Big {
                color: rgba($color: $colorPrimary, $alpha: 0.05);
                font-size: 70px;
                position: absolute;
                top: -10px;
                left: 50%;
            }
            &.focus {
                .Big {
                    color: rgba($color: white, $alpha: 0.05);
                }
            }
        }
    }
}
</style>
