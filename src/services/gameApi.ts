// src/services/gameApi.ts
/**
 * @fileoverview 百家乐游戏 API 服务
 * @description 提供游戏相关的所有 API 接口调用方法
 * @version 2.0.0 - 添加露珠数据接口
 */

import { httpClient, setAuthToken } from './httpClient'

// ========================= 类型定义 =========================

/**
 * 游戏参数接口
 * @interface GameParams
 * @description 游戏初始化必需的参数
 */
interface GameParams {
  table_id: string      // 台桌ID
  game_type: string     // 游戏类型
  user_id: string       // 用户ID
  token: string         // 认证令牌
}

// ========================= 1. 台桌信息接口 =========================

/**
 * 台桌信息接口
 * @interface TableInfo
 * @description 基于数据库 ntp_dianji_table 表
 */
export interface TableInfo {
  // --------------- 基础信息 ---------------
  id: number                                // 台桌ID
  status: number                            // 台桌状态
  run_status: number                        // 运行状态 1投注 2开牌 3洗牌等
  start_time: number                        // 当前局倒计时开始时间
  create_time: string                       // 创建时间
  update_time: string                       // 更新时间

  // --------------- 视频信息 ---------------
  video_near: string                        // 近景视频地址
  video_far: string                         // 远景视频地址

  // --------------- 台桌信息 ---------------
  table_title: string                       // 台桌名字
  table_describe: string                    // 台桌描述
  lu_zhu_name: string                       // 露珠台桌名称

  // --------------- 荷官信息 ---------------
  he_guan_head_img: string                  // 荷官头像
  he_guan_name: string                      // 荷官名称
  he_guan_describe: string                  // 荷官描述

  // --------------- 游戏配置 ---------------
  game_type: number                         // 游戏类型 3=百家乐
  countdown_time: number                    // 倒计时时间
  list_order: number                        // 显示排序
  wash_status: number                       // 洗牌状态 1在洗牌

  // --------------- 限红配置（字符串格式） ---------------
  xian_hong_zhuang_xian_usd: string         // 限红庄闲美金
  xian_hong_zhuang_xian_cny: string         // 限红庄闲人民币
  xian_hong_he_usd: string                  // 限红和美金
  xian_hong_he_cny: string                  // 限红和人民币
  xian_hong_duizi_usd: string               // 限红对子美金
  xian_hong_duizi_cny: string               // 限红对子人民币
  xian_hong_lucky6_cny: string              // 限红幸运6RMB
  xian_hong_lucky6_usd: string              // 限红幸运6美金

  // --------------- 限红配置（数字格式） ---------------
  bjl_xian_hong_xian_max: number            // 闲最大限红
  bjl_xian_hong_xian_min: number            // 闲最小限红
  bjl_xian_hong_zhuang_max: number          // 庄最大限红
  bjl_xian_hong_zhuang_min: number          // 庄最小限红
  bjl_xian_hong_he_max: number              // 和最大限红
  bjl_xian_hong_he_min: number              // 和最小限红
  bjl_xian_hong_zhuang_dui_max: number      // 庄对最大限红
  bjl_xian_hong_zhuang_dui_min: number      // 庄对最小限红
  bjl_xian_hong_xian_dui_max: number        // 闲对最大限红
  bjl_xian_hong_xian_dui_min: number        // 闲对最小限红
  bjl_xian_hong_lucky6_max: number          // 幸运6最大限红
  bjl_xian_hong_lucky6_min: number          // 幸运6最小限红

  // --------------- 控制开关 ---------------
  is_table_xian_hong: number                // 是否开启台桌限红 0不是 1是

  // --------------- 游戏进度 ---------------
  num_pu: number                             // 当前铺号
  num_xue: number                            // 当前靴号

  // --------------- 外部链接 ---------------
  app_kefu_url: string                       // 客服链接
  app_feiji_url: string                      // 财务链接

  // --------------- 显示控制 ---------------
  is_show_back: number                       // 是否显示返回按钮 1显示 0不显示
  show_luzhu_list: string                    // 显示的路珠列表，如 "1,2,3"
}

// ========================= 2. 用户信息接口 =========================

/**
 * 用户信息接口
 * @interface UserInfo
 * @description 基于实际返回数据的用户完整信息
 */
export interface UserInfo {
  // --------------- 基础信息 ---------------
  id: number                                 // 用户ID
  create_time: string                        // 创建时间
  user_name: string                          // 用户名
  nickname: string                           // 昵称
  phone: string                              // 手机号

  // --------------- 账号状态 ---------------
  type: number                               // 账号类型 1代理 2会员
  vip_grade: number                          // VIP等级
  status: number                             // 账号状态 1正常 0冻结
  state: number                              // 在线状态 1在线 0离线
  is_real_name: number                       // 是否实名 1已实名 0未实名
  is_fictitious: number                      // 是否虚拟账号 1是 0否 2试玩

