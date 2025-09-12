// src/utils/roadmapCalculator.ts

/**
 * 百家乐路单计算器
 * 严格按照JS逻辑实现，包含珠盘路、大路、大眼路、小路、蟑螂路、三星路的计算
 */

// ==================== 类型定义 ====================

/** 游戏结果输入 */
export interface GameResult {
  result: 1 | 2 | 3 | 4 | 6 | 7 | 8 | 9;  // 1=庄 2=闲 3=和 4=幸运6 6=小老虎 7=龙7 8=熊8 9=大老虎
  ext: 0 | 1 | 2 | 3;                      // 0=无对子 1=庄对 2=闲对 3=双对
}

/** 珠盘路位置 */
export interface BeadPlatePosition {
  col: number;                              // 列位置
  row: number;                              // 行位置
  result_original: 1|2|3|4|6|7|8|9;        // 原始结果（未转换）
  result: 1|2|3;                            // 转换后结果：1=庄 2=闲 3=和
  ext: 0|1|2|3;                             // 对子信息
  left: number;                             // 像素左边距
  top: number;                              // 像素上边距
}

/** 大路位置 */
export interface BigRoadPosition {
  col: number;                              // 列位置
  row: number;                              // 行位置
  result: 1|2;                              // 结果：1=庄 2=闲（和局不占格）
  ext: 0|1|2|3;                             // 对子信息
  tieCount?: number;                        // 和局累计数量
  left: number;                             // 像素左边距
  top: number;                              // 像素上边距
}

/** 下三路/三星路位置（统一格式） */
export interface DerivedRoadPosition {
  col: number;                              // 列位置
  row: number;                              // 行位置
  result: 1|2;                              // 1=红 2=蓝
  left: number;                             // 像素左边距
  top: number;                              // 像素上边距
}

/** 统计数据 */
export interface Statistics {
  total: number;                            // 总局数
  banker: number;                           // 庄赢次数
  player: number;                           // 闲赢次数
  tie: number;                              // 和局次数
  bankerPair: number;                       // 庄对次数
  playerPair: number;                       // 闲对次数
}

/** 问路预测结果 */
export interface Prediction {
  banker: {
    bigEye: 'red' | 'blue';
    small: 'red' | 'blue';
    cockroach: 'red' | 'blue';
  };
  player: {
    bigEye: 'red' | 'blue';
    small: 'red' | 'blue';
    cockroach: 'red' | 'blue';
  };
}

/** 问路位置数据 */
export interface WenluPosition {
  x: number;
  y: number;
  color: 'red' | 'blue';
}

/** 所有路单数据 */
export interface RoadmapData {
  beadPlate: BeadPlatePosition[];           // 珠盘路
  bigRoad: BigRoadPosition[];               // 大路
  bigEyeRoad: DerivedRoadPosition[];        // 大眼路
  smallRoad: DerivedRoadPosition[];         // 小路
  cockroachRoad: DerivedRoadPosition[];     // 蟑螂路
  sanxing: DerivedRoadPosition[];           // 三星路
}

/** 问路数据 */
export interface WenluData {
  zhuzi_red: WenluPosition;                 // 珠盘庄问路
  zhuzi_blue: WenluPosition;                // 珠盘闲问路
  dalu_red: WenluPosition;                  // 大路庄问路
  dalu_blue: WenluPosition;                 // 大路闲问路
  dayan_red: WenluPosition;                 // 大眼庄问路
  dayan_blue: WenluPosition;                // 大眼闲问路
  xiaolu_red: WenluPosition;                // 小路庄问路
  xiaolu_blue: WenluPosition;               // 小路闲问路
  xiaoqiang_red: WenluPosition;             // 蟑螂路庄问路
  xiaoqiang_blue: WenluPosition;            // 蟑螂路闲问路
}

// ==================== 主类 ====================
export class RoadmapCalculator {
  // 调试开关
  private isDebug: boolean = false;

  // 网格大小设置
  private gridSizes = {
    beadPlate: 33,      // 珠盘路格子大小
    bigRoad: 22,        // 大路格子大小
    bigEyeRoad: 11,     // 大眼路格子大小
    smallRoad: 11,      // 小路格子大小
    cockroachRoad: 11,  // 蟑螂路格子大小
    sanxing: 22         // 三星路格子大小
  };

  // 最大行数限制
  private maxRows = {
    beadPlate: 6,       // 珠盘路6行
    bigRoad: 6,         // 大路6行
    bigEyeRoad: 6,      // 大眼路6行
    smallRoad: 6,       // 小路6行
    cockroachRoad: 6,   // 蟑螂路6行
    sanxing: 3          // 三星路3行
  };

