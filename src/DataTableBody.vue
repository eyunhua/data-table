<script>
import {Checkbox} from 'veui';
export default {
    name: 'DataTableBody',
    props: {
        store: {
            type: Object,
            default: function () {
                return {};
            }
        },
        columnType: {
            type: String,
            default: 'noFixedColumn'
        },
        bodyTableWidth: {
            type: [String, Number],
            default: 0
        }
    },
    components: {
        'veui-checkbox': Checkbox
    },
    computed: {
        // 距离左侧的距离
        left() {
            return this.store.size.fixedRightWidth - this.bodyTableWidth + 'px';
        },
        // store中的属性
        props() {
            return this.store.props;
        }
    },
    methods: {
        /**
         * 处理merge=children时的rowSpan
         * @param {Object} row 行数据
         * @param {Object} column 列数据
         * @param {Object} rowChildren 子数据
         * @param {number} childrenIndex 子数据索引
         * @return {number} rowspan
         */
        getRowspan(row, column, rowChildren, childrenIndex) {
            if (rowChildren && !column.child) {
                if (childrenIndex === 0) {
                    return row[this.props.merge].length;
                } else {
                    return 0;
                }
            }
        },
        // 获取当前单元格的跨行数
        getCellRowSpan(isChildren, row, rowIndex, column, columnIndex, rowChildren, childrenIndex) {
            return isChildren ? this.getRowspan(row, column, rowChildren, childrenIndex)
                             : typeof this.props.merge === 'function'
                             ? this.props.merge(row, rowIndex, column, columnIndex).rowspan : 1
        },
        // 获取当前单元格的跨行数
        getCellColSpan(isChildren, row, rowIndex, column, columnIndex, rowChildren, childrenIndex) {
            return isChildren ? 1
                            : typeof this.props.merge === 'function'
                            ? this.props.merge(row, rowIndex, column, columnIndex).colspan : 1
        }
    },
    render(h) {
        // colgroup格式化表格的列
        return (
            <table style={{marginLeft: this.columnType === 'fixedRightColumn' ? this.left : 0}}>
                <colgroup>
                    {
                        this.store.columns.filter(e => e.display).map(column => {
                            return <col class={`${column.className}`} width={column.width}></col>;
                        })
                    }
                </colgroup>
                {
                    this.props.data.map((row, rowIndex) => {
                        let props = this.props;
                        // 是否嵌套数据
                        let isChildren = typeof props.merge === 'string' && row[props.merge] && row[props.merge].length > 0;
                        // 渲染Tr行
                        let renderTr = (rowChildren = null, childrenIndex = '') => {
                            return <tr class={`data-table-row ${isChildren && rowChildren && rowChildren.className ? rowChildren.className : row.className || ''} ${rowIndex === this.store.hoverRowIndex && props.highlightHoverRow ? 'data-table-row-hover' : ''} ${rowIndex === this.props.data.length - 1 && childrenIndex === 0 ? 'merge-last-row' : ''}`}
                                on-mouseenter={() => this.store.setHoverRow(rowIndex)}
                                on-mouseleave={() => this.store.setHoverRow(null)}>
                                {
                                    this.store.columns.filter(e => e.display).map((column, columnIndex) => {
                                        let rowspan = this.getCellRowSpan(isChildren, row, rowIndex, column, columnIndex, rowChildren, childrenIndex);
                                        let colspan = this.getCellColSpan(isChildren, row, rowIndex, column, columnIndex, rowChildren, childrenIndex);
                                        if (rowspan !== 0 && colspan !== 0) {
                                            return <td class={`${column.className} ${column.fixed === true || column.fixed === 'left' ? 'header_fixed_left' : ''} ${column.fixed === 'right' ? 'header_fixed_right' : ''} ${!column.fixed ? 'header_no_fixed' : ''} ${rowspan > 1 ? 'rowspan-cell' : ''} ${colspan > 1 ? 'colspan-cell' : ''}`}
                                                rowspan={rowspan}
                                                colspan={colspan}>
                                                <div class="cell"
                                                    title={column.title ? column.child ? rowChildren[column.field] : row[column.field] : ''}>
                                                    {
                                                        this.store[this.columnType].includes(column)
                                                        ? column.renderCell(
                                                            h,
                                                            {
                                                                store: this.store,
                                                                parent: isChildren && column.child ? row : null,
                                                                parentIndex: isChildren && column.child ? rowIndex : null,
                                                                row: isChildren && column.child ? rowChildren : row,
                                                                rowIndex: isChildren && column.child ? childrenIndex : rowIndex,
                                                                column,
                                                                columnIndex
                                                            })
                                                        : ''
                                                    }
                                                </div>
                                            </td>;
                                        }
                                    })
                                }
                            </tr>;
                        };
                        let expandChildrenTr = () => { return ''; };
                        if (typeof props.expanded === 'string' && row[props.expanded] && row[props.expanded].length > 0) {
                            expandChildrenTr = () => {
                                return row[props.expanded].map((childItem, childIndex) => {
                                    return <tr class={`data-table-expand ${childItem.className || ''}`}>
                                        {
                                            this.store.columns.filter(e => e.display).map((column, columnIndex) => {
                                                return <td class={`${column.className} ${column.fixed === true || column.fixed === 'left' ? 'header_fixed_left' : ''} ${column.fixed === 'right' ? 'header_fixed_right' : ''}`}>
                                                    <div class="cell"
                                                        title={column.title ? childItem[column.field] : ''}>
                                                        {/* 上次改为全部列展现，没有考虑到表格中有输入项下拉框的情况，出现了点击非冻结列项时，冻结列也出现了移动 */
                                                            this.store[this.columnType].includes(column)
                                                            ? column.renderCell(
                                                                h,
                                                                {
                                                                    store: this.store,
                                                                    parent: row,
                                                                    parentIndex: rowIndex,
                                                                    row: childItem,
                                                                    rowIndex: childIndex,
                                                                    column,
                                                                    columnIndex
                                                                })
                                                            : ''
                                                        }
                                                    </div>
                                                </td>;
                                            })
                                        }
                                    </tr>;
                                });
                            };
                        }
                        return [
                            isChildren
                                ? row[props.merge].map((childItem, childIndex) => {
                                    return renderTr(childItem, childIndex);
                                })
                                : renderTr(),
                            typeof props.expanded === 'string'
                                ? expandChildrenTr()
                                : props.expanded.includes(row[props.rowKey])
                                    ? <tr class={`data-table-expand ${row.className || ''}`}>
                                        <td colspan={this.store.columns.filter(e => e.display).length}>
                                            {this.store.renderExpand
                                                ? this.store.renderExpand(h, {
                                                    store: this.store,
                                                    row: row,
                                                    rowIndex
                                                })
                                                : ''
                                            }
                                        </td>
                                    </tr>
                                    : ''
                        ];
                    })
                }
            </table>
        );
    }
};
</script>