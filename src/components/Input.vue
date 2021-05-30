<template>
    <div class="Input flex-v" :input="!!value" @onFocus="onFocus" @onBlur="onBlur">
        <input v-model="mValue" type="text" :placeholder="placeholder" ref="Input" />
        <div class="Label">{{label}}</div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, PropSync, Model, Watch } from "vue-property-decorator";
@Component
export default class Input extends Vue {
    $refs!: {
        Input: HTMLInputElement;
    }

    @Model("modelchange", { type: String }) readonly value!: string

    @Prop() readonly disabled?: string | boolean;

    @Prop() readonly label?: string;

    @Prop() readonly placeholder?: string;

    mValue = this.value;

    get isDisabled() {
        return this.disabled == "" || this.disabled == true;
    }

    @Watch("mValue")
    onChange_Value(value: string) {
        this.$emit("modelchange", value);
    }

    @Watch("value")
    onChange_Model(value: string) {
        this.mValue = value;
    }

    mounted() {

    }

    onFocus() {
        if (this.isDisabled) {
            return;
        }
        this.$refs.Input.focus();
    }

    onBlur() {
        if (this.isDisabled) {
            return;
        }
        this.$refs.Input.blur();
    }
}
</script>

<style lang="scss" scoped>
.Input {
    margin: 10px 10px;
    position: relative;
    padding-top: 12px;
    & > input {
        padding: 3px;
        border: none;
        border-bottom: 2px solid rgba($color: #000000, $alpha: 0.2);
        font-size: 14px;
        color: rgba($color: #000000, $alpha: 1);
        &::placeholder {
            color: transparent;
        }
    }
    & > .Label {
        position: absolute;
        font-size: 14px;
        top: 14px;
        left: 2px;
        transition: top 0.2s, font-size 0.2s;
        color: rgba($color: #000000, $alpha: 0.5);
    }
    &[input] {
        & > .Label {
            font-size: 10px;
            top: 0px;
        }
    }
    &.focus {
        & > input {
            border-bottom: 2px solid rgba($color: $colorPrimary, $alpha: 1);
            &::placeholder {
                color: rgba($color: #000000, $alpha: 0.2);
            }
        }
        & > .Label {
            font-size: 10px;
            top: 0px;
            color: rgba($color: $colorPrimary, $alpha: 1);
        }
    }
}
</style>