  // ==================== 中间数据存储 ====================

  // 原始数据
  private res_org_obj: Record<string, GameResult> = {};

  // 珠盘对象（图片编号）
  private res_zhuzi_obj: Record<string, number> = {};

  // 大路对象（压缩前）
  private res_dalu_obj_img_before: Record<string, number> = {};
  private res_dalu_obj_num_before: Record<string, number> = {};

  // 大路对象（压缩后）
  private res_dalu_obj_img: Record<string, number> = {};
  private res_dalu_obj_num: Record<string, number> = {};

  // 大路中间二维数组（99x99）- 下三路数据源
  private tmp_dalu_array: (number | 'no_color')[][] = [];
  private tmp_dalu_array_num: (number | 'no_color')[][] = [];

  // 下三路对象
  private res_dayan_obj: Record<string, 'red' | 'blue'> = {};
  private res_xiaolu_obj: Record<string, 'red' | 'blue'> = {};
  private res_xiaoqiang_obj: Record<string, 'red' | 'blue'> = {};

  // 三星路对象
  private res_sanxing_obj_img: Record<string, 'red' | 'blue'> = {};
  private res_sanxing_obj_num: Record<string, number> = {};

  // 显示用二维数组
  private show_zhuzi: (number | 'no_color')[][] = [];
  private show_dalu_img: (number | 'no_color')[][] = [];
  private show_dalu_num: (number | 'no_color')[][] = [];
  private show_dayan: ('red' | 'blue' | 'no_color')[][] = [];
  private show_xiaolu: ('red' | 'blue' | 'no_color')[][] = [];
  private show_xiaoqiang: ('red' | 'blue' | 'no_color')[][] = [];
  private show_sanxing_img: ('red' | 'blue' | 'no_color')[][] = [];
  private show_sanxing_num: (number | 'no_color')[][] = [];

  // 转弯节点记录
  private change_point_dalu: number[] = [];
  private change_point_dayan: number[] = [];
  private change_point_xiaolu: number[] = [];
  private change_point_xiaoqiang: number[] = [];

  // ==================== 公共方法 ====================

  /**
   * 设置调试模式
   */
  setDebug(debug: boolean): void {
    this.isDebug = debug;
  }

  /**
   * 调试打印
   */
  private showMsg(msg: any): void {
    if (this.isDebug) {
      console.log(msg);
    }
  }

  /**
   * 主入口：计算所有路单
   */
  calculateAll(data: Record<string, GameResult>): RoadmapData {
    this.showMsg("======== 开始计算路单 ========");

    // 初始化所有数据
    this.initAllData(data);

    // 执行计算
    this.setAllDataTypeIsObj();

    // 设置显示数据
    this.setAllDataTypeJustForShow();

    // 打印调试信息
    this.printAllDebugInfo();

    // 生成返回结果
    return this.generateRoadmapData();
  }

  /**
   * 计算统计数据
   */
  calculateStatistics(data: Record<string, GameResult>): Statistics {
    const stats: Statistics = {
      total: 0,
      banker: 0,
      player: 0,
      tie: 0,
      bankerPair: 0,
      playerPair: 0
    };

    Object.values(data).forEach(item => {
      stats.total++;

      // 统计输赢（需要转换特殊结果）
      let result = item.result;
      if (result === 4 || result === 6 || result === 7 || result === 9) {
        result = 1; // 转为庄
      }
      if (result === 8) {
        result = 2; // 转为闲
      }

      if (result === 1) stats.banker++;
      else if (result === 2) stats.player++;
      else if (result === 3) stats.tie++;

      // 统计对子
      if (item.ext === 1 || item.ext === 3) stats.bankerPair++;
      if (item.ext === 2 || item.ext === 3) stats.playerPair++;
    });

    return stats;
  }

  /**
   * 计算问路预测
   */
  calculatePredictions(data: Record<string, GameResult>): Prediction {
    // 先计算当前所有路单
    this.calculateAll(data);

    // 获取下三路的问路预测
    const bankerPrediction = this.getPredictionForNext(1);
    const playerPrediction = this.getPredictionForNext(2);

    return {
      banker: bankerPrediction,
      player: playerPrediction
    };
  }

