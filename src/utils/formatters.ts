// src/utils/formatters.ts
// 游戏数据格式化工具函数

/**
 * 构建视频URL - 将tableId附加到tableVideo参数
 * @param baseVideoUrl 基础视频URL
 * @param tableId 台桌ID
 * @returns 构建后的视频URL
 */
export function buildVideoUrl(baseVideoUrl: string, tableId: string | number): string {
  try {
    const url = new URL(baseVideoUrl)
    const tableVideo = url.searchParams.get('tableVideo')

    if (tableVideo) {
      const newTableVideo = tableVideo + tableId
      url.searchParams.set('tableVideo', newTableVideo)
      return url.toString()
    }

    return baseVideoUrl
  } catch (error) {
    console.error('构建视频URL时出错:', error)
    return baseVideoUrl
  }
}

/**
 * 基于API数据格式化局号
 * 格式：T + tableId(2位) + 日期(6位YYMMDD) + 靴号(3位) + 铺号(3位)
 * 示例：T01250706001002
 * @param tableInfo API返回的台桌信息
 * @returns 格式化后的局号
 */
export function formatGameNumberFromApi(tableInfo: any): string {
  try {
    // 1. 获取 tableId
    const tableId = tableInfo?.id || '01'

    // 2. 获取当前日期 (YYMMDD)
    const now = new Date()
    const year = now.getFullYear().toString().slice(-2)
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    const dateStr = year + month + day

    // 3. 获取靴号 (从API数据中提取)
    const shoeNumber = tableInfo?.num_xue || '001'

    // 4. 获取铺号 (从API数据中提取)
    const dealNumber = tableInfo?.num_pu || '001'

    // 5. 格式化各部分
    const formattedTableId = String(tableId).replace(/^T/i, '').padStart(2, '0')
    const formattedShoe = String(shoeNumber).padStart(3, '0')
    const formattedDeal = String(dealNumber).padStart(3, '0')

    // 6. 拼接最终局号
    const formattedGameNumber = `T${formattedTableId}${dateStr}${formattedShoe}${formattedDeal}`

    return formattedGameNumber

  } catch (error) {
    console.error('❌ 格式化局号失败:', error)
    return `T01`
  }
}

/**
 * 格式化时间为 YYMMDD 格式
 * @param date 日期对象，默认为当前日期
 * @returns YYMMDD 格式的日期字符串
 */
export function formatDateToYYMMDD(date: Date = new Date()): string {
  const year = date.getFullYear().toString().slice(-2)
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return year + month + day
}

/**
 * 简化的金额显示 - 仅返回数字
 * @param amount 金额
 * @returns 纯数字字符串
 */
export function formatCurrency(amount: number, decimals: number = 0): string {
  return amount.toString()
}

/**
 * 格式化倍率显示
 * @param odds 倍率字符串，如 "1:8" 或 "1:11"
 * @returns 格式化后的倍率显示
 */
export function formatOdds(odds: string): string {
  // 处理复合倍率，如 "1:1/0.95" 或 "1:12/20"
  if (odds.includes('/')) {
    const parts = odds.split('/')
    return `${parts[0]}/${parts[1]}`
  }
  return odds
}

/**
 * 格式化时间戳为可读时间
 * @param timestamp 时间戳（毫秒）
 * @param format 格式类型
 * @returns 格式化后的时间字符串
 */
export function formatTimestamp(
  timestamp: number,
  format: 'datetime' | 'time' | 'date' = 'datetime'
): string {
  const date = new Date(timestamp)

  switch (format) {
    case 'date':
      return date.toLocaleDateString('zh-CN')
    case 'time':
      return date.toLocaleTimeString('zh-CN')
    case 'datetime':
    default:
      return date.toLocaleString('zh-CN')
  }
}

/**
 * 格式化游戏状态显示
 * @param status 游戏状态
 * @returns 中文状态显示
 */
export function formatGameStatus(status: string): string {
  const statusMap: Record<string, string> = {
    'betting': '投注中',
    'dealing': '开牌中',
    'waiting': '等待中',
    'settling': '结算中',
    'maintenance': '维护中'
  }
  return statusMap[status] || status
}

/**
 * 格式化投注结果状态
 * @param status 投注结果状态
 * @returns 中文状态显示
 */
export function formatBetStatus(status: string): string {
  const statusMap: Record<string, string> = {
    'win': '已中奖',
    'lose': '未中奖',
    'pending': '进行中',
    'cancelled': '已取消',
    'settled': '已结算'
  }
  return statusMap[status] || status
}

/**
 * 格式化百分比显示
 * @param value 数值（0-1之间或0-100之间）
 * @param decimals 小数位数
 * @param isPercentage 输入值是否已经是百分比格式（0-100）
 * @returns 格式化后的百分比字符串
 */
export function formatPercentage(
  value: number,
  decimals: number = 1,
  isPercentage: boolean = false
): string {
  const percentage = isPercentage ? value : value * 100
  return `${percentage.toFixed(decimals)}%`
}
