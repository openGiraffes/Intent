<template>
    <div class="Loading flex-v center middle">
        <div class="Message">{{msg}}</div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from "vue-property-decorator";

let indexZ = 1;

@Component
export default class Loading extends Vue {

    @Prop({default:"加载中",}) msg!: string;

    mounted() {
    }

    @Emit("close")
    onClose() { }
}
</script>

<style lang="scss" scoped>
.Loading {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    .Message {
        padding: 4px 12px;
        font-size: 14px;
        max-width: 80%;
        // min-width: 50px;
        margin-bottom: 50px;
        word-break: break-all;
        text-align: center;
        background: rgba($color: #000000, $alpha: 0.7);
        color: white;
        border-radius: 6px;
    }
}
</style>