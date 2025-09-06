// src/services/gameApi.ts
// 极简版百家乐游戏 API 服务 - 只保留4个核心功能 + 新增统计接口

import { httpClient, setAuthToken } from './httpClient'

// 游戏参数接口
interface GameParams {
  table_id: string
  game_type: string
  user_id: string
  token: string
}

// 1. 台桌信息接口 - 基于数据库 ntp_dianji_table 表 + 新增字段
export interface TableInfo {
  // 基础信息
  id: number
  status: number                           // 台桌状态
  run_status: number                       // 运行状态 1投注 2开牌 3洗牌等
  start_time: number                       // 当前局倒计时开始时间
  create_time: string                      // 创建时间
  update_time: string                      // 更新时间

  // 视频信息
  video_near: string                       // 近景视频地址
  video_far: string                        // 远景视频地址

  // 台桌信息
  table_title: string                      // 台桌名字
  table_describe: string                   // 台桌描述
  lu_zhu_name: string                      // 露珠台桌名称

  // 荷官信息
  he_guan_head_img: string                 // 荷官头像
  he_guan_name: string                     // 荷官名称
  he_guan_describe: string                 // 荷官描述

  // 游戏配置
  game_type: number                        // 游戏类型 3=百家乐
  countdown_time: number                   // 倒计时时间
  list_order: number                       // 显示排序
  wash_status: number                      // 洗牌状态 1在洗牌

  // 限红配置 - 字符串格式
  xian_hong_zhuang_xian_usd: string        // 限红庄闲美金
  xian_hong_zhuang_xian_cny: string        // 限红庄闲人民币
  xian_hong_he_usd: string                 // 限红和美金
  xian_hong_he_cny: string                 // 限红和人民币
  xian_hong_duizi_usd: string              // 限红对子美金
  xian_hong_duizi_cny: string              // 限红对子人民币
  xian_hong_lucky6_cny: string             // 限红幸运6RMB
  xian_hong_lucky6_usd: string             // 限红幸运6美金

  // 限红配置 - 数字格式
  bjl_xian_hong_xian_max: number           // 闲最大限红
  bjl_xian_hong_xian_min: number           // 闲最小限红
  bjl_xian_hong_zhuang_max: number         // 庄最大限红
  bjl_xian_hong_zhuang_min: number         // 庄最小限红
  bjl_xian_hong_he_max: number             // 和最大限红
  bjl_xian_hong_he_min: number             // 和最小限红
  bjl_xian_hong_zhuang_dui_max: number     // 庄对最大限红
  bjl_xian_hong_zhuang_dui_min: number     // 庄对最小限红
  bjl_xian_hong_xian_dui_max: number       // 闲对最大限红
  bjl_xian_hong_xian_dui_min: number       // 闲对最小限红
  bjl_xian_hong_lucky6_max: number         // 幸运6最大限红
  bjl_xian_hong_lucky6_min: number         // 幸运6最小限红

  // 是否开启限红
  is_table_xian_hong: number               // 是否开启台桌限红0不是1是

  // 🔥 当前靴号和铺号
  num_pu: number                           // 当前铺号
  num_xue: number                          // 当前靴号

  // 🔥 新增：客服和财务链接字段
  app_kefu_url: string                     // 客服链接
  app_feiji_url: string                    // 财务链接

  // 🔥 其他控制字段
  is_show_back: number                     // 是否显示返回按钮 1显示 0不显示
  show_luzhu_list: string                  // 显示的路珠列表，如 "1,2,3"
}

// 2. 用户信息接口 - 基于实际返回数据
export interface UserInfo {
  id: number                          // 用户ID
  create_time: string                 // 创建时间
  user_name: string                   // 用户名
  nickname: string                    // 昵称
  type: number                        // 账号类型 1代理 2会员
  vip_grade: number                   // VIP等级
  status: number                      // 账号状态 1正常 0冻结
  state: number                       // 在线状态 1在线 0离线
  money_balance: string               // 可用余额
  money_freeze: string                // 冻结金额
  money_total_recharge: string        // 累计充值
  money_total_withdraw: string        // 累计提现
  money_total_agent: string           // 代理余额
  is_real_name: number                // 是否实名 1已实名 0未实名
  market_uid: number                  // 业务员ID
  is_fictitious: number               // 是否虚拟账号 1是 0否 2试玩
  agent_id_1: number | null           // 上级代理ID
  agent_id_2: number | null           // 上上级代理ID
  agent_id_3: number | null           // 上上上级代理ID
  agent_id: number                    // 代理ID
  agent_rate: string                  // 代理比例
  zhancheng_rate: string | null       // 占成比例
  invitation_code: string             // 邀请码
  phone: string                       // 手机号
  points: number                      // 积分
  remarks: string | null              // 备注
  rebate_balance: string              // 返水余额
  rebate_total: string                // 累计返水
  type_text: string                   // 账号类型文本
  status_text: string                 // 账号状态文本
  state_text: string                  // 在线状态文本
  is_real_name_text: string           // 实名状态文本
  is_fictitious_text: string          // 账号类型文本
}

// 3. 投注历史接口 - 基于标准API格式
export interface BettingHistoryParams {
  user_id: number                          // 用户ID（必填）
  table_id: string                         // 台桌ID（必填）
  game_type: number                        // 游戏类型（必填）
  page: number                             // 页码
  page_size: number                        // 每页大小
  status?: string                          // 状态筛选
  start_date?: string                      // 开始日期
  end_date?: string                        // 结束日期
}

// 🔥 修正：基于实际API返回的标准格式
export interface BettingHistoryRecord {
  id: string
  game_number: number
  table_id: string
  user_id: string
  bet_time: string
  settle_time: string
  bet_details: Array<{
    bet_type: string
    bet_type_name: string
    bet_amount: number
    odds: string
    win_amount: number
    is_win: boolean
    rate_id: number
  }>
  total_bet_amount: number
  total_win_amount: number
  net_amount: number
  status: 'win' | 'lose' | 'pending'
  is_settled: boolean
  currency: string
}

