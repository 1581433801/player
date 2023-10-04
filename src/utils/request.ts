import axios, { AxiosError } from 'axios'
// import { showToast } from 'vant'
import type { Method } from 'axios'

export const baseURL = 'http://127.0.0.1:3006/'
const instance = axios.create({
  // TODO 1. 基础地址，超时时间
  baseURL,
  timeout: 10000
})

instance.interceptors.request.use(
  (config) => {
    return config
  },
  (err) => Promise.reject(err)
)

instance.interceptors.response.use(
  (res) => {
    // TODO 3. 处理业务失败
    if (!(res.data?.reason === 'success!')) {
      return Promise.reject(res.data)
    }
    // TODO 4. 摘取核心响应数据
    return res.data
  },
  (err: AxiosError) => {
    return Promise.reject(err)
  }
)
export default instance

export const request = <T>(
  url: string,
  method: Method = 'GET',
  submitData?: object
) => {
  return instance.request<any, T>({
    url,
    method,
    [method.toUpperCase() === 'GET' ? 'params' : 'data']: submitData
  })
}
