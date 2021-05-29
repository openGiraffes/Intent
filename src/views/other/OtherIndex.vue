<template>
    <Page class="OtherIndex" :options="mPageOptions">
        <div class="Items wh-100 scroll-y" ref="Items">
            <div class="Item" v-focusable v-for="(item,index) in mItems" :key="index" @click="item.click">{{item.text}}</div>
        </div>
    </Page>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { PageOptions } from "@/components/Page.vue";
import MyPage from "@/common/MyPage";
import R from "@/common/R";

@Component
export default class OtherIndex extends MyPage {
    $refs!: {
        Items: Element;
    }


    mPageOptions = this.createPageOptions();
    createPageOptions(): PageOptions {
        let context = this;
        return {
            toolBar: {
                title: "其他",
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
            text: "开发者选项",
            click: () => {
                if (window.MozActivity) {
                    let result = new MozActivity({
                        name: "configure",
                        data: { target: "device", section: "developer111" }
                    })
                }
            }
        },
    ]

    mounted() {
        this.$tv.scrollEl = this.$refs.Items;
    }

}
</script>

<style lang="scss" scoped>
.OtherIndex {
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
