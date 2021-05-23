<template>
    <Page class="Home" :options="mPageOptions">
        <div class="Items wh-100 scroll-y" ref="Items">
            <div class="Item" v-for="(item,index) in mItems" :key="index">{{item.text}}</div>
        </div>
    </Page>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Page, { PageOptions } from "@/components/Page.vue";
import { NavigationBarOptions } from "@/components/NavigationBar.vue";

@Component({
    components: {
        Page,
    },
})
export default class Home extends Vue {

    mPageOptions: PageOptions = {
        statusBar: {
            padding: false,
        },
        toolBar: {
            title: "Intent",
            padding: false,
        },
        navigationBar: {
            options: this.createNavigationBarOptions(),
            padding: false,
        }
    }

    mIndex = 0;

    mItems = [
        {
            text: "Toast",
            click: () => {
                this.$prompt.showToast(++this.mIndex);
            }
        },
        ...Array.from({ length: 10 }).map((o, i) => { return { text: "测试" + i } as any }),

        {
            text: "开发者选项",
            click: () => {
                if (window.MozActivity) {
                    var act = new MozActivity({
                        name: "configure",
                        data: {
                            target: "device",
                            section: "developer"
                        }
                    })
                } else {
                    window.alert('Please open the page from the device itself!')
                }
            }
        },
    ]

    createNavigationBarOptions(): NavigationBarOptions {
        let context = this;
        return {
            left: "左",
            center: "中",
            right: "右",
            on: {
                keyDown: {
                    softLeft: () => {
                        console.log("softLeft");

                    }
                }
            },
            hookItem: {
                items: () => {
                    return this.$refs.Items;
                },
                select: (index) => {
                    this.mItems[index].click?.();
                }
            }
        }
    }

    mounted() {
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
            &:focus {
                background: rgba($color: $colorPrimary, $alpha: 1);
                box-shadow: 0 2px 6px 0 rgba($color: $colorPrimary, $alpha: 0.5);
                color: white;
            }
            & + .Item {
                margin-top: 10px;
            }
        }
    }
    ::v-deep {
        .StatusBar {
            background-color: rgba($color: $colorPrimary, $alpha: 0.9);
        }
        .ToolBar {
            background-color: rgba($color: $colorPrimary, $alpha: 0.9);
        }
        .NavigationBar {
            background-color: rgba($color: #000000, $alpha: 0.5);
        }
    }
}
</style>
