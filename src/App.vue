<template>
    <div id="app">
        <keep-alive v-if="$pager.KeepAlive">
            <!-- <router-view :key="mPage.id" ref="RouterView" /> -->
            <router-view ref="RouterView" />
        </keep-alive>
        <router-view v-else ref="RouterView" />
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";

@Component
export default class App extends Vue {
    declare $refs: {
        RouterView: any;
    }

    mVersionCode = versionCode;


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
        this.$tv.resetScrollEl();
        this.$tv.resetFindFocusType(); //this.$tv.findFocusType  = 1;
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
