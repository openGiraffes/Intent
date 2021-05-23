<template>
    <div class="Page flex-v wh-100">
        <div class="Content flex-h" :style="style_Content">
            <slot></slot>
        </div>
        <div class="StatusBar w-100" :style="style_StatusBar"></div>
        <ToolBar class="ToolBar w-100" v-show="mOptions.toolBar.show"
            :title="mOptions.toolBar.title" :style="style_ToolBar"></ToolBar>
        <NavigationBar class="NavigationBar w-100"
            :options="mOptions.navigationBar.options" :style="style_NavigationBar"></NavigationBar>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import NavigationBar, { NavigationBarOptions } from "@/components/NavigationBar.vue";
import ToolBar from "@/components/ToolBar.vue";
import R from "@/common/R";

export interface PageOptions {
    statusBar?: {
        padding?: boolean,
        backgroundColor?: string,
    },
    toolBar?: {
        show?: boolean,
        title?: string,
        padding?: boolean,
        backgroundColor?: string,
    },
    navigationBar?: {
        options?: NavigationBarOptions,
        padding?: boolean,
        backgroundColor?: string,
    }
}

/**
 * 如果target(也就是FirstOBJ[key])存在，
 * 且是对象的话再去调用deepObjectMerge，
 * 否则就是FirstOBJ[key]里面没这个对象，需要与SecondOBJ[key]合并
 */
const deepObjectMerge = <T>(FirstOBJ: T, SecondOBJ): T => { // 深度合并对象
    for (var key in SecondOBJ) {
        FirstOBJ[key] = FirstOBJ[key] && FirstOBJ[key].toString() === "[object Object]" ?
            deepObjectMerge(FirstOBJ[key], SecondOBJ[key]) : FirstOBJ[key] = SecondOBJ[key];
    }
    return FirstOBJ;
}

@Component({
    components: {
        ToolBar,
        NavigationBar,
    },
})
export default class Page extends Vue {
    @Prop() readonly options?: PageOptions;

    get mOptions() {
        return deepObjectMerge({
            statusBar: {
                padding: true,
            },
            toolBar: {
                show: true,
                title: "",
                padding: true,
            },
            navigationBar: {
                padding: true,
            }
        } as PageOptions, this.options);
    }

    get style_Content() {
        return {
            top: ((this.mOptions.statusBar!.padding ? R.dimen.statusBarHeight : 0)
                + (this.mOptions.toolBar!.padding ? R.dimen.toolBarHeight : 0)) + "px",
            bottom: (this.mOptions.navigationBar!.padding ? R.dimen.navigationBarHeight : 0) + "px",
        }
    }

    get style_StatusBar() {
        return {
            backgroundColor: this.mOptions.statusBar?.backgroundColor,
        }
    }

    get style_ToolBar() {
        return {
            backgroundColor: this.mOptions.toolBar?.backgroundColor,
        }
    }

    get style_NavigationBar() {
        return {
            backgroundColor: this.mOptions.navigationBar?.backgroundColor,
        }
    }

    mounted() {

    }

}
</script>

<style lang="scss" scoped>
.Page {
    position: relative;
    .StatusBar {
        position: absolute;
        left: 0;
        top: 0;
        height: $dimenStatusBarHeight;
        background: $colorPrimary;
    }
    .ToolBar {
        position: absolute;
        left: 0;
        top: $dimenStatusBarHeight;
    }
    .NavigationBar {
        position: absolute;
        left: 0;
        bottom: 0;
    }
    .Content {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        // margin-top: calc(#{$dimenStatusBarHeight} + #{$dimenToolBarHeight});
    }
}
</style>