<template>
    <div class="Home flex-v wh-100">
        
        <NavigationBar :data="mKeys" :immersive="true"></NavigationBar>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Axios, { AxiosPromise, AxiosResponse, AxiosRequestConfig, AxiosError } from "axios";
import NavigationBar from "@/components/NavigationBar.vue";


@Component({
    components: {
        NavigationBar,
    },
})
export default class Home extends Vue {

    createKeys(): NavigationBarData {
        let context = this;
        return {
            on: {
                keyDown: {
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
    overflow: hidden;
}
</style>
