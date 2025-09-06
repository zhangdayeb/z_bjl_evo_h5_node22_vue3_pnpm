// 🎵 简化重构的音频系统 - 播放优先，简单直接
import { reactive, readonly } from 'vue'
import { Howl, Howler } from 'howler'

// 全局单例状态
let audioSystemInstance: ReturnType<typeof createAudioSystem> | null = null

// 🎯 音频配置接口
export interface AudioConfig {
  masterVolume: number
  enableSfx: boolean
  enableMusic: boolean
}

// 🎯 播放选项接口
export interface PlayOptions {
  volume?: number
  interval?: number
}

// 🎯 智能路径解析 - 兼容开发和生产环境
const getAudioPath = (filename: string): string => {
  // 根据环境返回不同路径
  const isDevelopment = import.meta.env.DEV
  const basePath = isDevelopment ? '/src/assets/audio' : '/src/assets/audio'

  return `${basePath}/${filename}`
}

// 🎯 核心音频系统创建函数
function createAudioSystem() {
  console.log('🎵 创建音频系统')

  // 音频配置
  const config = reactive<AudioConfig>({
    masterVolume: 1.0,
    enableSfx: true,
    enableMusic: true
  })

  // 背景音乐状态 - 固定为 bg.mp3
  let backgroundMusic: Howl | null = null
  let backgroundMusicPosition: number = 0

  // 音效队列
  const soundQueue: (() => Promise<void>)[] = []
  let isProcessingQueue = false

  // 🎯 自动加载配置
  const autoLoadConfig = (): void => {
    try {
      const saved = localStorage.getItem('bjl_audio_config')
      if (saved) {
        const savedConfig = JSON.parse(saved)

        config.masterVolume = savedConfig.masterVolume ?? 1.0
        config.enableSfx = savedConfig.enableSfx ?? true
        config.enableMusic = savedConfig.enableMusic ?? true

        backgroundMusicPosition = savedConfig.backgroundMusicPosition ?? 0

        // 设置全局音量
        Howler.volume(config.masterVolume)
        console.log('📂 音频配置已加载')
      } else {
        Howler.volume(config.masterVolume)
        console.log('📂 使用默认音频配置')
      }
    } catch (error) {
      console.warn('配置加载失败，使用默认配置:', error)
      Howler.volume(config.masterVolume)
    }
  }

  // 🎯 保存配置
  const saveConfig = (): void => {
    try {
      const configToSave = {
        ...config,
        backgroundMusicPosition
      }
      localStorage.setItem('bjl_audio_config', JSON.stringify(configToSave))
    } catch (error) {
      console.warn('保存配置失败:', error)
    }
  }

  // 🎯 音效队列处理
  const processQueue = async (): Promise<void> => {
    if (isProcessingQueue || soundQueue.length === 0) return

    isProcessingQueue = true

    while (soundQueue.length > 0) {
      const playNext = soundQueue.shift()
      if (playNext) {
        await playNext()
      }
    }

    isProcessingQueue = false
  }

  // 🎯 播放单个音效文件 - 修复版本
  const playAudioFile = async (filename: string, options: PlayOptions = {}): Promise<void> => {
    if (!config.enableSfx) return

    try {
      const sound = new Howl({
        src: [getAudioPath(filename)],
        volume: options.volume ?? config.masterVolume,
        preload: true  // 🔥 改为 true，确保预加载
      })

      // 等待加载完成再播放
      await new Promise<void>((resolve, reject) => {
        sound.once('load', () => {
          // 文件加载完成，开始播放
          sound.play()
        })

        sound.once('end', () => resolve())
        sound.once('loaderror', (id, error) => {
          console.warn(`音效加载失败 ${filename}:`, error)
          resolve() // 失败也继续
        })

        sound.once('playerror', (id, error) => {
          console.warn(`音效播放失败 ${filename}:`, error)
          resolve() // 失败也继续
        })
      })

      // 播放完成后卸载
      sound.unload()
    } catch (error) {
      console.warn(`音效播放失败 ${filename}:`, error)
    }
  }

  // 🎯 播放音效序列
  const playAudioSequence = async (filenames: string[], options: PlayOptions = {}): Promise<void> => {
    if (!config.enableSfx) return

    const interval = options.interval ?? 300

    soundQueue.push(async () => {
      for (let i = 0; i < filenames.length; i++) {
        await playAudioFile(filenames[i], options)

        if (i < filenames.length - 1) {
          await new Promise(resolve => setTimeout(resolve, interval))
        }
      }
    })

    processQueue()
  }

  // 🎯 播放背景音乐 - 修复版本
  const playBackgroundMusic = (): void => {
    if (!config.enableMusic) {
      console.log('🔇 背景音乐已禁用')
      return
    }

    try {
      // 如果背景音乐已存在且未在播放，则继续播放
      if (backgroundMusic && !backgroundMusic.playing()) {
        backgroundMusic.seek(backgroundMusicPosition)
        backgroundMusic.play()
        console.log('▶️ 继续播放背景音乐')
        return
      }

      // 如果已经在播放，跳过
      if (backgroundMusic && backgroundMusic.playing()) {
        return
      }

      // 创建新的背景音乐实例
      console.log('🎵 开始播放背景音乐')

      backgroundMusic = new Howl({
        src: [getAudioPath('bg.mp3')],
        volume: config.masterVolume,
        loop: true,
        preload: true,  // 确保预加载
        html5: false,   // 强制使用 Web Audio API

        // 错误处理
        onloaderror: (id, error) => {
          console.error('背景音乐加载失败:', error)
        },
        onplayerror: (id, error) => {
          console.error('背景音乐播放失败:', error)
        }
      })

      backgroundMusic.play()
      backgroundMusicPosition = 0

    } catch (error) {
      console.error('背景音乐播放异常:', error)
    }
  }

  // 🎯 暂停背景音乐
  const pauseBackgroundMusic = (): void => {
    if (backgroundMusic && backgroundMusic.playing()) {
      backgroundMusicPosition = backgroundMusic.seek() as number
      backgroundMusic.pause()
      console.log('⏸️ 背景音乐已暂停')
    }
  }

  // 🎯 继续背景音乐
  const resumeBackgroundMusic = (): void => {
    if (backgroundMusic && !backgroundMusic.playing()) {
      backgroundMusic.seek(backgroundMusicPosition)
      backgroundMusic.play()
      console.log('▶️ 背景音乐已继续')
    }
  }

  // 🎯 停止背景音乐
  const stopBackgroundMusic = (): void => {
    if (backgroundMusic) {
      backgroundMusic.stop()
      backgroundMusic.unload()
      backgroundMusic = null
      backgroundMusicPosition = 0
      console.log('⏹️ 背景音乐已停止')
    }
  }

  // 🎯 切换背景音乐
  const toggleMusic = (): void => {
    config.enableMusic = !config.enableMusic

    if (config.enableMusic) {
      resumeBackgroundMusic()
    } else {
      pauseBackgroundMusic()
    }

    saveConfig()
    console.log('🎵 背景音乐:', config.enableMusic ? '已开启' : '已关闭')
  }

  // 🎯 切换音效
  const toggleSfx = (): void => {
    config.enableSfx = !config.enableSfx
    saveConfig()
    console.log('🔊 音效:', config.enableSfx ? '已开启' : '已关闭')
  }

  // 🎯 设置音量
  const setMasterVolume = (volume: number): void => {
    config.masterVolume = Math.max(0, Math.min(1, volume))
    Howler.volume(config.masterVolume)

    // 更新背景音乐音量
    if (backgroundMusic) {
      backgroundMusic.volume(config.masterVolume)
    }

    saveConfig()
    console.log(`🔊 音量: ${Math.round(config.masterVolume * 100)}%`)
  }

  // 🎯 自动启动背景音乐
  const startBackgroundMusicIfEnabled = (): void => {
    if (config.enableMusic) {
      playBackgroundMusic()
    }
  }

  // 🎯 系统清理
  const cleanup = (): void => {
    console.log('🧹 清理音频系统...')

    // 清空队列
    soundQueue.length = 0

    // 停止背景音乐
    stopBackgroundMusic()

    console.log('✅ 音频系统清理完成')
  }

  // 🎯 获取系统信息
  const getAudioInfo = () => ({
    config: { ...config },
    backgroundMusicPosition,
    queueLength: soundQueue.length,
    isProcessingQueue,
    isBackgroundMusicPlaying: backgroundMusic?.playing() ?? false
  })

  // 🔥 自动加载配置
  autoLoadConfig()

  return {
    // 配置
    config: readonly(config),

    // 核心播放方法
    playAudioFile,        // 播放单个音效
    playAudioSequence,    // 播放音效序列

    // 背景音乐控制
    playBackgroundMusic,
    pauseBackgroundMusic,
    resumeBackgroundMusic,
    stopBackgroundMusic,
    startBackgroundMusicIfEnabled,

    // 开关控制
    toggleMusic,
    toggleSfx,

    // 音量控制
    setMasterVolume,

    // 配置和系统管理
    saveConfig,
    cleanup,
    getAudioInfo
  }
}

// 🎯 单例模式导出
export const useAudio = () => {
  if (!audioSystemInstance) {
    console.log('🎵 初始化音频系统')
    audioSystemInstance = createAudioSystem()
  }
  return audioSystemInstance
}
