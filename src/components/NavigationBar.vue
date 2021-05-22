<template>
    <div class="NavigationBar" :class="[immersive&&'Immersive']">
        <div class="Keys flex-h">
            <div class="Left button" @click="onClick_Left">{{left.text}}</div>
            <div class="Center button" @click="onClick_Center">{{center.text}}</div>
            <div class="Right button" @click="onClick_Right">{{right.text}}</div>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";


@Component
export default class NavigationBar extends Vue {

    @Prop({ default: () => { return {} } }) readonly data!: NavigationBarData;
    @Prop() readonly immersive?: boolean;

    get left() {
        return this.item(this.data.left);
    }

    get center() {
        return this.item(this.data.center);
    }

    get right() {
        return this.item(this.data.right);
    }

    mounted() {
        document.addEventListener("keydown", this.onKeyDown);
        this.hookItems(0);
    }

    destroyed() {
        document.removeEventListener("keydown", this.onKeyDown);
    }

    hookItems(op: number) {
        if (!this.data.hookItem.items) {
            return;
        }
        let index = 0;
        let el = this.data.hookItem.items() as HTMLDivElement;
        if (el.hasAttribute("nav-index")) {
            index = Number.parseInt(el.getAttribute("nav-index")!);
        }
        let children = el.children;
        if (children.length) {
            if (index + op < 0) {
                index = children.length - 1;
            } else if (index + op >= children.length) {
                index = 0;
            } else {
                index += op;
            }
            for (let i = 0; i < children.length; i++) {
                const child = children[i] as HTMLElement;
                if (!child.hasAttribute("tabindex")) {
                    child.setAttribute("tabindex", i + "");
                }
                if (i === index) {
                    child.focus();
                    el.setAttribute("nav-index", index + "");
                }
            }
        }
    }

    hookItemSelect(){
        if (!this.data.hookItem.items) {
            return;
        }
        let el = this.data.hookItem.items() as HTMLDivElement;
        let index = Number.parseInt(el.getAttribute("nav-index")!);
        this.data.hookItem.select(index);
    }

    item(key?: NavigationBarItem) {
        if (!key) {
            return {}
        }
        return typeof key === "string" ? { text: key, } : key
    }

    onKeyDown({ key }) {
        let keyDown = this.data.on?.keyDown;
        if (!keyDown) {
            return;
        }
        switch (key) {
            case "SoftLeft":
                keyDown.softLeft?.();
                break;
            case "Enter":
                keyDown.enter?.();
                this.hookItemSelect();
                break;
            case "SoftRight":
                keyDown.softRight?.();
                break;
            case "ArrowUp":
                keyDown.arrowUp?.();
                this.hookItems(-1);
                break;
            case "ArrowDown":
                keyDown.arrowDown?.();
                this.hookItems(1);
                break;
            case "ArrowLeft":
                keyDown.arrowLeft?.();
                break;
            case "ArrowRight":
                keyDown.arrowRight?.();
                break;
        }
    }

    onClick_Left() {
        this.onKeyDown({ key: "SoftLeft" });
    }

    onClick_Center() {
        this.onKeyDown({ key: "Enter" });
    }

    onClick_Right() {
        this.onKeyDown({ key: "SoftRight" });
    }
}
</script>

<style lang="scss" scoped>
.NavigationBar {
    background: #000000;
    position: relative;
    .Keys {
        background: rgba($color: #000000, $alpha: 0.5);
        height: $dimenNavigationBarHeight;
        font-size: 12px;
        color: white;
        position: relative;
        .Left,
        .Center,
        .Right {
            position: absolute;
        }
        .Left {
            left: 10px;
            top: 50%;
            transform: translateY(-50%);
        }
        .Right {
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
        }
        .Center {
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
        }
    }
    &.Immersive {
        .Keys {
            position: absolute;
            width: 100%;
            bottom: 0;
            left: 0;
        }
    }
}
</style>