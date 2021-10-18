<template>
    <div class="data-table"
         :class="{
             'data-table-group-header' : store.isGroupHeader,
             'data-table-noscroll': store.size.bodyTableHeight < store.size.bodyHeight,
             'data-table-scroll': store.size.bodyTableHeight >= store.size.bodyHeight,
             'fixed-right-table': data.length > 0 && store.fixedRightColumn.length > 0 && scrollbarX,
             'nofixed-right-table': !(data.length > 0 && store.fixedRightColumn.length > 0 && scrollbarX),
             'table-mulit-line': isMultiLine
         }"
         ref="dataTable"
         v-resize="handleResize">
        <div class="header-wrapper" ref="headerWrapper">
            <data-table-header
                :store="store"
                :class="{'has-scrollbar': scrollbarY}"
                :style="{
                    width: scrollbarY ? store.size.bodyWidth + 'px' : '100%',
                    tableLayout: data.length === 0 ? 'auto' : 'fixed'}"/>
        </div>
        <div class="body-wrapper"
             ref="bodyWrapper"
             v-if="data.length > 0" v-scroll="handleScroll">
             <!-- 如全部列展示，会出现多个同样的元素，如这时去获取就会出现不知道获取第几个的问题 -->
            <data-table-body
                ref="bodyTable"
                :class="{'has-scrollbar': scrollbarY}"
                :store="store"
                :column-type="store.fixedLeftColumn.length  > 0 && scrollbarX ? 'noFixedColumn' : 'columns'"/>
        </div>
        <div class="empty-wrap" v-else ref="bodyTable">
            <slot name="empty">
                <span class="empty-text">暂无数据</span>
            </slot>
        </div>
        <div class="fixed-wrapper"
             :class="{'scrolling-left': scrollPosition === 'left' && scrollbarX}"
             v-if="data.length > 0 && store.fixedLeftColumn.length  > 0 && scrollbarX"
             v-mousewheel="handleFixedMousewheel"
             :style="{
                 width: store.size.fixedLeftWidth + 1 + 'px',
                 height: dataTableHeight - (showFooter ? 46 : 2) + 'px'
             }"
        >
            <div class="header-fixed-wrapper">
                <data-table-header type="fixedLeftColumn" :store="store"/>
            </div>
            <div class="body-fixed-wrapper" ref="fixedBodyWrapper">
                <data-table-body :store="store" columnType="fixedLeftColumn"/>
            </div>
        </div>
        <div class="fixed-right-wrapper"
             :class="{'scrolling-right': scrollPosition === 'right'}"
             v-if="data.length > 0 && store.fixedRightColumn.length  > 0 && scrollbarX"
             v-mousewheel="handleFixedMousewheel"
             :style="{
                 width: store.size.fixedRightWidth + 'px',
                 height: dataTableHeight - (showFooter ? 46 : 2) + 'px'
        }">
            <div class="header-fixed-wrapper">
                <data-table-header type="fixedRightColumn" :store="store" :body-table-width="bodyTableWidth"/>
            </div>
            <div class="body-fixed-wrapper" ref="rightFixedBodyWrapper">
                <data-table-body :store="store" columnType="fixedRightColumn" :body-table-width="bodyTableWidth"/>
            </div>
        </div>
        <div class="footer-wrapper" ref="footerWrapper" v-if="showFooter && data.length > 0">
            <slot name="footer">
                <veui-pagination
                    :page="pagination.currentPage"
                    :total="pagination.totalCount"
                    ui="info"
                    :page-sizes="pagination.pageSizes"
                    :page-size="pagination.pageSize"
                    @redirect="redirect"
                    @pagesizechange="pagesizechange">
                </veui-pagination>
            </slot>
        </div>
        <div class="hidden-columns" ref="hiddenColumns"><slot/></div>
    </div>