  // --------------- 资金信息 ---------------
  money_balance: string                      // 可用余额
  money_freeze: string                       // 冻结金额
  money_total_recharge: string               // 累计充值
  money_total_withdraw: string               // 累计提现
  money_total_agent: string                  // 代理余额
  rebate_balance: string                     // 返水余额
  rebate_total: string                       // 累计返水
  points: number                             // 积分

  // --------------- 代理关系 ---------------
  market_uid: number                         // 业务员ID
  agent_id_1: number | null                  // 上级代理ID
  agent_id_2: number | null                  // 上上级代理ID
  agent_id_3: number | null                  // 上上上级代理ID
  agent_id: number                           // 代理ID
  agent_rate: string                         // 代理比例
  zhancheng_rate: string | null              // 占成比例
  invitation_code: string                    // 邀请码

  // --------------- 其他信息 ---------------
  remarks: string | null                     // 备注

  // --------------- 文本描述 ---------------
  type_text: string                          // 账号类型文本
  status_text: string                        // 账号状态文本
  state_text: string                         // 在线状态文本
  is_real_name_text: string                  // 实名状态文本
  is_fictitious_text: string                 // 账号类型文本
}

// ========================= 3. 投注历史接口 =========================

/**
 * 投注历史查询参数
 * @interface BettingHistoryParams
 */
export interface BettingHistoryParams {
  user_id: number                            // 用户ID（必填）
  table_id: string                           // 台桌ID（必填）
  game_type: number                          // 游戏类型（必填）
  page: number                               // 页码
  page_size: number                          // 每页大小
  status?: string                            // 状态筛选
  start_date?: string                        // 开始日期
  end_date?: string                          // 结束日期
}

/**
 * 投注历史记录
 * @interface BettingHistoryRecord
 */
export interface BettingHistoryRecord {
  id: string                                 // 记录ID
  game_number: number                        // 游戏局号
  table_id: string                           // 台桌ID
  user_id: string                            // 用户ID
  bet_time: string                           // 投注时间
  settle_time: string                        // 结算时间

  // 投注详情
  bet_details: Array<{
    bet_type: string                         // 投注类型
    bet_type_name: string                    // 投注类型名称
    bet_amount: number                       // 投注金额
    odds: string                             // 赔率
    win_amount: number                       // 赢得金额
    is_win: boolean                          // 是否中奖
    rate_id: number                          // 赔率ID
  }>

  total_bet_amount: number                   // 总投注金额
  total_win_amount: number                   // 总赢得金额
  net_amount: number                         // 净输赢金额
  status: 'win' | 'lose' | 'pending'         // 状态
  is_settled: boolean                        // 是否已结算
  currency: string                           // 货币类型
}

/**
 * 投注历史响应
 * @interface BettingHistoryResponse
 */
export interface BettingHistoryResponse {
  records: BettingHistoryRecord[]            // 记录列表
  pagination: {
    current_page: number                     // 当前页码
    total_pages: number                      // 总页数
    total_records: number                    // 总记录数
    page_size: number                        // 每页大小
    has_more: boolean                        // 是否有更多
  }
}

// ========================= 4. 投注接口 =========================

/**
 * 投注请求
 * @interface BetRequest
 */
export interface BetRequest {
  money: number                              // 投注金额
  rate_id: number                            // 赔率ID
}

/**
 * 投注响应
 * @interface BetResponse
 */
export interface BetResponse {
  money_balance: number                      // 投注后余额
  money_spend: number                        // 花费金额
  bets: BetRequest[]                        // 投注详情
}

// ========================= 5. 统计接口 =========================

/**
 * 台桌统计响应
 * @interface TableStatisticsResponse
 * @description 基于后端 get_table_count 方法
 */
export interface TableStatisticsResponse {
  zhuang: number                             // 庄的次数
  xian: number                               // 闲的次数
  he: number                                 // 和的次数
  zhuangDui: number                          // 庄对的次数（包含庄闲对）
  xianDui: number                           // 闲对的次数（包含庄闲对）
  zhuangXianDui: number                      // 庄闲对的次数
}

// ========================= 6. 露珠数据接口（新增） =========================

/**
 * 露珠数据响应
 * @interface LuZhuDataResponse
 * @description 露珠历史数据，key格式为 "k0", "k1", "k2"...
 */
export interface LuZhuDataResponse {
  [key: string]: {
    result: number    // 结果：1=庄，2=闲，3=和，4-9为特殊结果
    ext: number       // 对子信息：0=无，1=庄对，2=闲对，3=庄闲对
  }
}

// ========================= API 服务类 =========================

/**
 * 游戏 API 服务类
 * @class GameApiService
 * @description 封装所有游戏相关的 API 调用
 */
export class GameApiService {
  private gameParams: GameParams

  /**
   * 构造函数
   * @param {GameParams} params - 游戏参数
   */
  constructor(params: GameParams) {
    this.gameParams = params
    setAuthToken(params.token)
  }

