import variables from "@/assets/css/variables.scss";

const rgba_hex = (color: string, alpha: number = 1) => {
    let a = Math.floor(alpha * 255).toString(16);
    a.length == 1 && (a = "0" + a);
    return color + a;
}

const dimen = (key: string) => {
    return Number.parseFloat(variables[`dimen-${key}`].replace("px", ""));
}

export default {
    dimen: {
        statusBarHeight: dimen("statusBarHeight"),
        toolBarHeight: dimen("toolBarHeight"),
        navigationBarHeight: dimen("navigationBarHeight"),
    },
    color: {
        transparent: "transparent",
        primary: variables["color-primary"],
        primaryAlpha: function (alpha: number = 1) {
            return rgba_hex(this.primary, alpha);
        }
    }
}