  /**
   * 获取问路数据
   */
  getWenluData(data: Record<string, GameResult>): WenluData {
    // 先计算当前所有路单
    this.calculateAll(data);

    // 计算各路的问路位置
    return {
      zhuzi_red: this.getWenluPosition('zhuzi', 'red'),
      zhuzi_blue: this.getWenluPosition('zhuzi', 'blue'),
      dalu_red: this.getWenluPosition('dalu', 'red'),
      dalu_blue: this.getWenluPosition('dalu', 'blue'),
      dayan_red: this.getWenluPosition('dayan', 'red'),
      dayan_blue: this.getWenluPosition('dayan', 'blue'),
      xiaolu_red: this.getWenluPosition('xiaolu', 'red'),
      xiaolu_blue: this.getWenluPosition('xiaolu', 'blue'),
      xiaoqiang_red: this.getWenluPosition('xiaoqiang', 'red'),
      xiaoqiang_blue: this.getWenluPosition('xiaoqiang', 'blue')
    };
  }

  // ==================== 私有方法 - 初始化 ====================

  /**
   * 初始化所有数据
   */
  private initAllData(data: Record<string, GameResult>): void {
    this.res_org_obj = data;
    this.resetAllArrays();
  }

  /**
   * 重置所有数组
   */
  private resetAllArrays(): void {
    // 创建二维数组
    this.tmp_dalu_array = this.createArray2D(99, 99);
    this.tmp_dalu_array_num = this.createArray2D(99, 99);

    this.show_zhuzi = this.createArray2D(16, 6);
    this.show_dalu_img = this.createArray2D(99, 6);
    this.show_dalu_num = this.createArray2D(99, 6);
    this.show_dayan = this.createArray2D(99, 6);
    this.show_xiaolu = this.createArray2D(99, 6);
    this.show_xiaoqiang = this.createArray2D(99, 6);
    this.show_sanxing_img = this.createArray2D(99, 3);
    this.show_sanxing_num = this.createArray2D(99, 3);

    // 初始化转弯节点
    this.change_point_dalu = new Array(99).fill(5);
    this.change_point_dayan = new Array(99).fill(5);
    this.change_point_xiaolu = new Array(99).fill(5);
    this.change_point_xiaoqiang = new Array(99).fill(5);
  }

  /**
   * 创建二维数组
   */
  private createArray2D(rows: number, cols: number): any[][] {
    const arr = new Array(rows);
    for (let i = 0; i < rows; i++) {
      arr[i] = new Array(cols).fill('no_color');
    }
    return arr;
  }

  // ==================== 私有方法 - 数据处理 ====================

  /**
   * 设置所有数据对象
   */
  private setAllDataTypeIsObj(): void {
    this.showMsg("======== 步骤1: 设置珠盘数据 ========");
    this.setZhuziObj();

    this.showMsg("======== 步骤2: 设置大路数据 ========");
    this.setDaluObj();

    this.showMsg("======== 步骤3: 压缩大路数据 ========");
    this.compressDaluObj();

    this.showMsg("======== 步骤4: 构建大路中间数组 ========");
    this.buildDaluMiddleArray();

    this.showMsg("======== 步骤5: 设置三星路数据 ========");
    this.setSanxingObj();

    this.showMsg("======== 步骤6: 设置下三路数据 ========");
    this.setDayanObj();
    this.setXiaoluObj();
    this.setXiaoqiangObj();
  }

  /**
   * 设置珠盘对象
   */
  private setZhuziObj(): void {
    this.res_zhuzi_obj = {};
    for (const key in this.res_org_obj) {
      this.res_zhuzi_obj[key] = this.getImgNumber(
        this.res_org_obj[key].result,
        this.res_org_obj[key].ext
      );
    }
    this.showMsg("珠盘对象：");
    this.showMsg(this.res_zhuzi_obj);
  }

  /**
   * 设置大路对象
   */
  private setDaluObj(): void {
    this.res_dalu_obj_img_before = {};
    this.res_dalu_obj_num_before = {};
    let position = 0;

    for (const key in this.res_org_obj) {
      let result = this.res_org_obj[key].result;

      // 特殊结果转换
      if (result === 4 || result === 6 || result === 7 || result === 9) {
        result = 1; // 转为庄
      }
      if (result === 8) {
        result = 2; // 转为闲
      }

      // 非和局存入图片对象
      if (result !== 3) {
        const imgNum = this.getImgNumber(result, this.res_org_obj[key].ext);
        this.res_dalu_obj_img_before[`k${position}`] = imgNum;
      }

      // 和局记录计数
      if (result === 3 && position > 0) {
        const prevKey = `k${position - 1}`;
        this.res_dalu_obj_num_before[prevKey] = 1;
      }

      position++;
    }

    // 处理和局累计
    this.res_dalu_obj_num_before = this.setHeSumByHeNum(this.res_dalu_obj_num_before);

    this.showMsg("大路图片对象（压缩前）：");
    this.showMsg(this.res_dalu_obj_img_before);
    this.showMsg("大路数字对象（压缩前）：");
    this.showMsg(this.res_dalu_obj_num_before);
  }

