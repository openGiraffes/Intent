<template>
    <div class="Toast flex-v center bottom">
        <transition name="bounce">
            <div v-if="mShow" class="Message">{{msg}}</div>
        </transition>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from "vue-property-decorator";

let indexZ = 1;

@Component
export default class Toast extends Vue {

    @Prop() msg?: string;

    mShow = false;

    mounted() {
        this.mShow = true;
        setTimeout(() => {
            this.mShow = false;
            setTimeout(() => {
                this.onClose();
            }, 500);
        }, 2000);
    }

    @Emit("close")
    onClose() { }
}
</script>

<style lang="scss" scoped>
.bounce-enter-active {
    animation: bounce-in 0.5s;
}
.bounce-leave-active {
    animation: bounce-out 0.5s reverse;
}
@keyframes bounce-in {
    0% {
        opacity: 0;
        transform: translateY(20px);
    }
    50% {
        opacity: 1;
        transform: translateY(-5px);
    }
    100% {
        opacity: 1;
        transform: translateY(0px);
    }
}
@keyframes bounce-out {
    0% {
        opacity: 0;
        transform: translateY(20px);
    }
    100% {
        opacity: 1;
        transform: translateY(0px);
    }
}
.Toast {
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
        color:white;
        border-radius: 6px;
    }
}
</style>