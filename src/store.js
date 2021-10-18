/* eslint-disable */
import Vue from 'vue';
import PerfectScrollbar from 'perfect-scrollbar';
class TableStore {
    constructor(table = {}, initState = {}) {
        this.$this = null;
        this.props = table._props;
        // 本地选中数据集合
        this.localSelected = table._props.selected;
        // 本地展开数据集合
        this.localExpanded = table._props.expanded;
        // 初始列
        this.originColumns = [];
        // 列头
        this.groupHeader = [];
        // 列的层级深度
        this.maxLevel = 1;
        // 是否多级表头
        this.isGroupHeader = false;
        // 列
        this.columns = [];
        // 非固定列
        this.noFixedColumn = [];
        // 左边固定列
        this.fixedLeftColumn = [];
        // 右边固定列
        this.fixedRightColumn = [];
        // expand展开区域slot
        this.renderExpand = null;
        // hover行索引
        this.hoverRowIndex = null;
        // 元素尺寸大小
        this.size = {
            // 表格区域高度
            tableHeight: 0,
            // 头部高度
            headerHeight: 0,
            // 表格主体高度
            bodyHeight: 0,
            // 表格主体宽度
            bodyWidth: 0,
            // 内容区域表格高度
            bodyTableHeight: 0,
            // 内容区域表格宽度
            bodyTableWidth: 0,
            // 底部高度
            footerHeight: 0,
            // 左边固定区域宽度
            fixedLeftWidth: 0,
            // 右边固定区域宽度
            fixedRightWidth: 0
        };
        // 滚动条
        this.perfectScrollbar = null;
    }

    /**
     * 插入列
     * @param {number} index 插入索引
     * @param {Object} props 列接收到的props集合
     */
    insertColumn(index, props, parent) {
        let columns = this.originColumns;
        let obj = {...props};
        obj.fixed = obj.fixed === '' ? true : obj.fixed;
        obj.title = obj.title === '' ? true : obj.title;
        // 处理width，支持px单位也支持纯数字
        if (typeof props.width === 'string') {
            if (props.width.includes('px')) {
                obj.width = props.width.replace('px', '');
            }
            if (!isNaN(Number(obj.width))) {
                obj.width = Number(obj.width);
            } else {
                obj.width = 80;
            }
        }
        if (parent) { // 有父级
            columns = parent.children; // 有children则将children数组赋值给columns
            if (!columns) { // 无children则初始化
                columns = parent.children = [];
            }
        }
        if (obj.display) {
            if (typeof index !== 'undefined') {
                columns.splice(index, 0, obj);
            } else {
                columns.push(obj);
            }
        }
        this.updateColumn();
    }

    // 循环获取某节点的父级节点
    getParent(parent) {
        let arr = [];
        let a = item => {
            if (!item.parent.label) {
                arr.unshift(item);
            } else {
                arr.unshift(item);
                a(item.parent);
            }
        }
        a(parent);
        return arr;
    }

    // 循环删除列
    deepRemoveColumn(item, removeArr, index) {
        item.forEach((e, i) => {
            if (e.type === removeArr[index].type && e.label === removeArr[index].label) {
                if (index < removeArr.length - 1) {
                    this.deepRemoveColumn(e.children, removeArr, index + 1);
                } else {
                    Vue.delete(item, i);
                }
            }
        });
    }

    /**
     * 删除某列
     * @param {Object} columnConfig 删除列数据
     */
    removeColumn(columnConfig) {
        let removeArr = this.getParent(columnConfig);
        this.deepRemoveColumn(this.originColumns, removeArr, 0);
        this.updateColumn();
    }

    // 获取叶子节点列
    getLeafColumns (column) {
        let arr = [];
        for (let item of column) {
            if (item.children && item.children.length > 0) {
                this.isGroupHeader = true;
                arr.push.apply(arr, this.getLeafColumns(item.children));
            } else {
                arr.push(item);
            }
        }
        return arr;
    }

