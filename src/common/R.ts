import variables from "@/assets/css/variables.scss";

const rgba_hex = (color: string, alpha: number = 1) => {
    let a = Math.floor(alpha * 255).toString(16);
    a.length == 1 && (a = "0" + a);
    return color + a;
}

export default {
    dimen: {
        navigationBarHeight: 18,
        statusBarHeight: 26,
        toolBarHeight: 36,
    },
    color: {
        transparent: "transparent",
        primary: variables["color-primary"],
        primaryAlpha: function (alpha: number = 1) {
            return rgba_hex(this.primary, alpha);
        }
    }
}