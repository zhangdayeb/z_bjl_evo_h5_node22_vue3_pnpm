// src/utils/roadmapCalculator.ts

/**
 * 百家乐路单计算器
 */

// ==================== 类型定义 ====================
export interface GameResult {
  result: 1 | 2 | 3;  // 1=庄(B), 2=闲(P), 3=和(T)
  ext: 0 | 1 | 2 | 3; // 0=无对子, 1=庄对, 2=闲对, 3=双对
}

export interface Position {
  col: number;      // 列位置
  row: number;      // 行位置
  value: string;    // 显示值 'B'/'P'/'T'
  color: string;    // 颜色
  ext: number;      // 对子信息
  tie?: number;     // 和的数量
  left?: number;    // 像素左边距
  top?: number;     // 像素上边距
  id?: string;      // 唯一标识
}

export interface RoadmapData {
  beadPlate: Position[];      // 珠盘路
  bigRoad: Position[];        // 大路
  bigEyeRoad: Position[];     // 大眼路
  smallRoad: Position[];      // 小路
  cockroachRoad: Position[];  // 蟑螂路
}

export interface Statistics {
  total: number;
  banker: number;
  player: number;
  tie: number;
  bankerPair: number;
  playerPair: number;
}

export interface Prediction {
  banker: {
    bigEye: string;
    small: string;
    cockroach: string;
  };
  player: {
    bigEye: string;
    small: string;
    cockroach: string;
  };
}

// ==================== 主类 ====================
export class RoadmapCalculator {
  // 模拟数据
  private mockData: Record<string, GameResult> = {
    "k0":{"result":1,"ext":0},"k1":{"result":1,"ext":1},"k2":{"result":1,"ext":2},
    "k3":{"result":1,"ext":3},"k4":{"result":2,"ext":0},"k5":{"result":1,"ext":0},
    "k6":{"result":1,"ext":0},"k7":{"result":1,"ext":0},"k8":{"result":1,"ext":0},
    "k9":{"result":2,"ext":0},"k10":{"result":2,"ext":0},"k11":{"result":2,"ext":1},
    "k12":{"result":1,"ext":1},"k13":{"result":2,"ext":0},"k14":{"result":2,"ext":0},
    "k15":{"result":2,"ext":0},"k16":{"result":1,"ext":0},"k17":{"result":2,"ext":0},
    "k18":{"result":2,"ext":0},"k19":{"result":2,"ext":0},"k20":{"result":1,"ext":2},
    "k21":{"result":3,"ext":0},"k22":{"result":3,"ext":1},"k23":{"result":3,"ext":0},
    "k24":{"result":2,"ext":0},"k25":{"result":1,"ext":1},"k26":{"result":1,"ext":0},
    "k27":{"result":1,"ext":0},"k28":{"result":1,"ext":0},"k29":{"result":1,"ext":0},
    "k30":{"result":1,"ext":3},"k31":{"result":2,"ext":0},"k32":{"result":1,"ext":2},
    "k33":{"result":1,"ext":0},"k34":{"result":3,"ext":0},"k35":{"result":2,"ext":2},
    "k36":{"result":2,"ext":0},"k37":{"result":1,"ext":0},"k38":{"result":1,"ext":0},
    "k39":{"result":1,"ext":0},"k40":{"result":1,"ext":0},"k41":{"result":1,"ext":0},
    "k42":{"result":3,"ext":0},"k43":{"result":1,"ext":0},"k44":{"result":2,"ext":0},
    "k45":{"result":2,"ext":3},"k46":{"result":2,"ext":0},"k47":{"result":1,"ext":0},
    "k48":{"result":1,"ext":0},"k49":{"result":1,"ext":0}
  };

  // 调整网格大小以适应6行布局
  private gridSizes = {
    beadPlate: 30,      // 珠盘路
    bigRoad: 20,        // 大路 - 适应6行 (125px可用高度 / 6 ≈ 20px)
    bigEyeRoad: 10,     // 大眼路 - 适应6行 (63px可用高度 / 6 ≈ 10px)
    smallRoad: 10,      // 小路
    cockroachRoad: 10   // 蟑螂路
  };

  // 最大行数限制
  private maxRows = {
    beadPlate: 6,
    bigRoad: 6,
    bigEyeRoad: 6,
    smallRoad: 6,
    cockroachRoad: 6
  };

  // ==================== 公共方法 ====================

  /**
   * 获取模拟数据
   */
  getMockData(): Record<string, GameResult> {
    return { ...this.mockData };
  }

  /**
   * 添加新结果
   */
  addResult(currentData: Record<string, GameResult>, result: GameResult): Record<string, GameResult> {
    const newKey = `k${Object.keys(currentData).length}`;
    return {
      ...currentData,
      [newKey]: result
    };
  }