  /**
   * 压缩大路对象（移除和局）
   */
  private compressDaluObj(): void {
    const tmpImg: Record<string, number> = {};
    const tmpNum: Record<string, number> = {};
    let i = 0;

    for (const key in this.res_dalu_obj_img_before) {
      const imgNum = this.res_dalu_obj_img_before[key];
      // 过滤和局图片（9-12是和局相关）
      if (![9, 10, 11, 12].includes(imgNum)) {
        tmpImg[`k${i}`] = imgNum;
        if (this.res_dalu_obj_num_before[key]) {
          tmpNum[`k${i}`] = this.res_dalu_obj_num_before[key];
        }
        i++;
      }
    }

    this.res_dalu_obj_img = tmpImg;
    this.res_dalu_obj_num = tmpNum;

    this.showMsg("大路图片对象（压缩后）：");
    this.showMsg(this.res_dalu_obj_img);
    this.showMsg("大路数字对象（压缩后）：");
    this.showMsg(this.res_dalu_obj_num);
  }

  /**
   * 构建大路中间二维数组
   */
  private buildDaluMiddleArray(): void {
    let col = 0;
    let row = 0;

    for (const key in this.res_dalu_obj_img) {
      const keyNum = parseInt(key.substring(1));

      if (keyNum === 0) {
        // 第一个位置
        this.tmp_dalu_array[0][0] = this.res_dalu_obj_img[key];
        if (this.res_dalu_obj_num[key]) {
          this.tmp_dalu_array_num[0][0] = this.res_dalu_obj_num[key];
        }
      } else {
        // 判断是否换列
        const prevKey = `k${keyNum - 1}`;
        const currImg = this.res_dalu_obj_img[key];
        const prevImg = this.res_dalu_obj_img[prevKey];

        if (this.shouldChangeColumn(prevImg, currImg)) {
          col++;
          row = 0;
        } else {
          row++;
        }

        this.tmp_dalu_array[col][row] = currImg;
        if (this.res_dalu_obj_num[key]) {
          this.tmp_dalu_array_num[col][row] = this.res_dalu_obj_num[key];
        }
      }
    }

    this.showMsg("大路中间二维数组：");
    this.printArray2D(this.tmp_dalu_array);
  }

  /**
   * 设置三星路对象
   */
  private setSanxingObj(): void {
    const tmpObj: Record<string, 'red' | 'blue'> = {};
    const redArray = [1, 2, 3, 4, 13, 14, 15, 16];
    const blueArray = [5, 6, 7, 8];

    for (const key in this.res_dalu_obj_img) {
      const imgNum = this.res_dalu_obj_img[key];
      if (redArray.includes(imgNum)) {
        tmpObj[key] = 'red';
      } else if (blueArray.includes(imgNum)) {
        tmpObj[key] = 'blue';
      }
    }

    this.res_sanxing_obj_img = tmpObj;
    this.res_sanxing_obj_num = this.res_dalu_obj_num;

    this.showMsg("三星路对象：");
    this.showMsg(this.res_sanxing_obj_img);
  }

  /**
   * 设置大眼路对象
   */
  private setDayanObj(): void {
    this.res_dayan_obj = this.calculateDerivedRoad(1, 1, 2, 0, 1, 2);
    this.showMsg("大眼路对象：");
    this.showMsg(this.res_dayan_obj);
  }

  /**
   * 设置小路对象
   */
  private setXiaoluObj(): void {
    this.res_xiaolu_obj = this.calculateDerivedRoad(2, 1, 3, 0, 2, 3);
    this.showMsg("小路对象：");
    this.showMsg(this.res_xiaolu_obj);
  }

  /**
   * 设置蟑螂路对象
   */
  private setXiaoqiangObj(): void {
    this.res_xiaoqiang_obj = this.calculateDerivedRoad(3, 1, 4, 0, 3, 4);
    this.showMsg("蟑螂路对象：");
    this.showMsg(this.res_xiaoqiang_obj);
  }

