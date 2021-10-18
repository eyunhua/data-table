<template>
    <div>
        <section style="marginTop: 50px;">
            <h1>展开收起列隐藏</h1>
            <p>已经展开行的id：{{expanded}}</p>
            <data-table
                :data="data"
                class="data-table-demo"
                :highlight-hover-row="true"
                :show-footer="false"
                :expanded.sync="expanded"
                @expand="expandRowCallback"
                >
                <data-table-column
                    type="expand"
                    width="50px"
                    fixed="left"
                    :display="false">
                    <template slot-scope="{store, row}">
                        <div v-if="showExpandArr.includes(row.id)">
                            <span v-if="expanded.includes(row.id)" @click="expandLine(false, row)">收起</span>
                            <span v-else @click="expandLine(true, row)">展开</span>
                        </div>
                    </template>
                    <template slot-scope="{store, row}" slot="expand">
                        <veui-form :data="row">
                            <veui-fieldset>
                                <veui-field label="展开label-1：" field="id">
                                    <span>{{row.id}}</span>
                                </veui-field>
                                <veui-field label="展开label-2：" field="name">
                                    <span>{{row.name}}</span>
                                </veui-field>
                                <veui-field label="展开label-3：" field="age">
                                    <span>{{row.age}}</span>
                                </veui-field>
                            </veui-fieldset>
                            <veui-fieldset>
                                <veui-field label="展开label-4：" field="address">
                                    <span>{{row.address}}</span>
                                </veui-field>
                                <veui-field label="展开label-5：" field="desc">
                                    <span>{{row.desc}}</span>
                                </veui-field>
                                <veui-field label="展开label-6：" field="desc">
                                    <span>{{row.desc}}</span>
                                </veui-field>
                            </veui-fieldset>
                        </veui-form>
                    </template>
                </data-table-column>
                <data-table-column
                    label="ID"
                    field="id"
                    className="id-column"
                    width="150px"
                    fixed="left">
                </data-table-column>
                <data-table-column
                    label="姓名"
                    field="name"
                    width="100px"
                    fixed>
                </data-table-column>
                <data-table-column
                    label="年龄"
                    field="age"
                    width="200px">
                    <template slot-scope="{row, column}">
                        <span style="color: red;">{{row[column.field]}}</span>
                    </template>
                </data-table-column>
                <data-table-column
                    label="地址"
                    field="address"
                    width="300px">
                </data-table-column>
                <data-table-column
                    label="描述"
                    field="desc"
                    width="150px"
                    fixed="right">
                </data-table-column>
            </data-table>
        </section>
        <section>
            <h1>多级表头</h1>
            <data-table
                class="data-table-demo"
                :data="treeData1"
                :highlight-hover-row="false"
                :show-footer="false"
                :pagination="pagination"
                >
                <data-table-column
                    label="省份"
                    class-name="address-column"
                    field="address"
                    width="150px"
                    fixed
                    :display="false">
                    <template slot-scope="{row, rowIndex, column}">
                        <span style="color: red;" :style="{'marginLeft': (row.level - 1) * 20 + 'px'}">
                            {{row[column.field]}}
                            <span v-if="row.children && row.children.length > 0 && !row.expanded" @click="expandedPro(row, rowIndex, true)">➕</span>
                            <span v-else-if="row.expanded" @click="expandedPro(row, rowIndex, false)">➖</span>
                        </span>
                    </template>
                </data-table-column>
                <data-table-column label="详细信息1">
                    <span slot="header">自定义表头❓</span>
                    <data-table-column
                        label="字段1"
                        field="field1"
                        width="100px"
                        fixed>
                        <template slot-scope="{row, column}">
                            <span style="color: blue;">{{row[column.field]}}</span>
                        </template>
                    </data-table-column>
                    <data-table-column
                        label="字段2"
                        field="field2"
                        width="100px"
                        :display="false">
                    </data-table-column>
                    <data-table-column
                        label="字段3"
                        field="field3"
                        width="100px">
                    </data-table-column>
                    <data-table-column
                        label="字段4"
                        field="field4"
                        width="100px">
                    </data-table-column>
                </data-table-column>
                <data-table-column label="详细信息2">
                    <span slot="header">自定义表头❓</span>
                    <data-table-column
                        label="字段5"
                        field="field5"
                        width="100px">
                        <template slot-scope="{row, column}">
                            <span style="color: blue;">{{row[column.field]}}</span>
                        </template>
                    </data-table-column>
                    <data-table-column
                        label="字段6"
                        field="field6"
                        width="100px"
                        :title="false">
                        <template slot-scope="{row, column}">
                            <span :title="row[column.field]">{{row[column.field]}}</span>
                        </template>
                    </data-table-column>
                    <data-table-column
                        label="字段7"
                        field="field7"
                        width="100px">
                    </data-table-column>
                    <data-table-column
                        label="字段8"
                        field="field8"
                        width="100px"
                        fixed="right">
                    </data-table-column>
                </data-table-column>
            </data-table>
        </section>
        <section>
            <h1>多级表头</h1>
            <veui-checkbox v-model="checked">Checked: {{ checked }}</veui-checkbox>
            <data-table
                class="data-table-demo"
                :data="data"
                :highlight-hover-row="true"
                :show-footer="true"
                :pagination="pagination"
                >
                <data-table-column
                    label="ID1"
                    field="id"
                    className="id-column"
                    width="150px"
                    fixed>
                </data-table-column>
                <data-table-column label="详细信息1">
                    <span slot="header">自定义表头❓</span>
                    <data-table-column
                        label="姓名1"
                        field="name"
                        width="100px"
                        v-if="checked">
                        <template slot-scope="{row, column}">
                            <span style="color: blue;">{{row[column.field]}}</span>
                        </template>
                    </data-table-column>
                    <data-table-column
                        label="年龄1"
                        field="age"
                        width="100px"
                        :display="false">
                    </data-table-column>
                    <data-table-column
                        label="地址1"
                        field="address"
                        width="300px">
                        <data-table-column
                            label="省份1"
                            field="age"
                            width="150px"
                            :display="false">
                        </data-table-column>
                        <data-table-column
                            label="市区1"
                            field="age"
                            width="100px">
                        </data-table-column>
                    </data-table-column>
                </data-table-column>
                <data-table-column
                    label="描述1"
                    field="desc"
                    width="150px"
                    v-if="checked"
                    fixed="right">
                </data-table-column>
            </data-table>
        </section>
        <section>
            <h1>基础表格</h1>
            <data-table
                :data="data"
                :highlight-hover-row="true"
                :show-footer="false"
                :pagination="pagination"
                >
                <data-table-column
                    label="ID"
                    field="id"
                    className="id-column"
                    width="100px"
                    fixed="left">
                </data-table-column>
                <data-table-column
                    label="姓名"
                    field="name"
                    width="100px"
                    v-if="checked"
                    fixed>
                </data-table-column>
                <data-table-column
                    label="年龄"
                    field="age"
                    v-if="checked"
                    width="100px">
                </data-table-column>
                <data-table-column
                    label="地址"
                    field="address"
                    width="200px">
                </data-table-column>
                <data-table-column
                    label="描述"
                    field="desc"
                    width="100px"
                    fixed="right">
                </data-table-column>
            </data-table>
        </section>
        <section style="marginTop: 50px;">
            <h1>单元格合并merge=function(){}</h1>
            <data-table
                :data="mergeFunctionData"
                class="data-table-demo"
                :highlight-hover-row="true"
                :show-footer="false"
                :merge="mergeMethod"
                row-key="id"
                >
                <data-table-column
                    label="ID"
                    field="id"
                    className="id-column"
                    width="150px"
                    fixed="left">
                </data-table-column>
                <data-table-column
                    label="姓名"
                    field="name"
                    width="100px">
                </data-table-column>
                <data-table-column
                    label="年龄"
                    field="age"
                    width="200px">
                    <template slot-scope="{row, column}">
                        <span style="color: red;">{{row[column.field]}}</span>
                    </template>
                </data-table-column>
                <data-table-column
                    label="地址"
                    field="address"
                    width="150px"
                    fixed="right">
                </data-table-column>
                <data-table-column
                    label="描述"
                    field="desc"
                    width="150px"
                    fixed="right">
                </data-table-column>
            </data-table>
            <data-table
                :data="mergeFunctionData"
                class="data-table-demo"
                :highlight-hover-row="true"
                :show-footer="false"
                :merge="mergeRowMethod"
                row-key="id"
                style="marginTop: 20px;"
                >
                <data-table-column
                    label="ID"
                    field="id"
                    className="id-column"
                    width="150px"
                    fixed="left">
                </data-table-column>
                <data-table-column
                    label="姓名"
                    field="name"
                    width="100px"
                    fixed>
                </data-table-column>
                <data-table-column
                    label="年龄"
                    field="age"
                    width="200px">
                    <template slot-scope="{row, column}">
                        <span style="color: red;">{{row[column.field]}}</span>
                    </template>
                </data-table-column>
                <data-table-column
                    label="地址"
                    field="address"
                    width="300px">
                </data-table-column>
                <data-table-column
                    label="描述"
                    field="desc"
                    width="150px"
                    fixed="right">
                </data-table-column>
            </data-table>
        </section>
        <section style="marginTop: 50px;">
            <h1>单元格合并merge="children"</h1>
            <data-table
                :data="mergeData"
                :show-footer="false"
                merge="children"
                row-key="id"
                style="{width: 800px}"
                >
                <data-table-column
                    label="ID"
                    field="id"
                    className="id-column"
                    width="100px"
                    fixed="left">
                </data-table-column>
                <data-table-column
                    label="姓名"
                    field="name"
                    width="100px"
                    fixed>
                </data-table-column>
                <data-table-column
                    label="年龄"
                    field="age"
                    child
                    width="100px">
                    <template slot-scope="{row, column}">
                        <span style="color: red;">{{row[column.field]}}</span>
                    </template>
                </data-table-column>
                <data-table-column
                    label="地址"
                    field="address"
                    child
                    width="300px">
                </data-table-column>
                <data-table-column
                    label="描述"
                    field="desc"
                    width="150px">
                </data-table-column>
            </data-table>
        </section>
        <section style="marginTop: 50px;">
            <h1>复选行</h1>
            <p>
                <span>父组件修改selected：<veui-button ui="primary link small" @click="add">添加</veui-button></span>
                <span>rowKey={{rowKey}},selected={{ids}}</span>
            </p>
            <data-table
                :data="data"
                class="data-table-demo"
                :highlight-hover-row="false"
                :show-footer="true"
                :selected.sync="ids"
                :row-key="rowKey"
                >
                <data-table-column
                    type="multiple"
                    width="50px"
                    fixed="left">
                    <template slot="header" slot-scope="{row, column}">
                        <span>全选</span>
                    </template>
                    <template slot-scope="{row, column}">
                        <span>复选</span>
                    </template>
                </data-table-column>
                <data-table-column
                    label="ID"
                    field="id"
                    className="id-column"
                    width="150px"
                    fixed="left">
                </data-table-column>
                <data-table-column
                    label="姓名"
                    field="name"
                    width="100px"
                    fixed>
                </data-table-column>
                <data-table-column
                    label="年龄"
                    field="age"
                    width="200px">
                    <template slot-scope="{row, column}">
                        <span style="color: blue;">{{row[column.field]}}</span>
                    </template>
                </data-table-column>
                <data-table-column
                    label="地址"
                    field="address"
                    width="300px">
                </data-table-column>
                <data-table-column
                    label="描述"
                    field="desc"
                    width="150px"
                    fixed="right">
                </data-table-column>
            </data-table>
        </section>
        <section style="marginTop: 50px;">
            <h1>展开收起行</h1>
            <p>已经展开行的id：{{expanded}}</p>
            <data-table
                :data="data"
                class="data-table-demo"
                :highlight-hover-row="true"
                :show-footer="false"
                :expanded.sync="expanded"
                @expand="expandRowCallback"
                >
                <data-table-column
                    type="expand"
                    width="50px"
                    fixed="left">
                    <template slot-scope="{store, row}">
                        <div v-if="showExpandArr.includes(row.id)">
                            <span v-if="expanded.includes(row.id)" @click="expandLine(false, row)">收起</span>
                            <span v-else @click="expandLine(true, row)">展开</span>
                        </div>
                    </template>
                    <template slot-scope="{store, row}" slot="expand">
                        <veui-form :data="row">
                            <veui-fieldset>
                                <veui-field label="展开label-1：" field="id">
                                    <span>{{row.id}}</span>
                                </veui-field>
                                <veui-field label="展开label-2：" field="name">
                                    <span>{{row.name}}</span>
                                </veui-field>
                                <veui-field label="展开label-3：" field="age">
                                    <span>{{row.age}}</span>
                                </veui-field>
                            </veui-fieldset>
                            <veui-fieldset>
                                <veui-field label="展开label-4：" field="address">
                                    <span>{{row.address}}</span>
                                </veui-field>
                                <veui-field label="展开label-5：" field="desc">
                                    <span>{{row.desc}}</span>
                                </veui-field>
                                <veui-field label="展开label-6：" field="desc">
                                    <span>{{row.desc}}</span>
                                </veui-field>
                            </veui-fieldset>
                        </veui-form>
                    </template>
                </data-table-column>
                <data-table-column
                    label="ID"
                    field="id"
                    className="id-column"
                    width="150px"
                    fixed="left">
                </data-table-column>
                <data-table-column
                    label="姓名"
                    field="name"
                    width="100px"
                    fixed>
                </data-table-column>
                <data-table-column
                    label="年龄"
                    field="age"
                    width="200px">
                    <template slot-scope="{row, column}">
                        <span style="color: red;">{{row[column.field]}}</span>
                    </template>
                </data-table-column>
                <data-table-column
                    label="地址"
                    field="address"
                    width="300px">
                </data-table-column>
                <data-table-column
                    label="描述"
                    field="desc"
                    width="150px"
                    fixed="right">
                </data-table-column>
            </data-table>
        </section>
        <section style="marginTop: 50px;">
            <h1>综合示例</h1>
            <data-table
                :data="exampleData"
                class="data-table-demo"
                :highlight-hover-row="true"
                :show-footer="true"
                :selected.sync="exampleIds"
                :expanded.sync="expanded"
                merge="children"
                row-key="date"
                :pagination="pagination"
                >
                <data-table-column
                    type="multiple"
                    width="50px"
                    fixed="left">
                </data-table-column>
                <data-table-column
                    type="expand"
                    width="50px"
                    fixed="left">
                    <template slot-scope="{store, row}" slot="expand">
                        <veui-form :data="row">
                            <veui-fieldset>
                                <veui-field label="日期：" field="date">
                                    <span>{{row.date}}</span>
                                </veui-field>
                                <veui-field label="参加人数：" field="num">
                                    <span>{{row.num}}</span>
                                </veui-field>
                                <veui-field label="赞助商：" field="sponsor">
                                    <span>{{row.sponsor}}</span>
                                </veui-field>
                            </veui-fieldset>
                            <veui-fieldset>
                                <veui-field label="举办地点：" field="address">
                                    <span>{{row.address}}</span>
                                </veui-field>
                                <veui-field label="举办方：" field="host">
                                    <span>{{row.host}}</span>
                                </veui-field>
                                <veui-field label="项目描述：" field="desc">
                                    <span>{{row.desc}}</span>
                                </veui-field>
                            </veui-fieldset>
                        </veui-form>
                    </template>
                </data-table-column>
                <data-table-column
                    label="日期"
                    field="date"
                    className="id-column"
                    width="150px"
                    fixed="left">
                </data-table-column>
                <data-table-column
                    label="项目名称"
                    field="proName"
                    child
                    width="100px"
                    fixed>
                </data-table-column>
                <data-table-column
                    label="申请人"
                    field="applyPerson"
                    child
                    width="200px">
                    <template slot="header" slot-scope="{column}">
                        <span>{{column.label}}❓</span>
                    </template>
                    <template slot-scope="{row, column}">
                        <span style="color: red;">{{row[column.field]}}</span>
                    </template>
                </data-table-column>
                <data-table-column
                    label="申请原因"
                    field="reason"
                    child
                    width="300px">
                </data-table-column>
                <data-table-column
                    label="项目描述"
                    field="proDesc"
                    child
                    width="300px">
                </data-table-column>
                <data-table-column
                    label="项目业绩"
                    field="desc"
                    width="150px"
                    fixed="right">
                </data-table-column>
            </data-table>
        </section>
        <section style="marginTop: 50px;">
            <h1>自定义表尾和空数据内容</h1>
            <data-table
                :data="emptyData"
                class="data-table-demo"
                :show-footer="true"
                >
                <data-table-column
                    label="ID"
                    field="id"
                    className="id-column"
                    width="150px"
                    fixed="left">
                    <template slot="header" slot-scope="{column}">
                        <div>{{column.label}}❓</div>
                    </template>
                </data-table-column>
                <data-table-column
                    label="姓名"
                    field="name"
                    width="100px"
                    fixed>
                </data-table-column>
                <data-table-column
                    label="年龄"
                    field="age"
                    width="200px">
                    <template slot-scope="{row, column}">
                        <span class="test" style="color: red;">{{row[column.field]}}</span>
                    </template>
                </data-table-column>
                <data-table-column
                    label="地址"
                    field="address"
                    width="300px">
                </data-table-column>
                <data-table-column
                    label="描述"
                    field="desc"
                    width="150px"
                    fixed="right">
                </data-table-column>
                <div slot="footer">
                    我是自定义表尾
                </div>
                <div slot="empty" class="empty-text" style="color: red;">
                    我是自定义的空数据显示
                </div>
            </data-table>
        </section>
    </div>
