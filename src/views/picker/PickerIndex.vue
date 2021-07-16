<template>
    <Page class="PickerIndex" :options="mPageOptions">
        <div class="Items wh-100 scroll-y" ref="Items" v-keep-scroll>
            <div class="Item flex-h middle" v-focusable v-for="(item,index) in mItems" :key="index" ref="Item"
                :folder="!!item.path"
                @click="onClick_Item(item,index)">
                <div class="Icon"></div>
                <div class="flex-v flex-1">
                    <div class="Name">{{item.name}}</div>
                    <!-- <div v-if="!item.path" class="Bottom flex-h">
                        <div class="Size">{{formatSize(item.size)}}</div>
                        <div class="Date">{{Format.date(item.lastModifiedDate)}}</div>
                    </div> -->
                </div>
            </div>
        </div>
    </Page>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { PageOptions } from "@/components/Page.vue";
import MyPage from "@/common/MyPage";
import R from "@/common/R";
import Format from "@/tool/Format";

@Component
export default class PickerIndex extends MyPage {
    declare $refs: {
        Items: Element;
        Item: HTMLDivElement[];
    }
    Format = Format;


    mPageOptions = this.createPageOptions();
    createPageOptions(): PageOptions {
        let context = this;
        return {
            toolBar: {
                title: context.$t("title-picker") as string,
            },
            navigationBar: {
                show: true,
                options: {
                    right: context.$t("cancel"),
                    on: {
                        keyPress: {
                            softRight: () => {
                                context.mActivityRequest?.postError("cancel");
                            },
                            "Backspace": (e) => {
                                this.onClick_Back();
                            }
                        },
                        keyDown: {
                            "Backspace": (e) => {
                                e.preventDefault();
                            }
                        }
                    }
                },
            }
        }
    }

    mItems: any[] = [];
    mPaths: {
        items: any[];
        index: number;
    }[] = [];
    mActivityRequest: any;

    mounted() {
        navigator.mozSetMessageHandler?.("activity", (activityRequest) => {
            var option = activityRequest.source;
            if (option.name === "pick") {
                this.mActivityRequest = activityRequest;
            }
        });
    }

    onStart() {
        this.$super.onStart();
        this.$tv.scrollEl = this.$refs.Items;
        if (isDev) {
            let list: any[] = [
                { name: "bbb", path: "/bbb", },
                { name: "bbb", type: "", size: 744654456, lastModifiedDate: Date.now() },
                { name: "aaa", path: "/aaa", },
            ];
            list = [...list.filter(o => o.path), ...list.filter(o => !o.path)];
            this.mItems.push(...list);
        } else {
            this.loadData();
        }
    }

    loadData() {
        let storages = navigator.getDeviceStorages("sdcard");
        this.mPaths.push({
            items: [],
            index: 0,
        });
        storages.forEach((e) => {
            console.log("storages", e);
            this.loadData_Storage(e.getRoot());
        });
    }

    loadData_Storage(request: Promise<any>) {
        request.then((res) => {
            console.log("storage", res);
            this.mPaths[0].items.push(res);
            this.refreshItems();
        }).catch((error) => {
            this.$prompt.showToast(this.$t("failed-to-load"));
        });
    }

    loadData_Path(request: Promise<any>) {
        request.then((res: any[]) => {
            if (!res.length) {
                this.$prompt.showToast(this.$t("empty-folder"));
                return;
            }
            let list = [...res.filter(o => o.path), ...res.filter(o => !o.path)];
            console.log("res", list);
            this.mPaths.push({
                items: list,
                index: 0,
            });
            this.refreshItems();
        }).catch((error) => {
            this.$prompt.showToast(this.$t("failed-to-load"));
        });
    }

    switchItems(items: any[]) {
        this.mItems.push(...items);
    }

    refreshItems() {
        let path = this.mPaths[this.mPaths.length - 1];
        this.mItems = [];
        this.mItems.push(...path.items);
        this.$nextTick(() => {
            let item = this.$refs.Item;
            if (path.index < item.length) {
                this.$tv.requestFocus(item[path.index]);
            }
        })
    }

    formatSize(value: number) {
        let unitArr = new Array("Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB");
        let index = 0;
        let srcsize = value;
        index = Math.floor(Math.log(srcsize) / Math.log(1024));
        let size: any = srcsize / Math.pow(1024, index);
        size = size.toFixed(2);
        return size + unitArr[index];
    }

    onClick_Item(item: any, index: number) {
        if (!item.path) {
            let sdcard = navigator.getDeviceStorage(this.mPaths[0].items[this.mPaths[0].index].name);
            let path = this.mPaths[this.mPaths.length - 2];
            path = path ? path.items[path.index].name : "";
            let request = sdcard.get([path, item.name].filter(o => o).join("/"));
            request.onsuccess = (res) => {
                var file = res.target.result;
                this.mActivityRequest?.postResult({ type: file.type, blob: file });
            };
            request.onerror = () => {
                this.$prompt.showToast(this.$t("failed-to-load"));
            };
            return;
        }
        this.mPaths[this.mPaths.length - 1].index = index;
        this.loadData_Path(item.getFilesAndDirectories());
    }

    onClick_Back() {
        if (this.mPaths.length == 1) {
            return;
        }
        this.mPaths.splice(this.mPaths.length - 1, 1);
        this.refreshItems();
    }

}
</script>

<style lang="scss" scoped>
.PickerIndex {
    position: relative;
    background: rgba($color: #eeeeee, $alpha: 1);
    .Items {
        padding: 10px 0;
        position: relative;
        &::after {
            content: "";
            height: 10px;
            display: block;
        }
        .Item {
            font-size: 12px;
            padding: 5px 16px 5px 16px;
            &.focus {
                background: rgba($color: $colorPrimary, $alpha: 0.3);
            }
            &[folder] {
                .Icon {
                    background: #fecf73;
                }
                .Name {
                    // font-size: 14px;
                }
            }
            .Icon {
                margin-right: 10px;
                background: #b3c3ce;
                width: 16px;
                height: 16px;
                border-radius: 5px;
            }
            .Name {
                word-break: break-all;
            }
            .Bottom {
                color: rgba($color: #000000, $alpha: 0.5);
                font-size: 11px;
                .Size {
                    margin-right: 5px;
                }
                .Date {
                }
            }
        }
    }
}
</style>