  /**
   * 计算下三路通用方法
   */
  private calculateDerivedRoad(
    startX1: number, startY1: number,
    startX2: number, startY2: number,
    hangStep: number, lieStep: number
  ): Record<string, 'red' | 'blue'> {
    const result: Record<string, 'red' | 'blue'> = {};
    const tmpArray = this.tmp_dalu_array;

    // 检查起始位置
    if (tmpArray[startX1][startY1] === 'no_color' &&
        tmpArray[startX2][startY2] === 'no_color') {
      return result;
    }

    // 确定起始位置
    let startX = startX1;
    let startY = startY1;
    if (tmpArray[startX1][startY1] === 'no_color') {
      startX = startX2;
      startY = startY2;
    }

    let index = 0;

    // 处理起始列
    for (let y = startY; y < 99; y++) {
      if (tmpArray[startX][y] !== 'no_color') {
        if (y === 0) {
          result[`k${index}`] = this.useLie(startX, y, lieStep);
        } else {
          result[`k${index}`] = this.useDown(startX, y, hangStep);
        }
        index++;
      }
    }

    // 处理后续列
    for (let x = startX + 1; x < 99; x++) {
      for (let y = 0; y < 99; y++) {
        if (tmpArray[x][y] !== 'no_color') {
          if (y === 0) {
            result[`k${index}`] = this.useLie(x, y, lieStep);
          } else {
            result[`k${index}`] = this.useDown(x, y, hangStep);
          }
          index++;
        }
      }
    }

    return result;
  }

  /**
   * 换列规则
   */
  private useLie(x: number, y: number, lieStep: number): 'red' | 'blue' {
    const farCol = x - lieStep;
    const nearCol = x - 1;

    if (farCol < 0 || nearCol < 0) {
      return 'red';
    }

    const farLength = this.getColumnLength(this.tmp_dalu_array[farCol]);
    const nearLength = this.getColumnLength(this.tmp_dalu_array[nearCol]);

    return farLength === nearLength ? 'red' : 'blue';
  }

  /**
   * 向下规则
   */
  private useDown(x: number, y: number, hangStep: number): 'red' | 'blue' {
    const compareCol = x - hangStep;

    if (compareCol < 0) {
      return 'red';
    }

    const yBefore = y - 1;

    // 当前位置有数据
    if (this.tmp_dalu_array[compareCol][y] !== 'no_color') {
      return 'red';
    }

    // 直落（长庄或长闲）
    if (yBefore >= 0 &&
        this.tmp_dalu_array[compareCol][y] === 'no_color' &&
        this.tmp_dalu_array[compareCol][yBefore] === 'no_color') {
      return 'red';
    }

    // 出一个位置
    return 'blue';
  }

  // ==================== 私有方法 - 显示处理 ====================

  /**
   * 设置所有显示数据
   */
  private setAllDataTypeJustForShow(): void {
    this.showMsg("======== 设置显示数据 ========");

    // 设置珠盘显示
    this.setZhuziShow();

    // 设置三星显示
    this.setSanxingShow();

    // 设置大路显示（处理转弯）
    this.setDaluShow();

    // 设置下三路显示（处理转弯）
    this.setDerivedRoadShow();
  }

  /**
   * 设置珠盘显示
   */
  private setZhuziShow(): void {
    let i = 0;
    for (const key in this.res_zhuzi_obj) {
      const col = Math.floor(i / 6);
      const row = i % 6;
      this.show_zhuzi[col][row] = this.res_zhuzi_obj[key];
      i++;
    }
  }

  /**
   * 设置三星显示
   */
  private setSanxingShow(): void {
    let i = 0;
    for (const key in this.res_sanxing_obj_img) {
      const col = Math.floor(i / 3);
      const row = i % 3;
      this.show_sanxing_img[col][row] = this.res_sanxing_obj_img[key];
      if (this.res_sanxing_obj_num[key]) {
        this.show_sanxing_num[col][row] = this.res_sanxing_obj_num[key];
      }
      i++;
    }
  }

  /**
   * 设置大路显示
   */
  private setDaluShow(): void {
    this.show_dalu_img = this.setShowByArray(
      this.tmp_dalu_array,
      'dalu',
      this.tmp_dalu_array_num
    );
  }

  /**
   * 设置下三路显示
   */
  private setDerivedRoadShow(): void {
    // 转换对象到数组
    const tmpShowDayan = this.changeFromObjToArray(this.res_dayan_obj);
    const tmpShowXiaolu = this.changeFromObjToArray(this.res_xiaolu_obj);
    const tmpShowXiaoqiang = this.changeFromObjToArray(this.res_xiaoqiang_obj);

    // 处理转弯
    this.show_dayan = this.setShowByArray(tmpShowDayan, 'dayan', null);
    this.show_xiaolu = this.setShowByArray(tmpShowXiaolu, 'xiaolu', null);
    this.show_xiaoqiang = this.setShowByArray(tmpShowXiaoqiang, 'xiaoqiang', null);
  }

  /**
   * 从对象转换为数组
   */
  private changeFromObjToArray(obj: Record<string, any>): any[][] {
    const array = this.createArray2D(99, 99);
    let col = 0;
    let row = 0;

    for (const key in obj) {
      const keyNum = parseInt(key.substring(1));

      if (keyNum === 0) {
        array[0][0] = obj[key];
      } else {
        const prevKey = `k${keyNum - 1}`;
        if (obj[prevKey] !== obj[key]) {
          col++;
          row = 0;
        } else {
          row++;
        }
        array[col][row] = obj[key];
      }
    }

    return array;
  }

