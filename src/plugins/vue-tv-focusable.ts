import Vue from "vue";

import focusable from 'vue-tv-focusable';
Vue.use(focusable);

interface InitOptions {
    /**
     * 指定焦点元素类名。默认为“焦点” “focus”
     * 默认值 focus
     */
    focusClassName?: string;
    /**
     * 移动类型，1：就近查找 0：直线 查找
     * 默认值 1
     */
    findFocusType?: number;
    /**
     * 差值
     * 默认值 20
     */
    initDis?: number;
    /**
     * 上下左右的键值
     * 默认值 { KEY_LEFT: [37, 21], KEY_UP: [38, 19], KEY_RIGHT: [39, 22], KEY_DOWN: [40, 20], KEY_ENTER:[13, 23] }
     */
    KEYS?: object;
    /**
     * 边缘距离
     * 默认值 50
     */
    offsetDistance?: number;
    /**
     * 长按响应时间
     * 默认值 500
     */
    longPressTime?: number;
    /**
     * 焦点是否在滚动区域保持剧中显示
     * 默认值 false
     */
    distanceToCenter?: boolean;
}

declare interface VueTVFocusable extends InitOptions {
    /**
     * 设置可以滚动的el
     */
    scrollEl?: Element;

    /**
     * 整个界面，只有limitingEl内的焦点可以聚焦
     */
    limitingEl?: Element;

    init(options: InitOptions): void;

    /**
     * 设置滚动的el
     */
    setScrollEl(el: Element): void;

    /**
     * 重置成浏览器滚动
     */
    resetScrollEl(): void;

    /**
     * 重置 focusClassName
     */
    resetFocusClassName(): void;

    /**
     * 重置 initDis
     */
    resetInitDis(): void;

    /**
     * 重置 findFocusType
     */
    resetFindFocusType(): void;

    /**
     * 重置 KEYS
     */
    resetKEYS(): void;

    /**
     * 重置 scrollEl
     */
    resetScrollEl(): void;

    /**
     * 重置 limitingEl
     */
    resetLimitingEl(): void;

    /**
     * 重置 所有
     */
    reset(): void;

    /**
     * 直接调指定的el
     * @param el        跳转的el
     * @param animation 是否启用动画
     */
    requestFocus(el: Element, animation?: boolean): void;

    /**
     * 使用xPath获取el
     * @param xPath 
     */
    getElementByPath(xPath:string): Element;

}

declare module "vue/types/vue" {
    interface Vue {
        $tv: VueTVFocusable;
    }
}
