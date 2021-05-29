<template>
    <Page class="Home" :options="mPageOptions">
        <div class="Items wh-100 top scroll-y" ref="Items">
            <div class="cell Item flex-v bottom" v-focusable v-for="(item,index) in mItems" :key="index" @click="item.click">
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
    $refs!: {
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
            text: "网络",
            click: () => {
                this.$pager.navigateTo("Network");
            }
        },
        {
            text: "其他",
            click: () => {
                this.$pager.navigateTo("Other");
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
            background: white;
            font-size: 14px;
            padding: 10px 16px;
            box-shadow: 0 2px 6px 0 rgba($color: $colorPrimary, $alpha: 0.1);
            border-radius: 6px;
            height: 60px;
            overflow: hidden;
            position: relative;
            .Big {
                color: rgba($color: $colorPrimary, $alpha: 0.05);
                font-size: 70px;
                position: absolute;
                top: -10px;
                left: 50%;
            }
            &.focus {
                background: rgba($color: $colorPrimary, $alpha: 1);
                box-shadow: 0 2px 6px 0 rgba($color: $colorPrimary, $alpha: 0.5);
                color: white;
            }
        }
    }
}
</style>
