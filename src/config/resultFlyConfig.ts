/**
 * ResultFly 动画配置
 * 支持视频在上/下两种布局模式
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

export interface PositionConfig {
  // 横条起始位置（视频区域底部）
  barStart: Position

  // 圆球目标位置（路珠中央）
  ballTarget: Position

  // 路单图标目标位置（路珠内部各区域）
  roadTargets: {
    bigRoad: Position
    bigEye: Position
    smallRoad: Position
    cockroach: Position
  }
}

/**
 * 计算位置配置
 * @param isVideoOnTop 视频是否在上方
 */
export function getPositionConfig(isVideoOnTop: boolean): PositionConfig {
  const screenWidth = window.innerWidth
  const screenHeight = window.innerHeight
  const videoHeight = 300
  const luZhuHeight = 233

  if (isVideoOnTop) {
    // 视频在上方模式
    const bottomOffset = 346  // 根据游戏状态可能需要调整

    return {
      // 横条：视频底部
      barStart: {
        x: screenWidth / 2,
        y: videoHeight - 20
      },

      // 圆球：路珠中央（屏幕下方）
      ballTarget: {
        x: screenWidth / 2,
        y: screenHeight - bottomOffset + luZhuHeight / 2
      },

      // 路单图标：路珠内部各区域
      roadTargets: {
        // 大路：左侧，上半部分中央
        bigRoad: {
          x: 40,
          y: screenHeight - bottomOffset + 27
        },
        // 大眼路：左下区域
        bigEye: {
          x: screenWidth / 6,
          y: screenHeight - bottomOffset + luZhuHeight - 27
        },
        // 小路：中下区域
        smallRoad: {
          x: screenWidth / 2,
          y: screenHeight - bottomOffset + luZhuHeight - 27
        },
        // 曱甴路：右下区域
        cockroach: {
          x: screenWidth * 5 / 6,
          y: screenHeight - bottomOffset + luZhuHeight - 27
        }
      }
    }
  } else {
    // 视频在下方模式
    return {
      // 横条：视频中央底部
      barStart: {
        x: screenWidth / 2,
        y: luZhuHeight + videoHeight / 2
      },

      // 圆球：路珠中央（屏幕上方）
      ballTarget: {
        x: screenWidth / 2,
        y: luZhuHeight / 2
      },

      // 路单图标：路珠内部各区域
      roadTargets: {
        // 大路：左侧，上半部分中央
        bigRoad: {
          x: 40,
          y: 27
        },
        // 大眼路：左下区域
        bigEye: {
          x: screenWidth / 6,
          y: luZhuHeight - 27
        },
        // 小路：中下区域
        smallRoad: {
          x: screenWidth / 2,
          y: luZhuHeight - 27
        },
        // 曱甴路：右下区域
        cockroach: {
          x: screenWidth * 5 / 6,
          y: luZhuHeight - 27
        }
      }
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
