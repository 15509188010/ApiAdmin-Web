<style lang="less" scoped>
  @import './list.less';
</style>
<template>
  <div>
    <Row>
      <Col span="24">
        <Card class="margin-bottom-10">
          <Form inline>
            <FormItem class="margin-bottom-0">
              <Select v-model="searchConf.status" clearable placeholder='请选择状态' style="width:120px">
                <Option :value="1">启用</Option>
                <Option :value="0">禁用</Option>
              </Select>
            </FormItem>
            <FormItem class="margin-bottom-0">
              <Select v-model="searchConf.type" clearable placeholder="请选择类别" style="width:120px">
                <Option :value="1">应用组标识</Option>
                <Option :value="2">应用组名称</Option>
              </Select>
            </FormItem>
            <FormItem class="margin-bottom-0">
              <Input v-model="searchConf.keywords" placeholder=""></Input>
            </FormItem>
            <FormItem class="margin-bottom-0">
              <Button type="primary" @click="search">{{ $t('find_button') }}/{{ $t('refresh_button') }}</Button>
            </FormItem>
          </Form>
        </Card>
      </Col>
    </Row>
    <Row>
      <Col span="24">
        <Card>
          <!--增加按钮-->
          <!--<div class="margin-bottom-15">-->
            <!--<Button type="primary" v-has="'AppGroup/add'" @click="alertAdd" icon="md-add">{{ $t('add_button') }}</Button>-->
          <!--</div>-->
          <div>
            <Table :loading="listLoading" :columns="columnsList" :data="tableData" border disabled-hover></Table>
          </div>
          <div class="margin-top-15" style="text-align: center">
            <Page :total="tableShow.listCount" :current="tableShow.currentPage"
                  :page-size="tableShow.pageSize" @on-change="changePage"
                  @on-page-size-change="changeSize" show-elevator show-sizer show-total></Page>
          </div>
        </Card>
      </Col>
    </Row>
    <Modal v-model="modalSetting.show" width="668" :styles="{top: '30px'}" @on-visible-change="doCancel">
      <p slot="header" style="color:#2d8cf0">
        <Icon type="md-alert"></Icon>
        <span>{{formItem.id ? '编辑' : '新增'}}应用组</span>
      </p>
      <Form ref="myForm" :rules="ruleValidate" :model="formItem" :label-width="80">
        <FormItem label="组名称" prop="name">
          <Input v-model="formItem.name" placeholder="请输入应用组名称"></Input>
        </FormItem>
        <FormItem label="组标识" prop="hash">
          <Input style="width: 300px" disabled v-model="formItem.hash"></Input>
          <Tag color="error" class="margin-left-5">系统自动生成，不允许修改</Tag>
        </FormItem>
        <FormItem label="组描述" prop="description">
          <Input v-model="formItem.description" :autosize="{maxRows: 10, minRows: 4}" type="textarea"
                 placeholder="请输入应用组描述"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="cancel" class="margin-right-10">取消</Button>
        <Button type="primary" @click="submit" :loading="modalSetting.loading">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
// import { getList, changeStatus, add, edit, del } from '@/api/topic'
import { getList, add } from '@/api/topic'
import { getHash } from '@/api/interface'

const memberButton = (vm, h, currentRow, index) => {
  if (vm.buttonShow.changeStatus) {
    return h('Button', {
      props: {
        type: 'primary'
      },
      style: {
        margin: '0 5px'
      },
      on: {
        'click': () => {
          vm.memberSetting.show = true
          vm.memberShow.gid = currentRow.id
          vm.getMemberList()
        }
      }
    }, '任务书')
  }
}

const auditButton = (vm, h, currentRow, index) => {
  if (vm.buttonShow.edit) {
    return h('Button', {
      props: {
        type: 'warning'
      },
      style: {
        margin: '0 5px'
      },
      on: {
        'click': () => {
          vm.formItem.id = currentRow.id
          vm.formItem.name = currentRow.name
          vm.formItem.hash = currentRow.hash
          vm.formItem.description = currentRow.description
          vm.modalSetting.show = true
          vm.modalSetting.index = index
        }
      }
    }, vm.$t('audit_button'))
  }
}

const editButton = (vm, h, currentRow, index) => {
  if (vm.buttonShow.edit) {
    return h('Button', {
      props: {
        type: 'primary'
      },
      style: {
        margin: '0 5px'
      },
      on: {
        'click': () => {
          vm.formItem.id = currentRow.id
          vm.formItem.name = currentRow.name
          vm.formItem.hash = currentRow.hash
          vm.formItem.description = currentRow.description
          vm.modalSetting.show = true
          vm.modalSetting.index = index
        }
      }
    }, vm.$t('edit_button'))
  }
}
const deleteButton = (vm, h, currentRow, index) => {
  if (vm.buttonShow.del) {
    return h('Poptip', {
      props: {
        confirm: true,
        title: '您确定要删除这条数据吗? ',
        transfer: true
      },
      on: {
        'on-ok': () => {
          del(currentRow.hash).then(response => {
            vm.tableData.splice(index, 1)
            vm.$Message.success(response.data.msg)
          })
        }
      }
    }, [
      h('Button', {
        style: {
          margin: '0 5px'
        },
        props: {
          type: 'error',
          placement: 'top',
          loading: currentRow.isDeleting
        }
      }, vm.$t('delete_button'))
    ])
  }
}

