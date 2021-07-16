<template>
    <div class="NavigationBar" @keydown="onKeyDown">
        <div class="Left button" @click="onClick_Left">{{left.text}}</div>
        <div class="Center button" @click="onClick_Center">{{center.text}}</div>
        <div class="Right button" @click="onClick_Right">{{right.text}}</div>
    </div>
</template>

<script lang="ts">
import MyComponent from "@/common/MyComponent";
import { Vue, Component, Prop } from "vue-property-decorator";

export type NavigationBarItem = string | {
    text?: string,
    color?: string,
}

type KeyValue = (e: KeyboardEvent) => void;

interface Keys {
    softLeft?: KeyValue,
    enter?: KeyValue,
    softRight?: KeyValue,
    arrowUp?: KeyValue,
    arrowDown?: KeyValue,
    arrowLeft?: KeyValue,
    arrowRight?: KeyValue,
    up?: KeyValue,
    down?: KeyValue,
    left?: KeyValue,
    right?: KeyValue,
    [key: string]: KeyValue | undefined,
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
export default class NavigationBar extends MyComponent {

    @Prop({ default: () => { return {} } }) readonly options!: NavigationBarOptions;

    mEventAdded = false;
    mKeyEvents: {
        key: string;
        timer: any;
        event: KeyboardEvent;
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
                let key = this.mKeyEvents.splice(this.mKeyEvents.findIndex(o => o.key == e.key), 1);
                if (key.length) {
                    this.on("keyLongPress", key[0].event);
                }
            }, 500);
            this.mKeyEvents.push({
                key: e.key,
                timer: t,
                event: e,
            })
        }
        this.on("keyDown", e);
    }

    onKeyUp(e: KeyboardEvent) {
        this.on("keyUp", e);
        let key = this.mKeyEvents.splice(this.mKeyEvents.findIndex(o => o.key == e.key), 1);
        if (key.length) {
            clearTimeout(key[0].timer);
            this.on("keyPress", key[0].event);
        }
    }

    on(eventType: EventType, e: KeyboardEvent) {
        let event = this.options.on?.[eventType];
        if (!event) {
            return;
        }
        switch (e.key) {
            case "SoftLeft":
            case "F1":
                event.softLeft?.(e);
                break;
            case "Enter":
                event.enter?.(e);
                break;
            case "SoftRight":
            case "F2":
                event.softRight?.(e);
                break;
            case "ArrowUp":
                event.arrowUp?.(e);
                break;
            case "ArrowDown":
                event.arrowDown?.(e);
                break;
            case "ArrowLeft":
                event.arrowLeft?.(e);
                break;
            case "ArrowRight":
                event.arrowRight?.(e);
                break;
            default:
                if (e.key in event) {
                    event[e.key]?.(e);
                }
                break
        }
    }

    onClick_Left() {
        this.options.on?.keyPress?.softLeft?.({} as KeyboardEvent);
    }

    onClick_Center() {
        this.options.on?.keyPress?.enter?.({} as KeyboardEvent);
    }

    onClick_Right() {
        this.options.on?.keyPress?.softRight?.({} as KeyboardEvent);
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