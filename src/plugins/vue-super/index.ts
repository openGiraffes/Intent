/**
 * https://github.com/rpkilby/vue-super/blob/master/vue-super.js
 */
import Vue from "vue";

function vueName(type) {
    const name = type.sealedOptions
        ? type.sealedOptions.name
        : type.name;

    return name
        ? name[0].toUpperCase() + name.substr(1).toLowerCase()  // title case
        : 'Anonymous';
}


function $super(type, self) {
    if (!(self instanceof type))
        throw new TypeError(`<${vueName(self.constructor)}> not an instance of <${vueName(type)}>`);

    const unbound = type.super.options.methods || {};
    const bound = {};

    for (const key of Object.keys(unbound))
        bound[key] = unbound[key].bind(self);

    return bound;
}


function install(Vue) {
    Object.defineProperties(Vue.prototype, {
        $super: {
            get() {
                // This enables direct method access on $super. eg, this.$super.method();
                // Binding the function with an empty context prevents multiple vue
                // instances from operating on the same context.
                const local = $super.bind({});

                const methods = local(this.constructor, this);
                for (const key of Object.keys(methods))
                    local[key] = methods[key].bind(this);

                return local;
            },
        },
    });
}

Vue.use(install);