</template>
<script>
import {
    Form,
    Field,
    Fieldset,
    Button,
    Checkbox
} from 'veui';
import {DataTable, DataTableColumn} from 'data-table';
export default {
    name: 'DataTableDemo',
    data() {
        return {
            rowKey: 'id',
            ids: ['01', '02', '03'],
            names: ['测试名字03', '测试名字04', '测试名字05'],
            showExpandArr: ['01', '02', '04', '05', '06'],
            expanded: ['02', '04'],
            expandedNames: ['测试名字01', '测试名字02', '测试名字04'],
            rowKeyItems: [
                {
                    label: 'id',
                    value: 'id'
                },
                {
                    label: 'name',
                    value: 'name'
                }
            ],
            emptyData: [],
            pagination: {
                // 当前页码
                currentPage: 1,
                // 总页数
                totalCount: 100,
                // 每页条数
                pageSize: 10,
                pageSizes: [10, 20, 30]
            },
            exampleIds: ['2018Q4'],
            checked: true,
            treeData: [
                {
                    id: 1,
                    address: '河北省',
                    field1: '100万',
                    field2: '130万',
                    field3: '150万',
                    field4: '200万',
                    field5: '10000',
                    field6: '20000',
                    field7: '30000',
                    field8: '40000',
                    children: [
                        {
                            address: '保定市',
                            show: true,
                            field1: '30万',
                            field2: '40万',
                            field3: '50万',
                            field4: '60万',
                            field5: '2000',
                            field6: '2000',
                            field7: '2000',
                            field8: '2000',
                        },
                        {
                            address: '唐山市',
                            show: true,
                            field1: '30万',
                            field2: '40万',
                            field3: '50万',
                            field4: '60万',
                            field5: '2000',
                            field6: '2000',
                            field7: '2000',
                            field8: '2000',
                        },
                        {
                            address: '衡水市',
                            show: false,
                            field1: '30万',
                            field2: '40万',
                            field3: '50万',
                            field4: '60万',
                            field5: '2000',
                            field6: '2000',
                            field7: '2000',
                            field8: '2000',
                        },
                        {
                            address: '邢台市',
                            show: false,
                            field1: '30万',
                            field2: '40万',
                            field3: '50万',
                            field4: '60万',
                            field5: '2000',
                            field6: '2000',
                            field7: '2000',
                            field8: '2000',
                        }
                    ]
                },
                {
                    id: 2,
                    address: '甘肃省',
                    field1: '100万',
                    field2: '130万',
                    field3: '150万',
                    field4: '200万',
                    field5: '10000',
                    field6: '20000',
                    field7: '30000',
                    field8: '40000',
                    children: [
                        {
                            address: '庆阳市',
                            show: true,
                            field1: '30万',
                            field2: '40万',
                            field3: '50万',
                            field4: '60万',
                            field5: '2000',
                            field6: '2000',
                            field7: '2000',
                            field8: '2000',
                        },
                        {
                            address: '兰州市',
                            show: true,
                            field1: '30万',
                            field2: '40万',
                            field3: '50万',
                            field4: '60万',
                            field5: '2000',
                            field6: '2000',
                            field7: '2000',
                            field8: '2000',
                        },
                        {
                            address: '白银市',
                            show: false,
                            field1: '30万',
                            field2: '40万',
                            field3: '50万',
                            field4: '60万',
                            field5: '2000',
                            field6: '2000',
                            field7: '2000',
                            field8: '2000',
                        },
                        {
                            address: '平凉市',
                            show: false,
                            field1: '30万',
                            field2: '40万',
                            field3: '50万',
                            field4: '60万',
                            field5: '2000',
                            field6: '2000',
                            field7: '2000',
                            field8: '2000',
                        }
                    ]
                }
            ],
            treeData1: []
        };
    },
    components: {
        DataTable,
        DataTableColumn,
        'veui-form': Form,
        'veui-field': Field,
        'veui-fieldset': Fieldset,
        'veui-button': Button,
        'veui-checkbox': Checkbox
    },
    computed: {
        selected: {
            set: function(val) {
                this.ids = val;
            },
            get: function () {
                return this.ids;
            }
        },
        mergeData() {
            let data = [];
            for (let index = 0; index < 2; index++) {
                let details = [];
                for (let detailsIndex = 0; detailsIndex < 4; detailsIndex++) {
                    let lineClass = '';
                    if (detailsIndex === 3) {
                        lineClass = 'color-line';
                    }
                    details.push({
                        name: `俄云花${index}-${detailsIndex}`,
                        age: `27`,
                        address: `北京市海淀区上地街道百度大厦`,
                        desc: `描述长一点啦好不好呀${index}-${detailsIndex}`,
                        className: lineClass
                    })
                }
                data.push({
                    id: `${index}`,
                    name: `俄云花${index}`,
                    age: '27',
                    address: `北京市海淀区上地街道百度大厦`,
                    desc: `我是描述，可以随便写，写长一点啦`,
                    children: details
                });
            }
            return data;
        },
        exampleData() {
            return [
                {
                    date: '2018Q1',
                    num: '127万',
                    desc: '第一季度项目业务非常不错',
                    address: '北京国家会议中心',
                    sponsor: '伊利、爱奇艺、腾讯视频、vivo',
                    host: '中国',
                    className: 'a',
                    children: [
                        {
                            proName: '项目名称001',
                            applyPerson: '张三',
                            reason: '申请原因',
                            proDesc: '项目描述很长很长很长很长很长',
                            className: 'b'
                        },
                        {
                            proName: '项目名称002',
                            applyPerson: '李四',
                            reason: '申请原因',
                            proDesc: '项目描述很长很长很长很长很长'
                        },
                        {
                            proName: '项目名称003',
                            applyPerson: '李四',
                            reason: '申请原因',
                            proDesc: '项目描述很长很长很长很长很长'
                        }
                    ]
                },
                {
                    date: '2018Q2',
                    num: '135万',
                    desc: '第二季度项目业务非常不错',
                    address: '北京国家会议中心',
                    sponsor: '伊利、爱奇艺、腾讯视频、vivo',
                    host: '中国',
                    className: 'c',
                    children: [
                        {
                            proName: '项目名称004',
                            applyPerson: '张三',
                            reason: '申请原因',
                            proDesc: '项目描述很长很长很长很长很长'
                        },
                        {
                            proName: '项目名称005',
                            applyPerson: '李四',
                            reason: '申请原因',
                            proDesc: '项目描述很长很长很长很长很长'
                        }
                    ]
                },
                {
                    date: '2018Q3',
                    num: '101万',
                    desc: '第三季度项目业务非常不错',
                    address: '北京国家会议中心',
                    sponsor: '伊利、爱奇艺、腾讯视频、vivo',
                    host: '中国',
                    children: [
                        {
                            proName: '项目名称006',
                            applyPerson: '张三',
                            reason: '申请原因',
                            proDesc: '项目描述很长很长很长很长很长'
                        },
                        {
                            proName: '项目名称007',
                            applyPerson: '李四',
                            reason: '申请原因',
                            proDesc: '项目描述很长很长很长很长很长'
                        },
                        {
                            proName: '项目名称008',
                            applyPerson: '李四',
                            reason: '申请原因',
                            proDesc: '项目描述很长很长很长很长很长'
                        },
                        {
                            proName: '项目名称009',
                            applyPerson: '李四',
                            reason: '申请原因',
                            proDesc: '项目描述很长很长很长很长很长'
                        }
                    ]
                },
                {
                    date: '2018Q4',
                    num: '240万',
                    desc: '第四季度项目业务非常不错',
                    address: '北京国家会议中心',
                    sponsor: '伊利、爱奇艺、腾讯视频、vivo',
                    host: '中国',
                    children: [
                        {
                            proName: '项目名称010',
                            applyPerson: '张三',
                            reason: '申请原因',
                            proDesc: '项目描述很长很长很长很长很长'
                        }
                    ]
                }
            ];
        },
        mergeFunctionData() {
            let data = [];
            for (let index = 0; index < 10; index++) {
                for (let j = 0; j < 3; j++) {
                    data.push({
                        id: `id-${index}`,
                        name: `测试名字${index}--${j}`,
                        age: `测试年龄${index}--${j}`,
                        address: `北京市海淀区上地街道${index}--${j}`,
                        desc: `描述长一点啦好不好呀${index}--${j}`
                    });   
                }
            }
            return data;
        },
        data() {
            let data = [];
            for (let index = 0; index < 10; index++) {
                data.push({
                    id: `0${index}`,
                    name: `测试名字0${index}`,
                    age: '测试年龄21',
                    address: `北京市海淀区上地街道${index}`,
                    desc: `描述长一点啦好不好呀${index}`
                });
            }
            return data;
        }
    },
    watch: {
        'pagination.currentPage'(val, oldVal) {
            this.currentPageChange(val);
        },
        'pagination.pageSize'(val, oldVal) {
            this.pageSizeChange(val);
        }
    },
    created() {
        let arr = _.cloneDeep(this.treeData);
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].children && arr[i].children.length > 0) {
                this.$set(arr[i], 'level', 1);
                let arr1 = [];
                arr[i].children.forEach((a, b) => {
                    this.$set(a, 'level', 2);
                    a.parentId = arr[i].id;
                    if (a.show) {
                        arr1.push(a);
                    }
                });
                arr.splice(i + 1, 0, ...arr1);
            }
        }
        this.treeData1 = arr;
    },
    methods: {
        expandedPro(row, rowIndex, type) {
            if (type) { // 展开
                row.expanded = true;
                let arr = [];
                row.children.forEach(item => {
                    if (!item.show) {
                        arr.push(item);
                    }
                });
                this.treeData1.splice(rowIndex + 1, 0, ...arr);
            } else {
                row.expanded = false;
                for (let i = 0; i < this.treeData1.length; i++) {
                    if (this.treeData1[i].parentId === row.id && !this.treeData1.show) {
                        this.treeData1.splice(i, 1);
                    }
                }
            }
        },
        add() {
            if (!this.ids.includes('04')) {
                this.ids.push('04');
            }
        },
        mergeMethod(row, rowIndex, column, columnIndex) {
            if (columnIndex === 0 || columnIndex === 4) {
                if (rowIndex % 3 === 0) {
                    return {
                        rowspan: 3,
                        colspan: 1
                    };
                } else {
                    return {
                        rowspan: 0,
                        colspan: 1
                    };
                }
            } else {
                return {
                        rowspan: 1,
                        colspan: 1
                    };
            }
        },
        mergeRowMethod(row, rowIndex, column, columnIndex) {
            if (rowIndex % 2 === 0) {
                if (columnIndex === 0) {
                    return {
                        rowspan: 1, 
                        colspan: 3
                    };
                } else if (columnIndex === 1 || columnIndex === 2) {
                    return {
                        rowspan: 1,
                        colspan: 0
                    }
                } else {
                    return {
                        rowspan: 1,
                        colspan: 1
                    };
                }
            } else {
                return {
                    rowspan: 1,
                    colspan: 1
                };
            }
        },
        pageSizeChange(size) {
            console.log(size, 'pageSizeChange');
        },
        currentPageChange(currentPage) {
            console.log(currentPage, 'currentPageChange');
        },
        expandLine(expanded, item) {
            if (expanded) {
                if (!this.expanded.includes(item.id)) {
                    this.expanded.push(item.id);
                }
            } else {
                this.expanded = this.expanded.filter(e => {
                    return e !== item.id;
                });
            }
        },
        expandRowCallback(param) {
            console.log(param, 'param_expand');
        }
    }
}
</script>
<style lang="less">
.color-line {
    background: #FAFAFA;
}
.more-heade-table {
    th {
        border: 1px solid #e5e5e5;
    }
}
.data-table.data-table-demo {
    width: 700px;
    height: 400px;
}
.data-table.data-table-demo2 {
    width: 400px;
    height: 300px;
}
.veui-form {
    .veui-fieldset, .veui-field {
        margin-bottom: 0 !important;
    }
    .veui-fieldset {
        display: flex;
        width: 100%;
        .veui-field {
            flex: 1;
            display: inline-flex;
            align-items: center;
        }
    }
}
.test-table {
    // border-collapse: collapse;
    border-spacing: 1px;
    border-collapse: separate;
    tr {
        th {
            height: 39px;
            // border-right: 1px solid red;
            // border-bottom: 1px solid red;
            border: 1px solid red;
        }
        &:last-child {
            th {
                // border-bottom: 0 none;
            }
        }
    }
}
td.address-column {
    .cell {
        text-align: left;
    }
}
</style>