    /**
     * 更新列
     */
    updateColumn() {
        this.columns = this.getLeafColumns(this.originColumns);
        this.groupHeader = this.setColumnColRow();
        this.fixedLeftColumn = this.columns.filter(item => {
            return item.fixed === true || item.fixed === 'left';
        });
        this.fixedRightColumn = this.columns.filter(item => {
            return item.fixed === 'right';
        });
        this.noFixedColumn = this.columns.filter(item => {
            return item.fixed === false;
        });
    }

    // 设置列的跨列数和跨行数
    setColumnColRow() {
        let arr = this.originColumns;
        let level = 1;
        arr.forEach(item => {
            item.level = level;
            this.setColumnLevel(item);
        });
        var rows = [];
        for (var i = 0; i < this.maxLevel; i++) {
            rows.push([]);
        }

        var allColumns = this.getAllColumns(arr);
        allColumns.forEach(column => {
            if (!column.children) {
                column.rowSpan = this.maxLevel - column.level + 1;
            } else {
                column.rowSpan = 1;
            }
            if (Array.isArray(rows[column.level - 1])) {
                rows[column.level - 1].push(column);
            }
        });
        return rows;
    }

    // 将所有列铺平
    getAllColumns(columns) {
        const result = [];
        columns.forEach((column) => {
            if (column.children) {
                result.push(column);
                result.push.apply(result, this.getAllColumns(column.children));
            } else {
                result.push(column);
            }
        });
        return result;
    }

    // 设置每一列的level数
    setColumnLevel(item) {
        if (item.children && item.children.length > 0) {
            let colspan = 0;
            item.children.forEach(childItem => {
                // 从外到内计算层级level
                childItem.level = item.level + 1;
                if (item.level + 1 > this.maxLevel) {
                    this.maxLevel = item.level + 1;
                }
                // 从内到外计算colspan，colspan=children的length
                this.setColumnLevel(childItem);
                colspan += childItem.colspan;
            });
            item.colspan = colspan;
        } else {
            item.colspan = 1;
        }
    }

    /**
     * 更新页面元素的尺寸大小
     * @param {Object} $this 当前vue实例
     */
    updateElementSize($this) {
        if ($this.$refs.bodyWrapper) {
            // perfectScrollbar下拉无限滚动
            if (this.perfectScrollbar) {
                this.perfectScrollbar.destroy();
                this.perfectScrollbar = null;
            }
            this.perfectScrollbar = new PerfectScrollbar($this.$refs.bodyWrapper, {
                wheelSpeed: 2,
                wheelPropagation: true,
                minScrollbarLength: 20
            });
        }
        this.$this = $this;
        this.size.tableHeight = $this.$el.offsetHeight;
        if ($this.$refs.headerWrapper) {
            this.size.headerHeight = $this.$refs.headerWrapper.offsetHeight;
        }
        if ($this.$refs.footerWrapper) {
            this.size.footerHeight = $this.$refs.footerWrapper.offsetHeight;
        }
        this.size.bodyHeight = this.size.tableHeight - this.size.headerHeight - this.size.footerHeight - 2;
        if ($this.$refs.bodyWrapper) {
            this.size.bodyWidth = $this.$refs.bodyWrapper.offsetWidth;
        }
        if ($this.$refs.bodyTable) {
            if ($this.$refs.bodyTable.$el) {
                this.size.bodyTableHeight = $this.$refs.bodyTable.$el.offsetHeight;
                this.size.bodyTableWidth = $this.$refs.bodyTable.$el.offsetWidth;
            } else {
                this.size.bodyTableHeight = Math.floor($this.$refs.bodyTable.getBoundingClientRect().height);
                this.size.bodyTableWidth = Math.floor($this.$refs.bodyTable.getBoundingClientRect().width);
            }
        }
        let interval = setInterval(() => {
            let headerWrapper = $this.$refs.headerWrapper;
            if (headerWrapper) {
                clearInterval(interval);
                this.size.fixedLeftWidth = 0;
                this.size.fixedRightWidth = 0;
                let leftNodeList = headerWrapper.querySelectorAll('.header_fixed_left');
                for (let index = 0; index < leftNodeList.length; index++) {
                    this.size.fixedLeftWidth += leftNodeList[index].offsetWidth;
                }
                let rightNodeList = headerWrapper.querySelectorAll('.header_fixed_right');
                for (let index = 0; index < rightNodeList.length; index++) {
                    this.size.fixedRightWidth += rightNodeList[index].offsetWidth;
                }
            }
        }, 500);
    }

