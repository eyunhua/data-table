<script>
let columnNum = 0;
import TableStore from './store';
export default {
    name: 'DataTableColumn',
    data() {
        return {
            columnId: 'data_column_0',
            isSub: false,
            defaultSlot: {
                store: new TableStore(this),
                parent: {},
                parentIndex: '',
                row: {},
                rowIndex: '',
                column: {},
                columnIndex: ''
            }
        }
    },
    computed: {
        table() {
            let parent = this.$parent;
            while (parent && !parent.tableId) {
                parent = parent.$parent;
            }
            return parent;
        },

        columnParent() {
            let parent = this.$parent;
            while (parent && !parent.tableId && !parent.columnId) {
                parent = parent.$parent;
            }
            return parent;
        }
    },
    props: {
        // 列的类型，需要验证可选值（todo）
        type: {
            type: String,
            default: ''
        },
        // 列标题文本
        label: {
            type: String,
            default: ''
        },
        // 列取值字段
        field: {
            type: String,
            default: ''
        },
        // 列宽
        width: {
            type: [Number, String],
            default: 80
        },
        // 是否嵌套数据
        child: {
            type: Boolean,
            default: false,
        },
        // 列固定的类型
        fixed: {
            type: [String, Boolean],
            default: false,
            validator: function (value) {
                return ['', true, false, 'left', 'right'].includes(value);
            }
        },
        // 自定义列class名
        className: {
            type: String,
            default: '',
        },
        // hover时是否需要显示标题
        title: {
            type: Boolean,
            default: true
        },
        // 是否显示
        display: {
            type: Boolean,
            default: true
        }
    },
    mounted() {
        this.columnId = `data_column_${columnNum++}`;
        this.isSub = this.table !== this.columnParent;
        // 默认显示文本
        let renderCell = this.table.store.setRenderCell(this);
        // 设置渲染单元格方法
        this.$props.renderCell = (h, data) => {
            if (this.$scopedSlots.default) {
                renderCell = () => this.$scopedSlots.default(data);
            }
            return renderCell(h, data);
        };
        let renderHeader = this.table.store.setRenderHeader(this);
        // 设置渲染表头方法
        this.$props.renderHeader = (h, data) => {
            if (this.$scopedSlots.header) {
                renderHeader = () => this.$scopedSlots.header(data);
            }
            return renderHeader(h, data);
        };
        let children = this.isSub ? this.columnParent.$el.children : this.columnParent.$refs.hiddenColumns.children;
        // // 获取当前列元素在整个列数组中的索引，children获取的为HTMLCollection，通过call为html集合数组添加indexOf方法
        let colIndex = [].indexOf.call(children, this.$el);
        this.$props.parent = this.columnParent.$props;
        this.table.store.insertColumn(colIndex, this.$props, this.isSub ? this.columnParent.$props : '');
        this.table.store.setRenderExpand(this);
    },
    destroyed() {
        this.table.store.removeColumn(this.$props);
    },
    render(h) {
        return h('div', this.$slots.default);
    }
};
</script>