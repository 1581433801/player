// 看点列表
export type PointsType = {
  keypointList: Array<PointItem>
  reason: string
  title: string
  url: string
}
// 单个看点
export type PointItem = {
  endTime: number
  name: string
  startTime: number
}
