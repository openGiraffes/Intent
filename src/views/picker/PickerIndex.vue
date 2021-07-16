<template>
    <Page class="PickerIndex" :options="mPageOptions">
        <div class="Items wh-100 scroll-y" ref="Items" v-keep-scroll>
            <div class="Item flex-h middle" v-focusable v-for="(item,index) in mItems" :key="index" ref="Item"
                :folder="item.type === undefined"
                @click="onClick_Item(item)">
                <div class="Icon"></div>
                <div class="flex-v flex-1">
                    <div class="Name">{{item.name}}</div>
                    <div v-if="item.type !== undefined" class="Bottom flex-h">
                        <div class="Size">{{formatSize(item.size)}}</div>
                        <div class="Date">{{Format.date(item.lastModifiedDate)}}</div>
                    </div>
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
                                context.back();
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
    mPaths: any[][] = [];

    onStart() {
        this.$super.onStart();
        this.$tv.scrollEl = this.$refs.Items;
        if (isDev) {
            this.mItems.push({ name: "文件夹", }, { name: "文件", type: "", size: 744654456, lastModifiedDate: Date.now() })
        } else {
            this.loadData();
        }
    }

    loadData() {
        let storages = navigator.getDeviceStorages("sdcard");
        this.mPaths.push([]);
        storages.forEach((e) => {
            this.loadData_Storage(e.getRoot());
        });
    }

    loadData_Storage(request: Promise<any>) {
        request.then((res) => {
            this.mPaths[0].push(res);
            this.refreshItems();
        }).catch((error) => {
            this.$prompt.showToast("加载失败");
        });
    }

    loadData_Path(request: Promise<any>) {
        request.then((res) => {
            console.log("res", res);
            this.mPaths.push(res);
            this.refreshItems();
        }).catch((error) => {
            this.$prompt.showToast("加载失败");
        });
    }

    switchItems(items: any[]) {
        this.mItems = [];
        this.mItems.push(...items);
    }

    refreshItems() {
        this.switchItems(this.mPaths[this.mPaths.length - 1]);
        // this.$nextTick(() => {
        //     let item = this.$refs.Item;
        //     if (item.length) {
        //         this.$tv.requestFocus(item[0]);
        //     }
        // })
    }

    formatSize(value: number) {
        let unitArr = new Array("Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB");
        let index = 0;
        let srcsize = value;
        index = Math.floor(Math.log(srcsize) / Math.log(1024));
        let size: any = srcsize / Math.pow(1024, index);
        size = size.toFixed(2);//保留的小数位数
        return size + unitArr[index];
    }

    onClick_Item(item: any) {
        if (item.type !== undefined) {
            this.$prompt.showToast("文件");
            return;
        }
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
        // padding: 10px 16px;
        position: relative;
        &::after {
            content: "";
            height: 10px;
            display: block;
        }
        .Item {
            font-size: 12px;
            padding: 7px 16px 7px 16px;
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
                width: 20px;
                height: 20px;
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
