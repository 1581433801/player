// 看点列表
export type PointsType = {
  keypoints: Array<PointItem>
  status: string
  title: string
  mediaUrl: string
}
// 单个看点
export type PointItem = {
  type: string
  description: string
  timestamps?: {
    start: number
    end: number
  }
  url: string
}
