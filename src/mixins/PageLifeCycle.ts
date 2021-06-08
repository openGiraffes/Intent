
import { Component, Vue,  } from "vue-property-decorator";

@Component
export default class PageLifeCycle extends Vue{

    isActivated = false;

    mounted() {
        this.isActivated = true;
    }

    activated() {
        // console.log("activated", this.$vnode.tag);
        this._onStart(!this.isActivated);
        this.onResume();
        if (this.isActivated) {
            return;
        }
        this.isActivated = true;
    }

    deactivated() {
        // console.log("deactivated", this.$vnode.tag);
        this.isActivated = false;
        this.onPause();
        this._onStop();
    }

    protected _onStart(restart = false) {
        
    }

    protected _onStop() {

    }
    
    onStart() {
    }

    onResume() {
    }

    onPause() {
    }

    onStop() {
    }
    
}