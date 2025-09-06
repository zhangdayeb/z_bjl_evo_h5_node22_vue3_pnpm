// src/utils/validationUtils.ts
// 验证工具函数

/**
 * 验证数字是否有效
 */
export function isValidNumber(value: any): boolean {
  return typeof value === 'number' && !isNaN(value) && isFinite(value)
}

/**
 * 验证金额是否有效（大于等于0）
 */
export function isValidAmount(amount: any): boolean {
  return isValidNumber(amount) && amount >= 0
}

/**
 * 验证正数
 */
export function isPositiveNumber(value: any): boolean {
  return isValidNumber(value) && value > 0
}

/**
 * 验证字符串是否非空
 */
export function isNonEmptyString(value: any): boolean {
  return typeof value === 'string' && value.trim().length > 0
}

/**
 * 验证数组是否非空
 */
export function isNonEmptyArray(value: any): boolean {
  return Array.isArray(value) && value.length > 0
}

/**
 * 验证对象是否非空
 */
export function isNonEmptyObject(value: any): boolean {
  return typeof value === 'object' && value !== null && Object.keys(value).length > 0
}

/**
 * 验证用户ID格式
 */
export function isValidUserId(userId: any): boolean {
  return isNonEmptyString(userId) || (isValidNumber(userId) && userId > 0)
}

/**
 * 验证台桌ID格式
 */
export function isValidTableId(tableId: any): boolean {
  return isNonEmptyString(tableId) || (isValidNumber(tableId) && tableId > 0)
}

/**
 * 验证游戏类型
 */
export function isValidGameType(gameType: any): boolean {
  return isValidNumber(gameType) && gameType > 0
}

/**
 * 验证Token格式
 */
export function isValidToken(token: any): boolean {
  return isNonEmptyString(token) && token.length >= 10
}

/**
 * 验证赔率ID
 */
export function isValidRateId(rateId: any): boolean {
  return isValidNumber(rateId) && rateId > 0 && Number.isInteger(rateId)
}

/**
 * 验证倒计时值
 */
export function isValidCountdown(countdown: any): boolean {
  return isValidNumber(countdown) && countdown >= 0 && countdown <= 3600 // 最大1小时
}

/**
 * 验证余额
 */
export function isValidBalance(balance: any): boolean {
  return isValidAmount(balance)
}

/**
 * 验证投注金额范围
 */
export function isValidBetAmount(amount: any, min: number = 0, max: number = Infinity): boolean {
  return isValidAmount(amount) && amount >= min && amount <= max
}

/**
 * 验证限红配置
 */
export function isValidBetLimit(limit: any): boolean {
  return (
    typeof limit === 'object' &&
    limit !== null &&
    isValidAmount(limit.min) &&
    isValidAmount(limit.max) &&
    limit.min <= limit.max
  )
}

/**
 * 验证筹码值
 */
export function isValidChipValue(value: any): boolean {
  const validChipValues = [
    1, 5, 10, 20, 50, 100, 500, 1000, 5000, 10000, 20000, 50000,
    100000, 200000, 1000000, 5000000, 10000000, 20000000, 50000000,
    100000000, 200000000, 500000000, 1000000000
  ]

  return isValidNumber(value) && validChipValues.includes(value)
}

/**
 * 验证URL格式
 */