  /**
   * 1. 获取台桌信息
   * @description 获取指定台桌的完整信息
   * @returns {Promise<TableInfo>} 台桌信息
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
   * @description 获取当前用户的详细信息
   * @returns {Promise<UserInfo>} 用户信息
   */
  async getUserInfo(): Promise<UserInfo> {
    const response = await httpClient.get<UserInfo>('/bjl/user/info', {
      user_id: this.gameParams.user_id
    })
    return response
  }

  /**
   * 3. 获取用户历史投注信息
   * @description 分页获取用户的投注历史记录
   * @param {BettingHistoryParams} params - 查询参数
   * @returns {Promise<BettingHistoryResponse>} 投注历史响应
   */
  async getBettingHistory(params: BettingHistoryParams): Promise<BettingHistoryResponse> {
    const requestParams = {
      user_id: params.user_id,
      table_id: params.table_id,
      game_type: params.game_type,
      page: params.page,
      page_size: params.page_size,
      status: params.status || '',
      start_date: params.start_date || '',
      end_date: params.end_date || ''
    }

    const response = await httpClient.get<BettingHistoryResponse>(
      '/bjl/bet/history',
      requestParams
    )
    return response
  }

  /**
   * 4. 当局投注
   * @description 批量提交投注订单
   * @param {BetRequest[]} bets - 投注列表
   * @param {any} is_exempt - 是否免佣
   * @returns {Promise<BetResponse>} 投注响应
   */
  async orderBets(bets: BetRequest[], is_exempt: any): Promise<BetResponse> {
    const requestData = {
      table_id: parseInt(this.gameParams.table_id),
      game_type: parseInt(this.gameParams.game_type),
      is_exempt: is_exempt,
      bet: bets
    }

    const response = await httpClient.post<BetResponse>(
      '/bjl/bet/order',
      requestData
    )
    return response
  }

  /**
   * 5. 获取当前靴的统计信息
   * @description 获取当前靴的庄闲和等统计数据
   * @returns {Promise<TableStatisticsResponse>} 统计信息
   */
  async getCurrentShoeStatistics(): Promise<TableStatisticsResponse> {
    try {
      // 先获取台桌信息以获得当前靴号
      const tableInfo = await this.getTableInfo()

      const requestParams = {
        tableId: this.gameParams.table_id,
        xue: tableInfo.num_xue,
        gameType: this.gameParams.game_type
      }

      const response = await httpClient.get<TableStatisticsResponse>(
        '/bjl/get_table/get_table_count',
        requestParams
      )

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
      throw error
    }
  }

  /**
   * 6. 获取露珠列表数据（新增）
   * @description 获取指定台桌的露珠历史数据
   * @param {string | number} tableId - 台桌ID（必填）
   * @returns {Promise<LuZhuDataResponse>} 露珠数据
   */
  async getLuZhuData(tableId: string | number): Promise<LuZhuDataResponse> {
    try {
      // 调用后端接口，只传递 tableId 参数
      const response = await httpClient.get<LuZhuDataResponse>(
        '/bjl/get_table/get_data',
        { tableId }
      )

      // 确保返回的数据格式正确
      return response || {}
    } catch (error) {
      throw error
    }
  }

  /**
   * 获取当前游戏参数
   * @description 返回当前的游戏参数副本
   * @returns {GameParams} 游戏参数
   */
  getGameParams(): GameParams {
    return { ...this.gameParams }
  }

  /**
   * 更新游戏参数
   * @description 更新游戏参数并重新设置认证令牌
   * @param {Partial<GameParams>} newParams - 新的游戏参数
   */
  updateGameParams(newParams: Partial<GameParams>): void {
    this.gameParams = { ...this.gameParams, ...newParams }
    if (newParams.token) {
      setAuthToken(newParams.token)
    }
  }
}

// ========================= 工厂函数和单例管理 =========================

/**
 * 创建 API 服务实例
 * @param {GameParams} params - 游戏参数
 * @returns {GameApiService} API服务实例
 */
export const createGameApiService = (params: GameParams): GameApiService => {
  return new GameApiService(params)
}

// 全局 API 服务实例
let globalApiService: GameApiService | null = null

/**
 * 设置全局 API 服务实例
 * @param {GameApiService} service - API服务实例
 */
export const setGlobalApiService = (service: GameApiService): void => {
  globalApiService = service
}

/**
 * 获取全局 API 服务实例
 * @returns {GameApiService} API服务实例
 * @throws {Error} 如果服务未初始化
 */
export const getGlobalApiService = (): GameApiService => {
  if (!globalApiService) {
    throw new Error('API服务未初始化')
  }
  return globalApiService
}

/**
 * 快捷初始化方法
 * @description 初始化API服务并获取基础数据
 * @param {GameParams} params - 游戏参数
 * @returns {Promise} 包含API服务、台桌信息和用户信息
 */
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
