/**
 * ResultFly 动画配置
 * 简化版 - 位置从实际路珠数据计算
 */

export type ResultType = 'banker' | 'player' | 'tie'

export interface Position {
  x: number
  y: number
}

export interface ResultFlyConfig {
  // 结果类型
  result: ResultType

  // 横条配置
  bar: {
    text: string
    color: string
    showDuration: number  // 显示时长
    shrinkDuration: number  // 缩短动画时长
    startWidth: string
    endWidth: string
  }

  // 圆球配置
  ball: {
    letter: string
    color: string
    size: number
    flyDuration: number  // 飞行时长
    shrinkDuration: number  // 变小消失时长
  }

  // 路单图标配置
  roadIcons: {
    color: string
    flyDuration: number  // 飞行时长
    delay: number  // 每个图标之间的延迟
  }
}

/**
 * 获取横条起始位置（视频区域底部）
 */
export function getBarStartPosition(isVideoOnTop: boolean): Position {
  const screenWidth = window.innerWidth
  const videoHeight = 300

  if (isVideoOnTop) {
    // 视频在上：视频底部中央
    return {
      x: screenWidth / 2,
      y: videoHeight - 20
    }
  } else {
    // 视频在下：视频区域中央
    const luZhuHeight = 233
    return {
      x: screenWidth / 2,
      y: luZhuHeight + videoHeight / 2
    }
  }
}

/**
 * 获取圆球目标位置（露珠区域中心）
 */
export function getBallTargetPosition(isVideoOnTop: boolean): Position {
  const screenWidth = window.innerWidth
  const screenHeight = window.innerHeight
  const luZhuHeight = 233

  if (isVideoOnTop) {
    // 视频在上，露珠在下
    // 露珠的 bottom 值约为 270px，所以从屏幕底部往上 270px + 露珠高度的一半
    const bottomOffset = 270
    return {
      x: screenWidth / 2,
      y: screenHeight - (bottomOffset + luZhuHeight / 2)
    }
  } else {
    // 露珠在上（top: 0）
    // 露珠区域的中心就是 top + 233/2
    return {
      x: screenWidth / 2,
      y: luZhuHeight / 2
    }
  }
}

/**
 * 计算露珠容器在屏幕上的位置
 * 用于将路珠内部坐标转换为屏幕绝对坐标
 */
export function getLuZhuContainerTop(isVideoOnTop: boolean, gameStatus: string): number {
  const screenHeight = window.innerHeight

  if (isVideoOnTop) {
    // 视频在上，露珠在下
    const bottomOffset = gameStatus === 'betting' ? 346 : 270
    return screenHeight - bottomOffset
  } else {
    // 露珠在上
    return 0
  }
}

/**
 * 将路珠内部坐标转换为屏幕绝对坐标
 * @param left 路珠内部的 left 值
 * @param top 路珠内部的 top 值
 * @param isVideoOnTop 视频是否在上方
 * @param gameStatus 游戏状态
 * @param section 所属区域：'bigRoad' | 'bigEye' | 'smallRoad' | 'cockroach'
 */
export function convertToScreenPosition(
  left: number,
  top: number,
  isVideoOnTop: boolean,
  gameStatus: string,
  section: 'bigRoad' | 'bigEye' | 'smallRoad' | 'cockroach'
): Position {
  const screenWidth = window.innerWidth
  const luZhuContainerTop = getLuZhuContainerTop(isVideoOnTop, gameStatus)

  if (section === 'bigRoad') {
    // 大路在上半部分 (54px高)
    return {
      x: left + 9,  // 18px图标的中心
      y: luZhuContainerTop + top + 9
    }
  } else {
    // 下三路在下半部分 (54px高，从第55px开始)
    const threeRoadsTop = 54  // 大路区域高度
    const sectionWidth = screenWidth / 3

    let sectionLeft = 0
    if (section === 'bigEye') {
      sectionLeft = 0
    } else if (section === 'smallRoad') {
      sectionLeft = sectionWidth
    } else if (section === 'cockroach') {
      sectionLeft = sectionWidth * 2
    }

    return {
      x: sectionLeft + left + 4.5,  // 9px图标的中心
      y: luZhuContainerTop + threeRoadsTop + top + 4.5
    }
  }
}

/**
 * 默认动画配置
 */
export const defaultAnimationConfig: Record<ResultType, ResultFlyConfig> = {
  banker: {
    result: 'banker',
    bar: {
      text: 'BANKER',
      color: '#8b0000',  // 深红色
      showDuration: 800,
      shrinkDuration: 400,
      startWidth: '80vw',
      endWidth: '100px'
    },
    ball: {
      letter: 'B',
      color: '#8b0000',
      size: 30,
      flyDuration: 1000,
      shrinkDuration: 300
    },
    roadIcons: {
      color: '#EC2024',
      flyDuration: 800,
      delay: 100
    }
  },

  player: {
    result: 'player',
    bar: {
      text: 'PLAYER',
      color: '#0000ff',  // 蓝色
      showDuration: 800,
      shrinkDuration: 400,
      startWidth: '80vw',
      endWidth: '100px'
    },
    ball: {
      letter: 'P',
      color: '#0000ff',
      size: 30,
      flyDuration: 1000,
      shrinkDuration: 300
    },
    roadIcons: {
      color: '#2E83FF',
      flyDuration: 800,
      delay: 100
    }
  },

  tie: {
    result: 'tie',
    bar: {
      text: 'TIE',
      color: '#008000',  // 绿色
      showDuration: 800,
      shrinkDuration: 400,
      startWidth: '80vw',
      endWidth: '100px'
    },
    ball: {
      letter: 'T',
      color: '#008000',
      size: 30,
      flyDuration: 1000,
      shrinkDuration: 300
    },
    roadIcons: {
      color: '#00CC00',
      flyDuration: 800,
      delay: 100
    }
  }
}
