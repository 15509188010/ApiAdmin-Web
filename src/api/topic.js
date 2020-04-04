import axios from '@/libs/api.request';

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
};
