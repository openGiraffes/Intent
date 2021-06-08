import _Vue from "vue";

const keep = (el: HTMLElement) => {
    let scroll = el.getAttribute("data-vue-keep-scroll")?.split("-");
    if (scroll) {
        el.scrollLeft = Number.parseInt(scroll[0]);
        el.scrollTop = Number.parseInt(scroll[1]);
    }
}

export default (Vue: typeof _Vue) => {
    return Vue.directive('keep-scroll', {
        bind: (el, binding, vnode, oldVnode) => {
            el.addEventListener('scroll', (event) => {
                (<HTMLDivElement>event.target).setAttribute(
                    "data-vue-keep-scroll",
                    (<HTMLDivElement>event.target).scrollLeft + "-" + (<HTMLDivElement>event.target).scrollTop
                );
            });
            vnode.context?.$on("hook:activated", () => {
                keep(el);
            })
        },
    });
};