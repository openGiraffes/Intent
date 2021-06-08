
import { Component, Vue,  } from "vue-property-decorator";

@Component
export default class KeepScroll extends Vue{

    private mScrollableEls?: {
        x: { el: Element, value: number }[],
        y: { el: Element, value: number }[],
    } | null;
    
    saveScrollableEls() {
        let x = this.$el.getElementsByClassName("scroll-x");
        let xEls: { el: Element, value: number }[] = [];
        for (let i = 0; i < x.length; i++) {
            const element = x[i];
            xEls.push({ el: element, value: element.scrollLeft });
        }
        let y = this.$el.getElementsByClassName("scroll-y");
        let yEls: { el: Element, value: number }[] = [];
        for (let i = 0; i < y.length; i++) {
            const element = y[i];
            yEls.push({ el: element, value: element.scrollTop });
        }
        this.mScrollableEls = {
            x: xEls,
            y: yEls,
        }
    }

    loadScrollableEls() {
        if (!this.mScrollableEls) {
            return;
        }
        this.mScrollableEls.x.forEach(item => {
            item.el && (item.el.scrollLeft = item.value);
        });
        this.mScrollableEls.y.forEach(item => {
            item.el && (item.el.scrollTop = item.value);
        });
        this.mScrollableEls = null;
    }
}