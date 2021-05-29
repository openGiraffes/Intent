<template>
    <div class="ImageButton">
         <!-- :class="[(h==''||h)&&'H',(w==''||w)&&'W']" -->
        <img class="Normal" :src="normal">
        <img class="Focus" :src="focus">
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
@Component
export default class ImageButton extends Vue {

    @Prop() readonly normal?: string;
    @Prop() readonly focus?: string;
    @Prop() readonly h?: string | boolean;
    @Prop() readonly w?: string | boolean;

    mounted() {
    }
}
</script>

<style lang="scss" scoped>
.ImageButton {
    .Normal,
    .Focus {
        // width: auto;
        // height: 100%;
        max-width: 100%;
        max-height: 100%;
    }
    .Normal {
        display: inline-block;
    }
    .Focus {
        display: none;
    }
    // &.H {
    //     .Normal,
    //     .Focus {
    //         width: auto;
    //         height: 100%;
    //     }
    // }
    // &.W {
    //     .Normal,
    //     .Focus {
    //         width: 100%;
    //         height: auto;
    //     }
    // }
    &.focus {
        .Normal {
            display: none;
        }
        .Focus {
            display: inline-block;
        }
    }
}
</style>