export default {
  name: 'interface_group',
  data () {
    return {
      columnsList: [
        {
          title: '序号',
          type: 'index',
          width: 65,
          align: 'center'
        },
        {
          title: '课题编号',
          align: 'center',
          key: 'code',
          minWidth: 150
        },
        {
          title: '题目',
          align: 'center',
          key: 'title',
          minWidth: 150
        },
        {
          title: '学院',
          align: 'center',
          key: 'college',
          width: 140
        },
        {
          title: '任务书',
          align: 'center',
          width: 140,
          render: (h, params) => {
            return h('div', [
              memberButton(this, h, params.row, params.index)
            ])
          }
        },
        {
          title: '添加人',
          align: 'center',
          key: 'addPeople',
          width: 120
        },
        {
          title: '审核状态',
          align: 'center',
          width: 100,
          render: (h, params) => {
            if (params.row.auditStatus === 5) {
              return h('Tag', {
                props: {
                  'color': 'green'
                }
              }, '已审核')
            } else {
              return h('Tag', {
                props: {
                  'color': 'red'
                }
              }, '未审核')
            }
          }
        },
        {
          title: '操作',
          align: 'center',
          width: 250,
          render: (h, params) => {
            return h('div', [
              auditButton(this, h, params.role, params.index),
              editButton(this, h, params.row, params.index),
              deleteButton(this, h, params.row, params.index)
            ])
          }
        }
      ],
      tableData: [],
      tableShow: {
        currentPage: 1,
        pageSize: 10,
        listCount: 0
      },
      searchConf: {
        type: '',
        keywords: '',
        status: ''
      },
      modalSetting: {
        show: false,
        loading: false,
        index: 0
      },
      formItem: {
        description: '',
        name: '',
        hash: '',
        id: 0
      },
      ruleValidate: {
        name: [
          { required: true, message: '应用组名称不能为空', trigger: 'blur' }
        ]
      },
      buttonShow: {
        edit: true,
        del: true,
        changeStatus: true
      },
      listLoading: false
    }
  },
  created () {
    let vm = this
    vm.getList()
    vm.hasRule('AppGroup/edit').then(res => {
      vm.buttonShow.edit = res
    })
    vm.hasRule('AppGroup/del').then(res => {
      vm.buttonShow.del = res
    })
    vm.hasRule('AppGroup/changeStatus').then(res => {
      vm.buttonShow.changeStatus = res
    })
  },
  methods: {
    alertAdd () {
      let vm = this
      getHash().then(response => {
        vm.formItem.hash = response.data.data.hash
      })
      vm.modalSetting.show = true
    },
    submit () {
      let vm = this
      vm.$refs['myForm'].validate((valid) => {
        if (valid) {
          vm.modalSetting.loading = true
          if (vm.formItem.id === 0) {
            add(vm.formItem).then(response => {
              vm.$Message.success(response.data.msg)
              vm.getList()
              vm.cancel()
            }).catch(() => {
              vm.modalSetting.loading = false
            })
          } else {
            edit(vm.formItem).then(response => {
              vm.$Message.success(response.data.msg)
              vm.getList()
              vm.cancel()
            }).catch(() => {
              vm.modalSetting.loading = false
            })
          }
        }
      })
    },
    cancel () {
      this.modalSetting.show = false
    },
    changePage (page) {
      this.tableShow.currentPage = page
      this.getList()
    },
    changeSize (size) {
      this.tableShow.pageSize = size
      this.getList()
    },
    search () {
      this.tableShow.currentPage = 1
      this.getList()
    },
    getList () {
      let vm = this
      vm.listLoading = true
      getList({
        page: vm.tableShow.currentPage,
        size: vm.tableShow.pageSize,
        type: vm.searchConf.type,
        keywords: vm.searchConf.keywords,
        status: vm.searchConf.status
      }).then(response => {
        vm.tableData = response.data.data.list
        vm.tableShow.listCount = response.data.data.count
        vm.listLoading = false
      })
    },
    doCancel (data) {
      if (!data) {
        this.formItem.id = 0
        this.$refs['myForm'].resetFields()
        this.modalSetting.loading = false
        this.modalSetting.index = 0
      }
    }
  }
}
</script>
