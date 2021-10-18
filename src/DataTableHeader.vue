<script>
// 引入是为了表头中复选框的显示
import {Checkbox} from 'veui';
export default {
    name: 'DataTableHeader',
    props: {
        type: {
            type: String,
            default: 'columns'
        },
        store: {
            type: Object,
            default: function () {
                return {};
            }
        },
        // 表格内容实际宽度
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
        }
    },
    methods: {
        checkAll($event) {
            this.$parent.store.checkAll($event);
        }
    },
    render(h) {  
        return (
            <table style={{marginLeft: this.type === 'fixedRightColumn' ? this.left : 0}}>
                <colgroup>
                    {
                        this.store.columns.filter(e => e.display).map(column => {
                            return <col class={`${column.className}`} width={column.width}></col>;
                        })
                    }
                </colgroup>
                {
                    this.store.groupHeader.map(column => {
                        return <tr>
                            {
                                column.map((item, index) => {
                                    return <th rowspan={item.rowSpan} colspan={item.colspan}
                                    class={`${item.className} ${item.fixed === true || item.fixed === 'left' ? 'header_fixed_left' : ''} ${item.fixed === 'right' ? 'header_fixed_right' : ''}`}>
                                        <div class="cell" title={item.label}>
                                            {
                                                item.renderHeader(
                                                    h,
                                                    {
                                                        store: this.store,
                                                        column: item,
                                                        index
                                                    }
                                                )
                                            }
                                        </div>
                                    </th>
                                })
                            }
                        </tr>;
                    })
                }
            </table>
        );
    }
};
</script>