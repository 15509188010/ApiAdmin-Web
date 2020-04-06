import axios from '@/libs/api.request'

/**
 * 获取课题组数据
 * @returns {wx.RequestTask | never}
 */
export const getList = (params) => {
  return axios.request({
    url: 'Topic/index',
    method: 'get',
    params: params
  })
}

/**
 * 创建课题
 * @param data
 * @returns {wx.RequestTask | never}
 */
export const add = (data) => {
  return axios.request({
    url: 'topic/add',
    method: 'post',
    data
  })
}

/**
 * 指导老师我的选题
 */
export const myList = (params) => {
  return axios.request({
    url: 'topic/myList',
    method: 'get',
    params: params
  })
}

/**
 * 指导老师开启/禁用课题
 */
export const updateEnableStatus = (enableStatus, id) => {
  return axios.request({
    url: 'Topic/updateEnableStatus',
    method: 'get',
    params: {
      enableStatus: enableStatus,
      id: id
    }
  })
}

/**
 * 指导老师编辑课题
 * @param data
 * @returns {wx.RequestTask | never}
 */
export const edit = (data) => {
  return axios.request({
    url: 'Topic/editTopic',
    method: 'post',
    data
  })
}

/**
 * 指导老师删除课题
 * @param status
 * @param id
 * @returns {wx.RequestTask | never}
 */
export const del = (id) => {
  return axios.request({
    url: 'Topic/del',
    method: 'get',
    params: {
      id: id
    }
  })
}
