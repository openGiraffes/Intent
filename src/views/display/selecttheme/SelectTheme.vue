<template>
    <Page class="SelectTheme" :options="mPageOptions">
        <div class="Items wh-100 scroll-y" ref="Items" v-keep-scroll>
            <div class="Item flex-h" v-focusable
                v-for="(item,index) in mItems" :key="index" ref="Item"
                @click="onClick_Select(index)" @up="onUp(index)" @down="onDown(index)">
                <img class="Icon" :src="item.icon" />
                <div class="View2 flex-v flex-1">
                    <div class="Name">{{item.name}}</div>
                    <div v-if="item.developer" class="Developer">{{item.developer.name}}</div>
                    <div class="Description">{{item.description}}</div>
                    <div v-if="item.version" class="Type">{{"v"+item.version}}</div>
                </div>
                <div v-if="item.manifestURL == mSelected" class="Selected">{{$t("selected")}}</div>
            </div>
        </div>
    </Page>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { PageOptions } from "@/components/Page.vue";
import MyPage from "@/common/MyPage";
import R from "@/common/R";

@Component
export default class SelectTheme extends MyPage {
    declare $refs: {
        Items: Element;
        Item: Element[];
    }


    mPageOptions = this.createPageOptions();
    createPageOptions(): PageOptions {
        let context = this;
        return {
            toolBar: {
                title: context.$t("select-theme") as string,
            },
            navigationBar: {
                show: true,
                options: {
                    center: context.$t("select"),
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

    mItems: any[] = [];

    mSelected = "";

    mounted() {
        this.loadData_Apps();
        let lock = navigator.mozSettings.createLock()
        let request = lock.get("theme.selected");
        request.onsuccess = () => {
            this.mSelected = request.result["theme.selected"];
        };
    }


    onStart() {
        this.$super.onStart();
        this.$tv.scrollEl = this.$refs.Items;
    }


    pickUpAppIconInProperSize(e, x?: any) {
        var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 56;
        return e[
            Object.keys(e).sort(function (e: any, n: any) {
                return (e - n) * (e >= t ? 1 : -1);
            })[0]
        ];
    }

    getAppIconUrl(e, t?: any, n?: any) {
        if (((t = t || e.manifest.icons), !t)) return null;
        var i = this.pickUpAppIconInProperSize(t, n);
        return /^(http|data)/.test(i) || (i = e.origin + i), i;
    };

    loadData_Apps() {
        let result = navigator.mozApps.mgmt.getAll();
        result.onsuccess = (result) => {
            let apps = result.target.result.reverse() as any[];
            this.mItems = apps.filter(o => o.manifest.role == "theme").map(o => {
                return {
                    icon: this.getAppIconUrl(o),
                    name: o.manifest.name,
                    description: o.manifest.description,
                    type: o.manifest.type,
                    origin: o.origin,
                    version: o.manifest.version,
                    role: o.manifest.role,
                    developer: o.manifest.developer,
                    manifestURL: o.manifestURL,
                    mozApp: o,
                };
            })
            this.$nextTick(() => {
                this.requestFocus();
            })
        };
        result.onerror = (error) => {
            this.$prompt.showToast(this.$t("failed-to-load") + error);
        };
    }

    onClick_Select(index: number) {
        let item = this.mItems[index].manifestURL;
        let lock = navigator.mozSettings.createLock()
        lock.set({
            "theme.selected": item,
        });
        this.mSelected = item;
        this.$prompt.showToast(this.$t("has-set"));
    }

    onUp(index: number) {
        if (this.mItems.length < 2) {
            return;
        }
        if (index == 0) {
            this.$tv.requestFocus(this.$refs.Item[this.mItems.length - 1]);
        }
    }

    onDown(index: number) {
        if (this.mItems.length < 2) {
            return;
        }
        if (index == this.mItems.length - 1) {
            this.$tv.requestFocus(this.$refs.Item[0]);
        }
    }

}
</script>

<style lang="scss" scoped>
.SelectTheme {
    position: relative;
    .Items {
        position: relative;
        .Item {
            font-size: 14px;
            padding: 5px 16px;
            border-bottom: 1px solid rgba(0, 0, 0, 0.05);
            position: relative;
            &.focus {
                background: rgba($color: $colorPrimary, $alpha: 0.1);
            }
            .Developer {
                color: rgb(0, 162, 255);
                font-size: 12px;
            }
            .Icon {
                width: 50px;
                height: 50px;
            }
            .View2 {
                margin-left: 10px;
            }
            .Description {
                // overflow: hidden;
                // text-overflow: ellipsis;
                // display: -webkit-box;
                // -webkit-line-clamp: 2;
                // -webkit-box-orient: vertical;
                // max-height: 32px;
                color: rgba(0, 0, 0, 0.3);
                font-size: 12px;
                word-break: break-all;
            }
            .Type {
                color: rgba(0, 0, 0, 0.3);
                font-size: 12px;
            }
            .Selected {
                position: absolute;
                right: 0;
                top: 0;
                font-size: 10px;
                padding: 2px 7px;
                border-bottom-left-radius: 5px;
                background: rgba($color: $colorPrimary, $alpha: 1);
                color: white;
            }
        }
    }
}
</style>
