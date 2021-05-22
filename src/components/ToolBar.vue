<template>
    <div class="ToolBar flex-h middle">
        <div class="Title">{{title}}</div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class ToolBar extends Vue {
    @Prop() readonly title?: string;
}
</script>

<style lang="scss" scoped>
.ToolBar {
    height: $dimenToolBarHeight;
    background: rgba($color: $colorPrimary, $alpha: 1);
    .Title {
        color: white;
        font-size: 16px;
        font-weight: bold;
        padding: 0 16px;
    }
}
</style>