    /**
     * 复选一行数据
     * @param {Object} item 当前行数据
     * @param {boolean} checked 是否选中
     */
    checkOne(item, checked) {
        if (checked) { // 选中
            this.localSelected.push(item[this.props.rowKey || 'id']);
        } else { // 取消选中
            this.localSelected.forEach((e, i) => {
                if (e === item[this.props.rowKey || 'id']) {
                    Vue.delete(this.localSelected, i);
                }
            });
        }
    }

    /**
     * 复选全部数据
     * @param {boolean} checked 是否选中
     */
    checkAll(checked) {
        if (checked) { // 选中
            this.props.data.forEach(e => {
                if (!this.localSelected.includes(e[this.props.rowKey || 'id'])) {
                    this.localSelected.push(e[this.props.rowKey || 'id']);
                }
            });
        } else { // 取消选中
            this.localSelected.splice(0, this.localSelected.length);
        }
    }

    /**
     * 设置单元格表头展示的函数
     * @param {Object} $columnVm column实例
     * @return {Function} 渲染函数
     */
    setRenderHeader($columnVm) {
        return function (h, {store, column, index}) {
            if ($columnVm.type === 'multiple') {
                return <veui-checkbox
                    indeterminate={store.localSelected.length > 0
                        && store.localSelected.length < store.props.data.length
                    }
                    checked={store.localSelected.length > 0 && store.localSelected.length === store.props.data.length}
                    on-change={$event => {store.checkAll($event);}}>
                </veui-checkbox>;
            } else {
                return $columnVm.label;
            }
        };
    }

    /**
     * 设置单元格内容展示的函数
     * @param {Object} $columnVm column实例
     * @return {Function} 渲染函数
     */
    setRenderCell($columnVm) {
        // 默认显示文本
        let renderCell = function (h, {row, column}) {
            return row[column.field];
        };
        // 复选
        if ($columnVm.type === 'multiple') {
            renderCell = function (h, {store, row, column}) {
                return <veui-checkbox
                    checked={store.localSelected.includes(row[store.props.rowKey || 'id'])}
                    on-change={$event => {store.checkOne(row, $event);}}>
                </veui-checkbox>;
            };
        }
        // 展开
        if ($columnVm.type === 'expand') {
            renderCell = function (h, {store, row, rowIndex, column, columnIndex}) {
                return <div>
                    {
                        store.props.expanded.includes(row[store.props.rowKey])
                            ? <span on-click={() => {store.expandLine(false, row, rowIndex);}}>收起</span>
                            : <span on-click={() => {store.expandLine(true, row, rowIndex);}}>展开</span>
                    }
                </div>;
            };
        }
        return renderCell;
    }

    /**
     * 设置展开的render函数
     * @param {Object} $columnVm column实例
     */
    setRenderExpand($columnVm) {
        if ($columnVm.type === 'expand') {
            this.renderExpand = function (h, data) {
                if ($columnVm.$scopedSlots.expand) {
                    return $columnVm.$scopedSlots.expand(data);
                }
            };
        }
    }

    /**
     * 展开收起某行
     * @param {boolean} expanded 是否展开，true为展开，false为收起
     * @param {Object} row 行数据
     * @param {number} rowIndex 行索引
     */
    expandLine(expanded, row, rowIndex) {
        if (expanded) {
            if (!this.localExpanded.includes(row[this.props.rowKey || 'id'])) {
                this.localExpanded.push(row[this.props.rowKey || 'id']);
            }
        } else {
            this.localExpanded.forEach((e, i) => {
                if (e === row[this.props.rowKey || 'id']) {
                    Vue.delete(this.localExpanded, i);
                }
            });
        }
        this.$this.$emit('expand', {row: row, index: rowIndex, status: expanded});
    }

    /**
     * 设置当前hover行索引
     * @param {number} index 当前行索引
     */
    setHoverRow(index) {
        this.hoverRowIndex = index;
    }
};

export default TableStore;
/* eslint-enable */
