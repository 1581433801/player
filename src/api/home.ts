import { request } from '@/utils/request'
import type { PointsType } from '@/types/home'
// 获取看点列表
export const getPointList = () => request<PointsType>('/point')
