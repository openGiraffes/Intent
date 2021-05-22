<template>
    <div class="Home flex-v wh-100">
        <ToolBar title="Intent"></ToolBar>
        <div class="Content flex-1">
            <div class="Items" ref="Items">
                <div class="Item" v-for="(item,index) in mItems" :key="index">{{item.text}}</div>
            </div>
        </div>
        <NavigationBar :data="mKeys" :immersive="true"></NavigationBar>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Axios, { AxiosPromise, AxiosResponse, AxiosRequestConfig, AxiosError } from "axios";
import NavigationBar from "@/components/NavigationBar.vue";
import ToolBar from "@/components/ToolBar.vue";


@Component({
    components: {
        ToolBar,
        NavigationBar,
    },
})
export default class Home extends Vue {

    mKeys = this.createKeys();

    mItems = [
        {
            text: "第一项测试",
        },
        {
            text: "第二项测试",
        },
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

    createKeys(): NavigationBarData {
        let context = this;
        return {
            left: "左",
            center: "中",
            right: "右",
            on: {
                keyDown: {
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
    .Content {
        .Items {
            padding: 10px 16px;
            .Item {
                background: white;
                font-size: 16px;
                padding: 10px 16px;
                box-shadow: 0 0 5px rgba($color: #000000, $alpha: 0.1);
                border-radius: 5px;
                &:focus {
                    background: rgba($color: #d6d6d6, $alpha: 1);
                }
                & + .Item {
                    margin-top: 10px;
                }
            }
        }
    }
}
</style>
