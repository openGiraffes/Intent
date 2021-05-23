<template>
    <div class="NavigationBar">
        <div class="Left button" @click="onClick_Left">{{left.text}}</div>
        <div class="Center button" @click="onClick_Center">{{center.text}}</div>
        <div class="Right button" @click="onClick_Right">{{right.text}}</div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

export type NavigationBarItem = string | {
    text?: string,
}

export interface NavigationBarOptions {
    left?: NavigationBarItem,
    center?: NavigationBarItem,
    right?: NavigationBarItem,
    on?: {
        keyDown?: {
            softLeft?: () => void,
            enter?: () => void,
            softRight?: () => void,
            arrowUp?: () => void,
            arrowDown?: () => void,
            arrowLeft?: () => void,
            arrowRight?: () => void,
            up?: () => void,
            down?: () => void,
            left?: () => void,
            right?: () => void,
            [key: string]: any,
        }
    },
    [key: string]: any,
}

@Component
export default class NavigationBar extends Vue {

    @Prop({ default: () => { return {} } }) readonly options!: NavigationBarOptions;

    get left() {
        return this.item(this.options.left);
    }

    get center() {
        return this.item(this.options.center);
    }

    get right() {
        return this.item(this.options.right);
    }

    mounted() {
        document.addEventListener("keydown", this.onKeyDown);
        this.hookItems(0);
    }

    destroyed() {
        document.removeEventListener("keydown", this.onKeyDown);
    }

    hookItems(op: number) {
        if (!this.options.hookItem.items) {
            return;
        }
        let index = 0;
        let el = this.options.hookItem.items() as HTMLDivElement;
        if (!el) {
            return;
        }
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
                // child.blur();
                if (!child.hasAttribute("tabindex")) {
                    child.setAttribute("tabindex", i + "");
                }
                if (i === index) {
                    el.setAttribute("nav-index", index + "");
                    // child.scrollTo({top:1E10});
                    child.focus({ preventScroll: true });
                    el.scrollTo({
                        top: child.offsetTop - (el.clientHeight - child.clientHeight) / 2,
                        behavior: "smooth",
                    })
                    // if (child.offsetTop - el.scrollTop > (el.clientHeight - child.clientHeight) / 2) {
                    //     // el.scrollTop = child.offsetTop + el.clientHeight / 2;

                    //     console.log(child.offsetTop - el.scrollTop);

                    // } else if (condition) {

                    // }
                }
            }
        }
        return true;
    }

    hookItemSelect() {
        if (!this.options.hookItem.items) {
            return;
        }
        let el = this.options.hookItem.items() as HTMLDivElement;
        if (!el) {
            return;
        }
        let index = Number.parseInt(el.getAttribute("nav-index")!);
        this.options.hookItem.select(index);
    }

    item(key?: NavigationBarItem) {
        if (!key) {
            return {}
        }
        return typeof key === "string" ? { text: key, } : key
    }

    onKeyDown(e: KeyboardEvent) {
        let keyDown = this.options.on?.keyDown;
        if (!keyDown) {
            return;
        }
        switch (e.key) {
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
                if (this.hookItems(-1)) {
                    e.preventDefault();
                };
                break;
            case "ArrowDown":
                keyDown.arrowDown?.();
                if (this.hookItems(1)) {
                    e.preventDefault();
                };
                break;
            case "ArrowLeft":
                keyDown.arrowLeft?.();
                break;
            case "ArrowRight":
                keyDown.arrowRight?.();
                break;
            default:
                if (e.key in keyDown) {
                    keyDown[e.key]();
                }
                break
        }
    }

    onClick_Left() {
        this.onKeyDown(new KeyboardEvent("keydown", { key: "SoftLeft" }));
    }

    onClick_Center() {
        this.onKeyDown(new KeyboardEvent("keydown", { key: "Enter" }));
    }

    onClick_Right() {
        this.onKeyDown(new KeyboardEvent("keydown", { key: "SoftRight" }));
    }
}
</script>

<style lang="scss" scoped>
.NavigationBar {
    position: relative;
    background: rgba($color: #000000, $alpha: 1);
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
</style>