</template>
<script>
import TableStore from './store';
import Scroll from './directives/scroll';
import Mousewheel from './directives/mousewheel';
import DataTableHeader from './DataTableHeader';
import DataTableBody from './DataTableBody';
import {resize} from 'veui/directives';
import {
    Pagination
} from 'veui';
import 'veui-theme-blue/components/pagination.less';
import 'veui-theme-blue/components/select.less';
import 'veui-theme-blue/dropdown.less';
import 'veui-theme-blue/components/input.less';
import 'veui-theme-blue/common.less';
import 'perfect-scrollbar/css/perfect-scrollbar.css';
let tableNum = 0;
export default {
    name: 'DataTable',
    data() {
        let store = new TableStore(this);
        return {
            // store对象
            store,
            // body区域距左侧滚动条距离
            bodyScrollLeft: 0,
            // 表格总体高度
            dataTableHeight: 0,
            tableId: 'data_table_0'
        };
    },
    props: {
        // 表格数据
        data: {
            type: Array,
            default() {
                return [];
            },
            required: true
        },
        // 是否固定表头和表尾(新增)
        fixed: {
            type: Boolean,
            default: false
        },
        // 当前行的key，默认值为id
        rowKey: {
            type: String,
            default: 'id'
        },
        // 高亮显示hover行
        highlightHoverRow: {
            type: Boolean,
            default: false
        },
        // 是否显示表尾
        showFooter: {
            type: Boolean,
            default: true
        },
        // 分页对象
        pagination: {
            type: Object,
            default: () => {
                return {
                    // 当前页
                    currentPage: 1,
                    // 每页个数
                    pageSize: 10,
                    // 每页个数候选项
                    pageSizes: [10, 30, 50],
                    // 总页数
                    totalPage: 10
                };
            }
        },
        // 合并行列
        merge: {
            type: [String, Function],
            default: ''
        },
        // 复选时选中的值
        selected: {
            type: Array,
            default() {
                return [];
            }
        },
        // 展开行展开的数据
        expanded: {
            type: [Array, String],
            default() {
                return [];
            }
        },
        // td内容是否多行显示，超过部分出现省略号
        isMultiLine: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        // 列宽之和
        allColumnsWidth() {
            let width = 0;
            this.store.columns.filter(e => e.display).forEach(e => {
                width += e.width;
            });
            return width;
        },
        // body区域表格的实际宽度
        bodyTableWidth() {
            return this.store.size.bodyWidth > this.allColumnsWidth ? this.store.size.bodyWidth : this.allColumnsWidth;
        },
        // body区域滚动位置
        scrollPosition() {
            let position = '';
            let scrollLeft = this.bodyScrollLeft;
            // 最大滚动宽度
            let maxScrollWidth = this.store.size.bodyTableWidth - this.store.size.bodyWidth;
            if (scrollLeft > 0 && scrollLeft < maxScrollWidth) {
                position = 'middle';
            } else if (scrollLeft === maxScrollWidth) {
                position = 'right';
            } else if (scrollLeft === 0) {
                position = 'left';
            }
            return position;
        },
        // 是否有横向滚动条
        scrollbarX() {
            return this.bodyTableWidth > this.store.size.bodyWidth + 1;
        },
        // 是否有纵向滚动条
        scrollbarY() {
            return this.store.size.bodyTableHeight > this.store.size.bodyHeight;
        }
    },
    watch: {
        'store.localSelected'(val, oldVal) {
            this.$emit('update:selected', val);
        },
        selected(val) {
            this.store.localSelected = val;
        },
        'store.localExpanded'(val, oldVal) {
            this.$emit('update:expanded', val);
        },
        'data.length'(val, oldVal) {
            this.$nextTick(() => {
                this.store.updateElementSize(this);
                if (val === 0) {
                    this.$refs.headerWrapper.scrollLeft = 0;
                }
            });
        },
        // 监测到列变化时，更新表格尺寸大小
        'store.columns'(val, oldVal) {
            this.$nextTick(() => {
                this.store.updateElementSize(this);
            });
        }
    },
    components: {
        DataTableHeader,
        DataTableBody,
        'veui-pagination': Pagination
    },
    directives: {
        Scroll,
        Mousewheel,
        resize
    },
    mounted() {
        this.tableId = `data_table_${tableNum++}`;
        this.$nextTick(() => {
            this.store.updateElementSize(this);
            // 初始化表格高度
            this.dataTableHeight = this.$refs.dataTable.offsetHeight;
        });
    },
    methods: {
        // 监测表格高度发生变化
        handleResize() {
            this.dataTableHeight = this.$refs.dataTable.offsetHeight;
            this.store.updateElementSize(this);
        },
        /**
         * 处理固定区域鼠标的滚轮事件
         * @param {Object} event 滚轮事件对象
         * @param {Object} obj 滚动方向对象（spinX/spinY：wheelDelta的取值（只支持chrome和edge），pixelX/pixelY：deltaY和deltaX的取值（pixelY>0向下滚动，pixelY<0向上滚动））
         */
        handleFixedMousewheel(event, obj) {
            let {pixelX, pixelY} = obj;
            let bodyWrapper = this.$refs.bodyWrapper;
            if (Math.abs(pixelY) > 0) { // 纵向滑动
                let scrollTop = bodyWrapper.scrollTop;
                // 向上滑，无可滑动区域时，不再滑动
                if (pixelY < 0 && scrollTop !== 0) {
                    event.preventDefault();
                }
                // 向下滑时，如果可滚动区域大于已滚动，则不再滚动，scrollHeight为元素内容高度，包括由于溢出导致的视图中不可见内容
                if (pixelY > 0 && bodyWrapper.scrollHeight - bodyWrapper.clientHeight > scrollTop) {
                    event.preventDefault();
                }
                // 向上取整
                bodyWrapper.scrollTop += Math.ceil(pixelY / 5);
            } else {
                if (bodyWrapper.scrollLeft === 0 || bodyWrapper.scrollLeft === bodyWrapper.scrollWidth - bodyWrapper.clientWidth) {
                    event.preventDefault();
                }
                if (pixelX > 0) { // 向右滑动，向上取整
                    bodyWrapper.scrollLeft += Math.ceil(pixelX / 5);
                } else if (pixelX < 0) { // 向左滑动，向下取整
                    bodyWrapper.scrollLeft += Math.floor(pixelX / 5);
                }
            }
        },
        /**
         * 处理滚动条滚动事件
         * @param {Object} event 事件对象
         * @param {Object} element 当前滚动元素
         */
        handleScroll(event, element) {
            let {scrollTop, scrollLeft} = element;
            // 最大滚动距离
            let maxScrollLeft = this.bodyTableWidth - this.store.size.bodyWidth;
            // 超过最大滚动距离，需要将滚动距离重新设回最大滚动距离
            if (scrollLeft > maxScrollLeft) {
                this.$refs.bodyWrapper.scrollLeft = maxScrollLeft;
            } else {
                this.$nextTick(() => {
                    // 设置表头的left偏移值
                    if (this.$refs.headerWrapper) {
                        this.$refs.headerWrapper.scrollLeft = scrollLeft;
                    }
                    // 设置固定区域的top偏移值
                    if (this.$refs.fixedBodyWrapper) {
                        this.$refs.fixedBodyWrapper.scrollTop = scrollTop;
                    }
                    if (this.$refs.rightFixedBodyWrapper) {
                        this.$refs.rightFixedBodyWrapper.scrollTop = scrollTop;
                    }
                    this.bodyScrollLeft = scrollLeft;
                    this.$emit('scroll', event);
                });
            }
        },
        /**
         * 处理每页个数改变时事件
         * @param {number} size 每页个数
         */
        pagesizechange(size) {
            this.$set(this.pagination, 'pageSize', size);
        },
        /**
         * 处理当前页改变时事件
         * @param {number} page 当前页
         * @param {obj} event 事件对象
         */
        redirect(page, event) {
            this.$set(this.pagination, 'currentPage', page);
        }
    }
};
</script>
<style lang="less">
// 表格框线颜色
@table-border-color: #eeeeee;
// 表头背景色
@table-header-bg: #f5f5f5;
// td内容多行显示
.table-mulit-line {
    .data-table-row {
        td {
            height: 67px!important;
        }
        .cell {
            text-overflow: clip!important;
            white-space: normal!important;
            width: 100%;
            height: 60px;
            line-height: 20px;
            overflow: hidden;
            &:before {
                content: '';
                float: left;
                width: 5px;
                height: 100%;
            }
            &>:first-child {
                float: right;
                width: 100%;
                margin-left: -5px;
                word-break: break-all;
                word-wrap: break-word;
            }
            &:after {
                content: '...';
                box-sizing: content-box;
                float: right;
                position: relative;
                width: 16px;
                top: -20px;
                left: 100%;
                margin-left: -16px;
                padding-right: 5px;
                text-align: center;
                background: #fff;
                // background: linear-gradient(to right, rgba(255, 255, 255, 0), #ffffff 20px);
            }
        }
        &.data-table-row-hover {
            .cell {
                &:after {
                    background: #FAFAFA;
                }
            }
        }
    }
}
.data-table {
    width: 100%;
    height: 100%;
    border: 1px solid @table-border-color;
    position: relative;
    overflow: hidden;
    background: #fff;
    display: flex;
    flex-direction: column;
    .ps__rail-x,
    .ps__rail-y {
        z-index: 99;
        opacity: 0.2;
    }
    .ps__rail-x {
        height: 11px;
        &:active,
        &:hover {
            .ps__thumb-x {
                height: 7px;
            }
        }
    }
    .ps__rail-y {
        width: 11px;
        &:active,
        &:hover {
            .ps__thumb-y {
                width: 7px;
            }
        }
    }
    &.nofixed-right-table {
        table {
            tr {
                th, td {
                    &:last-child {
                        border-right: 0 none;
                    }
                }
            }
        }
    }
    &.fixed-right-table {
        table {
            tr {
                th, td {
                    &:last-child {
                        border-right: 0 none;
                    }
                }
            }
        }
    }
    &.data-table-scroll {
        table {
            tr:last-child {
                td {
                    border-bottom: 0 none;
                }
            }
        }
    }
    .body-wrapper,
    .empty-wrap {
        flex: 1;
    }
    // 固定非滚动条时body区域最后一行td设置下边框
    &.data-table-noscroll {
        table {
            tr:last-child {
                td {
                    border-bottom: 1px solid @table-border-color;
                }
            }
        }
    }
    .fixed-wrapper {
        position: absolute;
        left: 0;
        top: 0;
        z-index: 20;
        overflow: hidden;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.12);
        display: flex;
        flex-direction: column;
    }
    .fixed-right-wrapper {
        position: absolute;
        right: 0;
        top: 0;
        overflow: hidden;
        z-index: 20;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.12);
        display: flex;
        flex-direction: column;
        .body-fixed-wrapper {
            z-index: 21;
        }
    }
    .scrolling-left,
    .scrolling-right {
        box-shadow: none;
    }
    // 表头
    .header-wrapper {
        display: flex;
        flex-shrink: 0;
    }
    .header-wrapper,
    .header-fixed-wrapper {
        overflow: hidden;
        table {
            height: ~"calc(100% - 1px)";
            th {
                background: @table-header-bg;
            }
        }
    }
    .body-fixed-wrapper {
        background: #fff;
        overflow: hidden;
        flex: 1;
    }
    .fixed-right-patch {
        position: absolute;
        top: 0;
        right: 0;
    }
    // 表格内容区域
    .body-wrapper {
        position: relative;
    }
    // 表尾区域
    .footer-wrapper {
        border-top: 1px solid @table-border-color;
        padding: 10px 16px;
        width: 100%;
        height: 44px;
        .veui-pagination {
            width: 100%;
            height: auto;
            padding: 0;
            border: 0 none;
            &-info {
                line-height: 22px;
                color: #666;
                .veui-select {
                    height: 22px;
                    .veui-select-button {
                        height: 22px;
                        line-height: 22px;
                        min-width: 44px;
                        .veui-select-label {
                            max-width: none;
                            width: auto;
                            float: left;
                            margin-right: 5px;
                            color: #999;
                        }
                        .veui-icon {
                            margin-top: 7px;
                            margin-right: 0;
                        }
                    }
                }
            }
            .veui-pagination-switch {
                float: right;
                .veui-pagination-prev, .veui-pagination-next {
                    width: 22px;
                    height: 22px;
                    line-height: 20px;
                    outline: none;
                    cursor: pointer;
                }
                .veui-pagination-pages li {
                    min-width: 22px;
                    height: 22px;
                    line-height: 22px;
                    span.veui-link {
                        min-width: 20px;
                        padding: 0 6px;
                        outline: none;
                        cursor: pointer;
                        color: #666;
                    }
                    &:hover span.veui-link,
                    &.veui-active span {
                        color: #fff;
                    }
                }
            }
        }
    }
    // 表格
    table {
        width: 100%;
        table-layout: fixed;
        tr.data-table-expand {
            background: rgba(235, 237, 243, .5);
        }
        tr.data-table-row {
            &-hover {
                background: #FAFAFA;
            }
            &.merge-last-row {
                .rowspan-cell {
                    border-bottom: 0 none;
                }
            }
        }
        th, td {
            height: 39px;
            border-right: 1px solid @table-border-color;
            border-bottom: 1px solid @table-border-color;
            overflow: hidden;
            .cell {
                width: 100%;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                padding: 0 10px;
            }
            // rowspan="0",display:none隐藏掉会导致在合并单元格时scrollWidth多了1px
            // &[rowspan="0"],
            // &[colspan="0"] {
            //     display: none;
            // }
        }
    }
    // 暂无数据
    .empty-wrap {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 12px 0;
        .empty-text {
            font-size: 12px;
            color: #999;
        }
    }
    .resize-triggers {
        z-index: 0;
    }
}
</style>