export function isValidUrl(url: any): boolean {
  if (!isNonEmptyString(url)) return false

  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * 验证日期格式 YYYY-MM-DD
 */
export function isValidDateString(dateString: any): boolean {
  if (!isNonEmptyString(dateString)) return false

  const datePattern = /^\d{4}-\d{2}-\d{2}$/
  if (!datePattern.test(dateString)) return false

  const date = new Date(dateString)
  return date instanceof Date && !isNaN(date.getTime())
}

/**
 * 验证时间戳
 */
export function isValidTimestamp(timestamp: any): boolean {
  return isValidNumber(timestamp) && timestamp > 0 && timestamp <= Date.now() + 86400000 // 允许未来24小时
}

/**
 * 验证邮箱格式
 */
export function isValidEmail(email: any): boolean {
  if (!isNonEmptyString(email)) return false

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailPattern.test(email)
}

/**
 * 验证手机号格式（中国大陆）
 */
export function isValidPhoneNumber(phone: any): boolean {
  if (!isNonEmptyString(phone)) return false

  const phonePattern = /^1[3-9]\d{9}$/
  return phonePattern.test(phone)
}

/**
 * 验证密码强度
 */
export function isValidPassword(password: any): boolean {
  if (!isNonEmptyString(password)) return false

  // 至少8位，包含字母和数字
  const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/
  return passwordPattern.test(password)
}

/**
 * 验证IP地址格式
 */
export function isValidIPAddress(ip: any): boolean {
  if (!isNonEmptyString(ip)) return false

  const ipPattern = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
  return ipPattern.test(ip)
}

/**
 * 验证百分比值 (0-100)
 */
export function isValidPercentage(value: any): boolean {
  return isValidNumber(value) && value >= 0 && value <= 100
}

/**
 * 验证颜色值（十六进制）
 */
export function isValidHexColor(color: any): boolean {
  if (!isNonEmptyString(color)) return false

  const hexPattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
  return hexPattern.test(color)
}

/**
 * 验证音频文件扩展名
 */
export function isValidAudioFile(filename: any): boolean {
  if (!isNonEmptyString(filename)) return false

  const audioExtensions = ['.mp3', '.wav', '.ogg', '.m4a', '.aac']
  return audioExtensions.some(ext => filename.toLowerCase().endsWith(ext))
}

/**
 * 验证图片文件扩展名
 */
export function isValidImageFile(filename: any): boolean {
  if (!isNonEmptyString(filename)) return false

  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg']
  return imageExtensions.some(ext => filename.toLowerCase().endsWith(ext))
}

/**
 * 综合验证游戏参数
 */
export function validateGameParams(params: any): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (!isValidUserId(params?.user_id)) {
    errors.push('用户ID格式无效')
  }

  if (!isValidTableId(params?.table_id)) {
    errors.push('台桌ID格式无效')
  }

  if (!isValidGameType(params?.game_type)) {
    errors.push('游戏类型格式无效')
  }

  if (!isValidToken(params?.token)) {
    errors.push('Token格式无效')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * 验证API响应数据结构
 */
export function validateApiResponse(response: any): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (!response) {
    errors.push('响应数据为空')
    return { isValid: false, errors }
  }

  if (typeof response !== 'object') {
    errors.push('响应数据格式错误')
    return { isValid: false, errors }
  }

  // 可以根据具体API响应格式添加更多验证

  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * 数据清理：移除对象中的空值
 */
export function removeEmptyValues(obj: Record<string, any>): Record<string, any> {
  const cleaned: Record<string, any> = {}

  Object.entries(obj).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      cleaned[key] = value
    }
  })

  return cleaned
}

/**
 * 数据清理：确保数字类型
 */
export function ensureNumber(value: any, defaultValue: number = 0): number {
  if (isValidNumber(value)) return value
  // 🔥 关键修复：如果是字符串，先移除千分位分隔符
  if (typeof value === 'string') {
    // 移除逗号和空格
    const cleaned = value.replace(/[,\s]/g, '')
    const parsed = parseFloat(cleaned)
    return isValidNumber(parsed) ? parsed : defaultValue
  }

  const parsed = parseFloat(value)
  return isValidNumber(parsed) ? parsed : defaultValue
}


/**
 * 数据清理：确保字符串类型
 */
export function ensureString(value: any, defaultValue: string = ''): string {
  return typeof value === 'string' ? value : String(value || defaultValue)
}

/**
 * 数据清理：确保布尔类型
 */
export function ensureBoolean(value: any, defaultValue: boolean = false): boolean {
  if (typeof value === 'boolean') return value
  if (typeof value === 'string') return value.toLowerCase() === 'true'
  if (typeof value === 'number') return value !== 0
  return defaultValue
}
