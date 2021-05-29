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

    declare const isDev: boolean
    declare const versionCode: string

    declare var MozActivity: any;

    
    interface String {
        replaceAll(s1: string, s2: string): string;
        format(...any): string;
    }

    interface Date {
        format(str: string): string;
    }

    interface AnyObject {
        [key: string]: any
    }
    
    interface LngLat {
        lng: number,
        lat: number,
    }


}
