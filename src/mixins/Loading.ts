
import { Component, Vue,  } from "vue-property-decorator";

@Component
export default class Loading extends Vue{

    mLoading: boolean | number = 0;
    
    showLoading() {
        switch (typeof this.mLoading) {
            case "boolean":
                this.mLoading = true;
                break;
            case "number":
                this.mLoading++;
                break;
        }
    }

    closeLoading() {
        switch (typeof this.mLoading) {
            case "boolean":
                this.mLoading = false;
                break;
            case "number":
                this.mLoading--;
                if (this.mLoading < 0) {
                    this.mLoading = 0;
                }
                break;
        }
    }
    
}