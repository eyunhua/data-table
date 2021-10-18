> 可悬停列、固定表头表尾的表格

latest version：1.1.7

# Install
You can get it on npm.
```
npm install data-table --save
```
# Usage
```
// 引入
import {DataTable, DataTableColumn} from 'data-table';
// 注册
Vue.component('data-table', DataTable);
Vue.component('data-table-column', DataTableColumn);
```
# Api
## DataTable
### Props
| 名称 | 类型 | 默认值 | 是否必传 | 描述 |
|:----------|:--------------|:-------|:-------|:-------|
| data | Array | -- | true | 显示数据 |
| fixed | Boolean| false | false | 是否固定表头和表尾 |
| rowKey | String | id | false | 当前行的key，属性名 |
| highlightHoverRow | Boolean | false | false | 是否高亮显示hover行 |
| showFooter | Boolean | true | false | 是否显示表尾，可通过slot自定义表尾 |
| pagination | Object | -- | false | 分页对象{currentPage,totalPage,pageSizes,pageSize} |
| merge | String/Function({row,rowIndex,column,columnIndex}) | -- | false | 单元格合并行或列的计算方法 |
| selected.sync | Array | -- | false | 复选时选中的数据，每一项的值为rowKey对应的值 |
| expanded.sync | Array | -- | false | 展开行的数据，每一项的值为rowKey对应的值 |
| isMultiLine | Boolean | false | false | 是否多行显示，超过部分出现省略号 |
### Events
| 事件名 | 描述 | 参数 |
|:----------|:--------------|:--------------|
| scroll | 表格内容滚动事件 | 回调参数为当前event对象 |

### Slots
| 名称 | 描述 |
|:----------|:--------------|
| empty | 数据为空时，表格内容区域的展示 |
| footer | 表尾区域自定义展示内容 |
## DataTableColumn
### Props
| 名称 | 类型 | 默认值 | 是否必传 | 可选值 | 描述 |
|:----------|:--------------|:-------|:-------|:-------|:-------|
| label | String | -- | true | -- | 列标题 |
| field | String | -- | true | -- | 列内容对应的字段名 |
| width | Number/String | -- | true | -- | 列宽 |
| child | Boolean | false | true/false | -- | 是否取嵌套数据 |
| fixed | String/Boolean | true | false | true/left/right | 列固定在左侧或右侧，true表示固定在左侧 |
| className | String/Object | -- | false | -- | 自定义单元格class名 |
| type | String | -- | false | multiple/expand | 列的类型，默认为文本，type设置为multiple显示复选框、expand显示展开按钮 |
| title | Boolean | true | false | -- | 是否显示title属性，值为当前列值 |
| display | Boolean | true | false | -- | 是否显示列 |
### Slots
| 名称 | 描述 |
|:----------|:--------------|
| --(默认) | 自定义列的内容，参数为{row，rowIndex, column，colIndex} |
| header | 自定义表头的内容，参数为{column，colIndex} |
| expand | 自定义展开区域的内容，参数为{row，rowIndex} |

# Demo
```
<data-table
    :data="data"
    class="data-table"
    :highlight-hover-row="true"
    :show-footer="true"
    :pagination="pagination"
    >
    <data-table-column
        label="姓名"
        field="name"
        fixed="left">
    </data-table-column>
    <data-table-column
        label="年龄"
        field="name">
    </data-table-column>
    <data-table-column
        label="操作"
        field="name"
        fixed="right">
    </data-table-column>
</data-table>
```