  /**
   * 处理显示数组（包括转弯）
   */
  private setShowByArray(
    orgArray: any[][],
    luType: string,
    orgArrayNum: any[][] | null
  ): any[][] {
    const tmpArrayImg = this.createArray2D(99, 6);
    const tmpArrayNum = this.createArray2D(99, 6);
    const tmpChangePoint = new Array(99).fill(5);
    const tmpUseFlag = this.createArray2D(99, 99);

    for (let i = 0; i < 99; i++) {
      let changePoint = 5;

      for (let j = 0; j < 99; j++) {
        if (orgArray[i][j] !== 'no_color' && orgArray[i][j] !== undefined) {
          // 更新转弯点
          if (j <= changePoint && tmpUseFlag[i][j] === 'use') {
            changePoint = j - 1;
          }

          if (j < changePoint) {
            // 正常下行
            tmpArrayImg[i][j] = orgArray[i][j];
            if (orgArrayNum && typeof orgArrayNum[i][j] === 'number') {
              tmpArrayNum[i][j] = orgArrayNum[i][j];
            }
            tmpUseFlag[i][j] = 'use';
          } else if (j >= changePoint) {
            // 转弯处理
            const changeStep = j - changePoint;
            const newI = i + changeStep;
            const newJ = changePoint;

            tmpArrayImg[newI][newJ] = orgArray[i][j];
            if (orgArrayNum && typeof orgArrayNum[i][j] === 'number') {
              tmpArrayNum[newI][newJ] = orgArrayNum[i][j];
            }
            tmpUseFlag[newI][newJ] = 'use';
            tmpUseFlag[i][j] = 'use';
          }
        }
      }

      tmpChangePoint[i] = changePoint;
    }

    // 保存转弯点
    switch (luType) {
      case 'dalu':
        this.change_point_dalu = tmpChangePoint;
        this.show_dalu_num = tmpArrayNum;
        break;
      case 'dayan':
        this.change_point_dayan = tmpChangePoint;
        break;
      case 'xiaolu':
        this.change_point_xiaolu = tmpChangePoint;
        break;
      case 'xiaoqiang':
        this.change_point_xiaoqiang = tmpChangePoint;
        break;
    }

    return tmpArrayImg;
  }

  // ==================== 私有方法 - 工具函数 ====================

  /**
   * 获取图片编号
   */
  private getImgNumber(result: number, ext: number): number {
    // 1-4: 庄, 5-8: 闲, 9-12: 和, 13-16: 幸运6, 17-32: 其他特殊
    const baseMap: Record<number, number> = {
      1: 1,  // 庄
      2: 5,  // 闲
      3: 9,  // 和
      4: 13, // 幸运6
      6: 25, // 小老虎
      7: 17, // 龙7
      8: 21, // 熊8
      9: 29  // 大老虎
    };

    const base = baseMap[result] || 1;
    return base + ext; // ext: 0=无对, 1=庄对, 2=闲对, 3=双对
  }

  /**
   * 判断是否换列
   */
  private shouldChangeColumn(img1: number, img2: number): boolean {
    const redArray = [1, 2, 3, 4, 13, 14, 15, 16, 17, 18, 19, 20, 25, 26, 27, 28, 29, 30, 31, 32];
    const blueArray = [5, 6, 7, 8, 21, 22, 23, 24];

    const isRed1 = redArray.includes(img1);
    const isBlue1 = blueArray.includes(img1);
    const isRed2 = redArray.includes(img2);
    const isBlue2 = blueArray.includes(img2);

    return (isRed1 && isBlue2) || (isBlue1 && isRed2);
  }

  /**
   * 获取列的有效长度
   */
  private getColumnLength(column: any[]): number {
    let length = 0;
    for (const item of column) {
      if (item !== 'no_color') {
        length++;
      } else {
        break;
      }
    }
    return length;
  }

  /**
   * 处理和局累计
   */
  private setHeSumByHeNum(heNum: Record<string, number>): Record<string, number> {
    const result: Record<string, number> = {};

    for (const key in heNum) {
      if (heNum[key] === 1) {
        const sum = this.sumHeByObjAndPosition(heNum, key);
        result[key] = sum;
      }
    }

    return result;
  }

