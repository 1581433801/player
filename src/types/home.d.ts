// 看点列表
export type PointsType = {
  keypoints: Array<PointItem>
  status: string
  title: string
  videoBaseUrl: string
}
// 单个看点
export type PointItem = {
  videoId: string
  pointId: string
  type: string
  description: string
  timestamps?: {
    start: number
    end: number
  }
  url?: string
}
