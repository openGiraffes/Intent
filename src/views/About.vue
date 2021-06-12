<template>
    <Page class="About" :options="mPageOptions">
        <div class="flex-v scroll-y" ref="ContentLayout">
            <div class="VersionLayout flex-v center" v-focusable>
                <img class="Icon" src="icons/icon128x128.png">
                <div class="Tag"><span>{{$t("version-name")}}</span><span>{{mVersion}}</span></div>
                <div class="Tag"><span>{{$t("build-time")}}</span><span>{{mVersionCode}}</span></div>
            </div>
            <div class="Quote">{{$t("quote")}}</div>
            <div class="QuoteTag w-100 flex-v" v-focusable>
                <div class="flex-h">
                    <span class="flex-1">{{$t("developer-options")}}</span>
                    <span>@LiarOnce</span>
                </div>
                <span>https://github.com/LiarOnce/kaios-w2d</span>
            </div>
        </div>
    </Page>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import MyPage from "@/common/MyPage";
import { PageOptions } from "@/components/Page.vue";
import packageInfo from "@/../package.json";
@Component
export default class About extends MyPage {

    @Prop({ default: "标题" }) readonly title!: string;

    mPageOptions = this.createPageOptions();
    createPageOptions(): PageOptions {
        let context = this;
        return {
            toolBar: {
                title: context.$t("about") as string,
            },
            navigationBar: {
                show: true,
                options: {
                    right: context.$t("back"),
                    on: {
                        keyPress: {
                            softRight: () => {
                                context.back();
                            },
                        }
                    }
                },
            }
        }
    }

    mVersion = packageInfo.version;
    mVersionCode = versionCode;

    onStart() {
        this.$super.onStart();
        this.$tv.scrollEl = this.$refs.ContentLayout;
    }
}
</script>

<style lang="scss" scoped>
.About {
    font-size: 12px;
    .VersionLayout {
        padding: 7px;
        color: black;
        &.focus {
            background: rgba($color: $colorPrimary, $alpha: 0.1);
        }
        .Icon {
            height: 64px;
        }
    }
    .Tag {
        & > * + * {
            margin-left: 5px;
        }
    }
    .Quote {
        margin: 5px 10px;
        color: rgba($color: #000000, $alpha: 0.4);
    }
    .QuoteTag {
        padding: 5px 10px;
        * {
            word-break: break-all;
        }
        &.focus {
            background: rgba($color: $colorPrimary, $alpha: 0.1);
        }
        & > *:nth-child(1) > *:nth-child(2),
        & > *:nth-child(2) {
            color: rgba($color: $colorPrimary, $alpha: 1);
        }
    }
}
</style>