  /**
   * 累计连续和局数量
   */
  private sumHeByObjAndPosition(heObj: Record<string, number>, startKey: string): number {
    const startNum = parseInt(startKey.substring(1));
    let sum = 0;

    for (let i = 0; i < 99; i++) {
      const currentKey = `k${startNum + i}`;
      if (heObj[currentKey] === 1) {
        sum++;
      } else {
        break;
      }
    }

    return sum;
  }

  /**
   * 打印二维数组
   */
  private printArray2D(array: any[][]): void {
    if (!this.isDebug) return;

    for (let i = 0; i < array.length; i++) {
      let hasData = false;
      let rowStr = '';

      for (let j = 0; j < array[i].length; j++) {
        if (array[i][j] !== 'no_color' && array[i][j] !== undefined) {
          hasData = true;
          rowStr += array[i][j] + ',';
        }
      }

      if (hasData) {
        this.showMsg(`第${i}列: ${rowStr}`);
      }
    }
  }

  // ==================== 私有方法 - 问路计算 ====================

  /**
   * 获取下一步预测
   */
  private getPredictionForNext(nextResult: 1 | 2): {
    bigEye: 'red' | 'blue';
    small: 'red' | 'blue';
    cockroach: 'red' | 'blue';
  } {
    // 模拟添加下一个结果
    const simulatedData = { ...this.res_org_obj };
    const nextKey = `k${Object.keys(simulatedData).length}`;
    simulatedData[nextKey] = { result: nextResult, ext: 0 };

    // 重新计算
    const tempCalc = new RoadmapCalculator();
    tempCalc.setDebug(false);
    tempCalc.calculateAll(simulatedData);

    // 获取最后一个位置的颜色
    const lastDayan = this.getLastColorFromObj(tempCalc.res_dayan_obj);
    const lastXiaolu = this.getLastColorFromObj(tempCalc.res_xiaolu_obj);
    const lastXiaoqiang = this.getLastColorFromObj(tempCalc.res_xiaoqiang_obj);

    return {
      bigEye: lastDayan || 'red',
      small: lastXiaolu || 'red',
      cockroach: lastXiaoqiang || 'red'
    };
  }

  /**
   * 获取对象最后一个颜色
   */
  private getLastColorFromObj(obj: Record<string, 'red' | 'blue'>): 'red' | 'blue' | null {
    const keys = Object.keys(obj);
    if (keys.length === 0) return null;

    const lastKey = keys[keys.length - 1];
    return obj[lastKey];
  }

  /**
   * 获取问路位置
   */
  private getWenluPosition(road: string, color: 'red' | 'blue'): WenluPosition {
    // 根据不同路单类型计算下一个位置
    // 这里简化处理，实际需要根据具体逻辑计算
    return {
      x: 0,
      y: 0,
      color: color
    };
  }

  // ==================== 私有方法 - 生成结果 ====================

  /**
   * 生成路单数据
   */
  private generateRoadmapData(): RoadmapData {
    return {
      beadPlate: this.generateBeadPlatePositions(),
      bigRoad: this.generateBigRoadPositions(),
      bigEyeRoad: this.generateDerivedPositions(this.show_dayan, 'bigEye'),
      smallRoad: this.generateDerivedPositions(this.show_xiaolu, 'small'),
      cockroachRoad: this.generateDerivedPositions(this.show_xiaoqiang, 'cockroach'),
      sanxing: this.generateSanxingPositions()
    };
  }

  /**
   * 生成珠盘路位置数据
   */
  private generateBeadPlatePositions(): BeadPlatePosition[] {
    const positions: BeadPlatePosition[] = [];
    let index = 0;

    for (const key in this.res_org_obj) {
      const col = Math.floor(index / 6);
      const row = index % 6;
      const original = this.res_org_obj[key];

      // 转换结果
      let result: 1 | 2 | 3 = original.result as any;
      if (original.result === 4 || original.result === 6 ||
          original.result === 7 || original.result === 9) {
        result = 1;
      } else if (original.result === 8) {
        result = 2;
      } else if (original.result === 3) {
        result = 3;
      }

      positions.push({
        col,
        row,
        result_original: original.result,
        result,
        ext: original.ext,
        left: col * this.gridSizes.beadPlate + 5,
        top: row * this.gridSizes.beadPlate + 5
      });

      index++;
    }

    return positions;
  }

  /**
   * 生成大路位置数据
   */
  private generateBigRoadPositions(): BigRoadPosition[] {
    const positions: BigRoadPosition[] = [];

    for (let col = 0; col < 99; col++) {
      for (let row = 0; row < 6; row++) {
        if (this.show_dalu_img[col][row] !== 'no_color') {
          const imgNum = this.show_dalu_img[col][row] as number;
          const tieCount = this.show_dalu_num[col][row];

          // 从图片编号推断结果
          const result: 1 | 2 = imgNum <= 4 ? 1 : 2;

          // 从图片编号推断对子信息
          const ext = ((imgNum - 1) % 4) as 0 | 1 | 2 | 3;

          positions.push({
            col,
            row,
            result,
            ext,
            tieCount: typeof tieCount === 'number' ? tieCount : undefined,
            left: col * this.gridSizes.bigRoad + 5,
            top: row * this.gridSizes.bigRoad + 5
          });
        }
      }
    }

    return positions;
  }