  /**
   * 计算所有路单
   */
  calculateAll(data: Record<string, GameResult>): RoadmapData {
    return {
      beadPlate: this.calculateBeadPlate(data),
      bigRoad: this.calculateBigRoad(data),
      bigEyeRoad: this.calculateDerivedRoad(data, 'bigEye'),
      smallRoad: this.calculateDerivedRoad(data, 'small'),
      cockroachRoad: this.calculateDerivedRoad(data, 'cockroach')
    };
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

      if (item.result === 1) stats.banker++;
      else if (item.result === 2) stats.player++;
      else if (item.result === 3) stats.tie++;

      if (item.ext === 1 || item.ext === 3) stats.bankerPair++;
      if (item.ext === 2 || item.ext === 3) stats.playerPair++;
    });

    return stats;
  }

  /**
   * 计算预测
   */
  calculatePredictions(data: Record<string, GameResult>): Prediction {
    // 简化的预测逻辑
    return {
      banker: {
        bigEye: '#EC2024',
        small: '#EC2024',
        cockroach: '#2E83FF'
      },
      player: {
        bigEye: '#2E83FF',
        small: '#2E83FF',
        cockroach: '#EC2024'
      }
    };
  }

  // ==================== 私有方法 ====================

  /**
   * 计算珠盘路
   */
  private calculateBeadPlate(data: Record<string, GameResult>): Position[] {
    const positions: Position[] = [];
    let index = 0;

    Object.entries(data).forEach(([key, item]) => {
      const col = Math.floor(index / this.maxRows.beadPlate);
      const row = index % this.maxRows.beadPlate;

      positions.push({
        col,
        row,
        value: this.getResultText(item.result),
        color: this.getResultColor(item.result),
        ext: item.ext,
        left: col * this.gridSizes.beadPlate + 5,  // 加上padding偏移
        top: row * this.gridSizes.beadPlate + 5,
        id: `bead-${col}-${row}`
      });

      index++;
    });

    return positions;
  }

  /**
   * 计算大路
   */
  private calculateBigRoad(data: Record<string, GameResult>): Position[] {
    const positions: Position[] = [];
    const grid: Position[][] = [];
    let currentCol = -1;
    let currentRow = 0;
    let lastResult: number | null = null;
    let tieCount = 0;

    Object.entries(data).forEach(([key, item]) => {
      // 和局特殊处理
      if (item.result === 3) {
        tieCount++;
        if (grid[currentCol] && grid[currentCol][currentRow]) {
          grid[currentCol][currentRow].tie = (grid[currentCol][currentRow].tie || 0) + 1;
        }
        return;
      }

      // 判断是否换列
      if (lastResult === null || this.getColorType(item.result) !== this.getColorType(lastResult)) {
        currentCol++;
        currentRow = 0;
        grid[currentCol] = [];
      } else {
        currentRow++;
      }

      // 添加到网格
      if (!grid[currentCol]) grid[currentCol] = [];

      grid[currentCol][currentRow] = {
        col: currentCol,
        row: currentRow,
        value: this.getResultText(item.result),
        color: this.getResultColor(item.result),
        ext: item.ext,
        tie: tieCount > 0 ? tieCount : undefined
      };

      lastResult = item.result;
      tieCount = 0;
    });

    // 转换为一维数组并处理转弯
    grid.forEach((column, colIndex) => {
      column.forEach((item, rowIndex) => {
        if (!item) return;

        let finalCol = colIndex;
        let finalRow = rowIndex;

        // 第6行开始转弯
        if (rowIndex >= this.maxRows.bigRoad) {
          const offset = rowIndex - this.maxRows.bigRoad + 1;
          finalCol = colIndex + offset;
          finalRow = this.maxRows.bigRoad - 1;
        }

        // 确保不超出最大行数
        finalRow = Math.min(finalRow, this.maxRows.bigRoad - 1);

        positions.push({
          ...item,
          col: finalCol,
          row: finalRow,
          left: finalCol * this.gridSizes.bigRoad + 4,  // 加上padding偏移
          top: finalRow * this.gridSizes.bigRoad + 4,
          id: `big-${finalCol}-${finalRow}`
        });
      });
    });

    return positions;
  }

  /**
   * 计算下三路
   */
  private calculateDerivedRoad(data: Record<string, GameResult>, type: 'bigEye' | 'small' | 'cockroach'): Position[] {
    const positions: Position[] = [];
    const gridSize = this.gridSizes[type === 'bigEye' ? 'bigEyeRoad' : type === 'small' ? 'smallRoad' : 'cockroachRoad'];
    const maxRow = this.maxRows[type === 'bigEye' ? 'bigEyeRoad' : type === 'small' ? 'smallRoad' : 'cockroachRoad'];

    // 简化的下三路逻辑，使用模拟数据
    let col = 0;
    let row = 0;

    Object.entries(data).slice(0, 30).forEach(([_key, _item], index) => {
      // 使用下划线前缀表示这些变量是故意不使用的
      if (row >= maxRow) {
        col++;
        row = 0;
      }

      const color = index % 3 === 0 ? '#EC2024' : '#2E83FF';

      positions.push({
        col,
        row,
        value: '',
        color,
        ext: 0,
        left: col * gridSize + 2,
        top: row * gridSize + 2,
        id: `${type}-${col}-${row}`
      });

      row++;
    });

    return positions;
  }

  /**
   * 获取结果文本
   */
  private getResultText(result: number): string {
    switch(result) {
      case 1: return 'B';
      case 2: return 'P';
      case 3: return 'T';
      default: return '';
    }
  }

  /**
   * 获取结果颜色
   */
  private getResultColor(result: number): string {
    switch(result) {
      case 1: return '#EC2024'; // 庄-红色
      case 2: return '#2E83FF'; // 闲-蓝色
      case 3: return '#159252'; // 和-绿色
      default: return '#666666';
    }
  }

  /**
   * 获取颜色类型
   */
  private getColorType(result: number): 'red' | 'blue' | 'green' {
    switch(result) {
      case 1: return 'red';
      case 2: return 'blue';
      case 3: return 'green';
      default: return 'red';
    }
  }
}

// 导出单例
export default new RoadmapCalculator();
