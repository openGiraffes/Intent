import Vue, { VNode } from 'vue'

declare global {
    namespace JSX {
        // tslint:disable no-empty-interface
        interface Element extends VNode { }
        // tslint:disable no-empty-interface
        interface ElementClass extends Vue { }
        interface IntrinsicElements {
            [elem: string]: any
        }
    }


    type NavigationBarItem = string | {
        text?: string,
    }

    interface NavigationBarData {
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
            }
        }
    }

}
