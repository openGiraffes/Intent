<template>
    <div id="app" v-if="$pager.KeepAlive ? mPage : true">
        <keep-alive v-if="$pager.KeepAlive">
            <router-view :key="mPage.id" ref="RouterView" />
        </keep-alive>
        <router-view v-else ref="RouterView" />
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { VNode } from 'vue';
import MyPage from "@/common/MyPage";

interface PageConfig {
    id: string;
    name: string;
}

@Component
export default class App extends Vue {
    $refs!: {
        RouterView: any;
    }

    mVersionCode = versionCode;

    mPageFlag = 0;
    mPages: PageConfig[] = [];
    mPage: PageConfig | null = null;

    @Watch("$route.name")
    private __onChange_Route_Name(value: string | null) {
        if (!value) {
            return;
        }
        let findIndex = this.mPages.findIndex(o => o.name === value);
        if (findIndex !== -1) {
            let page = this.mPages[findIndex];
            let pageInstance = this.getPage(page.id);
            pageInstance.onStart(true);
            this.mPage = page;
            return;
        }

        if (this.$refs.RouterView && this.mPages.length) {
            this.currentPage().onStop();
        }

        let pageId = this.$route.query.pageId;
        if (!pageId) {
            pageId = this.createPageId() + "";
            this.$route.query.pageId = pageId;
        }
        this.mPage = {
            name: value,
            id: pageId as string,
        };
        this.mPages.push(this.mPage);
    }

    createPageId() {
        this.mPageFlag += 10000;
        return this.mPageFlag;
    }

    created() {
        this.$tv.distanceToCenter = true;
        this.$tv.findFocusType = 0;
        // this.$tv.offsetDistance = 50;
        this.$tv.initDis = 0;
        // this.$tv.requestFocus(this.$refs.Item[0]);
    }

    mounted() {
        this.$pager.App = this;
    }

    destroyed() {
        this.$pager.App = null;
    }

    destroyPage(id: string) {
        if (!this.$pager.KeepAlive) {
            return;
        }
        let cache: { [key: string]: VNode } = this.$refs.RouterView.$options.parent.cache;
        let keys: string[] = this.$refs.RouterView.$options.parent.keys;
        keys.splice(keys.indexOf(id), 1);
        let vue = cache[id].componentInstance;
        vue && vue.$destroy();
        delete cache[id];
        this.mPages.splice(this.mPages.findIndex(o => o.id === id), 1);
    }

    private getPage(id: string) {
        let cache: { [key: string]: VNode } = this.$refs.RouterView.$options.parent.cache;
        let vue = cache[id].componentInstance as MyPage;
        return vue;
    }

    currentPage() {
        return this.getPage(this.mPages[this.mPages.length - 1].id);
    }
}
</script>

<style lang="scss">
#app {
    //   font-family: Avenir, Helvetica, Arial, sans-serif;
    //   -webkit-font-smoothing: antialiased;
    //   -moz-osx-font-smoothing: grayscale;
    //   text-align: center;
    //   color: #2c3e50;
    width: 100vw;
    height: 100vh;
    position: relative;
    overflow: hidden;
}

@media screen and (min-width: 300px) {
    #app {
        width: 240px;
        height: 320px;
    }
}

body {
    padding: 0px;
    margin: 0px;
    background: rgba($color: white, $alpha: 1);
    // background: rgba($color: rgb(0, 162, 255), $alpha: 1.0);
}
</style>
