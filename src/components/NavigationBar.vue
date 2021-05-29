<template>
    <div class="NavigationBar" @keydown="onKeyDown">
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

interface Keys {
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

type EventType = "keyDown" | "keyUp" | "keyPress" | "keyLongPress";

export interface NavigationBarOptions {
    left?: NavigationBarItem,
    center?: NavigationBarItem,
    right?: NavigationBarItem,
    on?: {
        [P in EventType]?: Keys;
    },
    [key: string]: any,
}

@Component
export default class NavigationBar extends Vue {

    @Prop({ default: () => { return {} } }) readonly options!: NavigationBarOptions;

    mEventAdded = false;
    mKeyEvents: {
        key: string,
        timer: any;
    }[] = [];

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
        this.addEventListener();
    }

    destroyed() {
        this.removeEventListener();
    }

    activated() {
        this.addEventListener();
    }

    deactivated() {
        this.removeEventListener();
    }

    addEventListener() {
        if (this.mEventAdded) {
            return;
        }
        document.addEventListener("keydown", this.onKeyDown);
        document.addEventListener("keyup", this.onKeyUp);
        this.mEventAdded = true;
    }

    removeEventListener() {
        if (!this.mEventAdded) {
            return;
        }
        this.mKeyEvents.forEach(o => {
            clearTimeout(o.timer);
        })
        this.mKeyEvents = [];
        document.removeEventListener("keydown", this.onKeyDown);
        document.removeEventListener("keyup", this.onKeyUp);
        this.mEventAdded = false;
    }


    item(key?: NavigationBarItem) {
        if (!key) {
            return {}
        }
        return typeof key === "string" ? { text: key, } : key
    }

    onKeyDown(e: KeyboardEvent) {
        if (!e.repeat) {
            let t = setTimeout(() => {
                clearTimeout(t);
                this.mKeyEvents.splice(this.mKeyEvents.findIndex(o => o.key == e.key), 1)
                this.on("keyLongPress", { key: e.key } as KeyboardEvent);
            }, 500);
            this.mKeyEvents.push({
                key: e.key,
                timer: t,
            })
        }
        this.on("keyDown", e);
    }

    onKeyUp(e: KeyboardEvent) {
        this.on("keyUp", e);
        let key = this.mKeyEvents.splice(this.mKeyEvents.findIndex(o => o.key == e.key), 1);
        if (key.length) {
            clearTimeout(key[0].timer);
            this.on("keyPress", { key: e.key } as KeyboardEvent);
        }
    }

    on(eventType: EventType, e: KeyboardEvent) {
        let event = this.options.on?.[eventType];
        if (!event) {
            return;
        }
        switch (e.key) {
            case "SoftLeft":
            case "Q":
                event.softLeft?.();
                break;
            case "Enter":
                event.enter?.();
                break;
            case "SoftRight":
            case "E":
                event.softRight?.();
                break;
            case "ArrowUp":
                event.arrowUp?.();
                break;
            case "ArrowDown":
                event.arrowDown?.();
                break;
            case "ArrowLeft":
                event.arrowLeft?.();
                break;
            case "ArrowRight":
                event.arrowRight?.();
                break;
            default:
                if (e.key in event) {
                    event[e.key]();
                }
                break
        }
    }

    onClick_Left() {
        this.options.on?.keyPress?.softLeft?.();
    }

    onClick_Center() {
        this.options.on?.keyPress?.enter?.();
    }

    onClick_Right() {
        this.options.on?.keyPress?.softRight?.();
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