  /**
   * 生成下三路位置数据
   */
  private generateDerivedPositions(
    showArray: any[][],
    type: 'bigEye' | 'small' | 'cockroach'
  ): DerivedRoadPosition[] {
    const positions: DerivedRoadPosition[] = [];
    const gridSize = type === 'bigEye' ? this.gridSizes.bigEyeRoad :
                     type === 'small' ? this.gridSizes.smallRoad :
                     this.gridSizes.cockroachRoad;

    for (let col = 0; col < 99; col++) {
      for (let row = 0; row < 6; row++) {
        if (showArray[col][row] !== 'no_color') {
          const color = showArray[col][row];
          const result: 1 | 2 = color === 'red' ? 1 : 2;

          positions.push({
            col,
            row,
            result,
            left: col * gridSize + 2,
            top: row * gridSize + 2
          });
        }
      }
    }

    return positions;
  }

  /**
   * 生成三星路位置数据
   */
  private generateSanxingPositions(): DerivedRoadPosition[] {
    const positions: DerivedRoadPosition[] = [];

    for (let col = 0; col < 99; col++) {
      for (let row = 0; row < 3; row++) {
        if (this.show_sanxing_img[col][row] !== 'no_color') {
          const color = this.show_sanxing_img[col][row];
          const result: 1 | 2 = color === 'red' ? 1 : 2;

          positions.push({
            col,
            row,
            result,
            left: col * this.gridSizes.sanxing + 5,
            top: row * this.gridSizes.sanxing + 5
          });
        }
      }
    }

    return positions;
  }

  // ==================== 调试输出 ====================

  /**
   * 打印所有调试信息
   */
  private printAllDebugInfo(): void {
    if (!this.isDebug) return;

    this.showMsg("======================================");
    this.showMsg("========== 所有中间数据打印 ==========");
    this.showMsg("======================================");

    this.showMsg("原始数据：");
    this.showMsg(this.res_org_obj);

    this.showMsg("珠盘对象：");
    this.showMsg(this.res_zhuzi_obj);

    this.showMsg("大路图片对象（压缩前）：");
    this.showMsg(this.res_dalu_obj_img_before);

    this.showMsg("大路数字对象（压缩前）：");
    this.showMsg(this.res_dalu_obj_num_before);

    this.showMsg("大路图片对象（压缩后）：");
    this.showMsg(this.res_dalu_obj_img);

    this.showMsg("大路数字对象（压缩后）：");
    this.showMsg(this.res_dalu_obj_num);

    this.showMsg("大眼路对象：");
    this.showMsg(this.res_dayan_obj);

    this.showMsg("小路对象：");
    this.showMsg(this.res_xiaolu_obj);

    this.showMsg("蟑螂路对象：");
    this.showMsg(this.res_xiaoqiang_obj);

    this.showMsg("三星路图片对象：");
    this.showMsg(this.res_sanxing_obj_img);

    this.showMsg("三星路数字对象：");
    this.showMsg(this.res_sanxing_obj_num);

    this.showMsg("大路中间二维数组：");
    this.printArray2D(this.tmp_dalu_array);

    this.showMsg("珠盘显示数组：");
    this.printArray2D(this.show_zhuzi);

    this.showMsg("大路显示数组：");
    this.printArray2D(this.show_dalu_img);

    this.showMsg("大眼路显示数组：");
    this.printArray2D(this.show_dayan);

    this.showMsg("小路显示数组：");
    this.printArray2D(this.show_xiaolu);

    this.showMsg("蟑螂路显示数组：");
    this.printArray2D(this.show_xiaoqiang);

    this.showMsg("三星路显示数组：");
    this.printArray2D(this.show_sanxing_img);

    this.showMsg("转弯节点 - 大路：");
    this.showMsg(this.change_point_dalu);

    this.showMsg("转弯节点 - 大眼路：");
    this.showMsg(this.change_point_dayan);

    this.showMsg("转弯节点 - 小路：");
    this.showMsg(this.change_point_xiaolu);

    this.showMsg("转弯节点 - 蟑螂路：");
    this.showMsg(this.change_point_xiaoqiang);
  }
}

// 导出单例
export default new RoadmapCalculator();