// 🔥 修正：基于实际API返回的标准响应格式
export interface BettingHistoryResponse {
  records: BettingHistoryRecord[]
  pagination: {
    current_page: number
    total_pages: number
    total_records: number
    page_size: number
    has_more: boolean
  }
}

// 4. 投注接口 - 参照原有格式
export interface BetRequest {
  money: number                            // 投注金额
  rate_id: number                          // 赔率ID
}

export interface BetResponse {
  money_balance: number                    // 投注后余额
  money_spend: number                      // 花费金额
  bets: BetRequest[]                       // 投注详情
}

// 🔥 5. 新增：台桌统计接口 - 基于后端 get_table_count 方法
export interface TableStatisticsResponse {
  zhuang: number                           // 庄的次数
  xian: number                             // 闲的次数
  he: number                               // 和的次数
  zhuangDui: number                        // 庄对的次数（包含庄闲对）
  xianDui: number                          // 闲对的次数（包含庄闲对）
  zhuangXianDui: number                    // 庄闲对的次数
}

export class GameApiService {
  private gameParams: GameParams

  constructor(params: GameParams) {
    this.gameParams = params
    setAuthToken(params.token)
  }

  /**
   * 1. 获取台桌信息
   */
  async getTableInfo(): Promise<TableInfo> {
    const response = await httpClient.get<TableInfo>('/bjl/table/info', {
      tableId: this.gameParams.table_id,
      gameType: this.gameParams.game_type
    })
    return response
  }

  /**
   * 2. 获取用户信息
   */
  async getUserInfo(): Promise<UserInfo> {
    const response = await httpClient.get<UserInfo>('/bjl/user/info', {
      user_id: this.gameParams.user_id
    })
    return response
  }

  /**
   * 3. 获取用户历史投注信息
   */
  async getBettingHistory(params: BettingHistoryParams): Promise<BettingHistoryResponse> {
    const requestParams = {
      user_id: params.user_id,                            // 用户ID（必填）
      table_id: params.table_id,                          // 台桌ID（必填）
      game_type: params.game_type,                        // 游戏类型（必填）
      page: params.page,                                  // 页码
      page_size: params.page_size,                        // 每页大小
      status: params.status || '',                        // 状态筛选
      start_date: params.start_date || '',                // 开始日期
      end_date: params.end_date || ''                     // 结束日期
    }

    // 直接返回API原始数据，不做任何转换
    const response = await httpClient.get<BettingHistoryResponse>('/bjl/bet/history', requestParams)

    console.log('📥 投注历史API响应:', response)

    return response
  }

  /**
   * 4. 当局投注 - 只支持批量投注
   */
  async orderBets(bets: BetRequest[],is_exempt:any): Promise<BetResponse> {
    const requestData = {
      table_id: parseInt(this.gameParams.table_id),
      game_type: parseInt(this.gameParams.game_type),
      is_exempt: is_exempt,                                     // 是否免佣
      bet: bets
    }

    const response = await httpClient.post<BetResponse>('/bjl/bet/order', requestData)
    return response
  }

  /**
   * 🔥 5. 新增：获取当前靴的统计信息（庄闲和次数等）
   * 对应后端路由：bjl/get_table/get_table_count
   * 对应后端方法：get_table_count()
   * 自动使用当前台桌信息中的靴号
   */
  async getCurrentShoeStatistics(): Promise<TableStatisticsResponse> {
    try {
      // 先获取台桌信息以获得当前靴号
      const tableInfo = await this.getTableInfo()

      // 构建请求参数，确保包含后端需要的所有必填参数
      const requestParams = {
        tableId: this.gameParams.table_id,               // 台桌ID（必填）
        xue: tableInfo.num_xue,                          // 当前靴号（必填）
        gameType: this.gameParams.game_type              // 游戏类型（必填）
      }

      const response = await httpClient.get<TableStatisticsResponse>('/bjl/get_table/get_table_count', requestParams)

      // 确保返回的数据结构完整
      return {
        zhuang: response.zhuang || 0,
        xian: response.xian || 0,
        he: response.he || 0,
        zhuangDui: response.zhuangDui || 0,
        xianDui: response.xianDui || 0,
        zhuangXianDui: response.zhuangXianDui || 0
      }
    } catch (error) {
      console.error('获取当前靴统计信息失败:', error)
      throw error
    }
  }

  /**
   * 获取当前游戏参数
   */
  getGameParams(): GameParams {
    return { ...this.gameParams }
  }

  /**
   * 更新游戏参数
   */
  updateGameParams(newParams: Partial<GameParams>): void {
    this.gameParams = { ...this.gameParams, ...newParams }
    if (newParams.token) {
      setAuthToken(newParams.token)
    }
  }
}

// 创建API服务实例
export const createGameApiService = (params: GameParams): GameApiService => {
  return new GameApiService(params)
}

// 全局API服务实例
let globalApiService: GameApiService | null = null

export const setGlobalApiService = (service: GameApiService): void => {
  globalApiService = service
}

export const getGlobalApiService = (): GameApiService => {
  if (!globalApiService) {
    throw new Error('API服务未初始化')
  }
  return globalApiService
}

// 快捷初始化方法
export const initializeGameApi = async (params: GameParams) => {
  const apiService = createGameApiService(params)
  setGlobalApiService(apiService)

  const [tableInfo, userInfo] = await Promise.all([
    apiService.getTableInfo(),
    apiService.getUserInfo()
  ])

  return {
    apiService,
    tableInfo,
    userInfo
  }
}
