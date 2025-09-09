// src/utils/roadmapCalculator.ts

/**
 * 百家乐路单计算器
 * 包含珠盘路、大路、大眼路、小路、蟑螂路的计算逻辑
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
  color: string;    // 颜色 'red'/'blue'/'green'
  ext: number;      // 对子信息
  tie?: number;     // 和的数量（大路使用）
}

export interface AbsolutePosition extends Position {
  left: number;     // 像素左边距
  top: number;      // 像素上边距
  id: string;       // 唯一标识
}

export interface RoadmapData {
  beadPlate: AbsolutePosition[];      // 珠盘路
  bigRoad: AbsolutePosition[];        // 大路
  bigEyeRoad: AbsolutePosition[];     // 大眼路
  smallRoad: AbsolutePosition[];      // 小路
  cockroachRoad: AbsolutePosition[];  // 蟑螂路
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

// ==================== 主类 ====================
export class RoadmapCalculator {
  private gridSizes = {
    beadPlate: 30,
    bigRoad: 25,
    bigEyeRoad: 12,
    smallRoad: 12,
    cockroachRoad: 12
  };

  private maxRows = {
    beadPlate: 6,
    bigRoad: 6,
    bigEyeRoad: 6,
    smallRoad: 6,
    cockroachRoad: 6
  };

  // ==================== 公共方法 ====================

  /**
   * 计算所有路单
   */
  calculateAll(data: Record<string, GameResult>): RoadmapData {
    const beadPlate = this.calculateBeadPlate(data);
    const bigRoadRaw = this.calculateBigRoadRaw(data);
    const bigRoad = this.processBigRoadWithTurning(bigRoadRaw);
    const bigEyeRoad = this.calculateDerivedRoad(bigRoadRaw, 1, 1);
    const smallRoad = this.calculateDerivedRoad(bigRoadRaw, 2, 1);
    const cockroachRoad = this.calculateDerivedRoad(bigRoadRaw, 3, 1);

    return {
      beadPlate: this.toAbsolutePositions(beadPlate, 'beadPlate'),
      bigRoad: this.toAbsolutePositions(bigRoad, 'bigRoad'),
      bigEyeRoad: this.toAbsolutePositions(bigEyeRoad, 'bigEyeRoad'),
      smallRoad: this.toAbsolutePositions(smallRoad, 'smallRoad'),
      cockroachRoad: this.toAbsolutePositions(cockroachRoad, 'cockroachRoad')
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

      // 统计输赢
      if (item.result === 1) stats.banker++;
      else if (item.result === 2) stats.player++;
      else if (item.result === 3) stats.tie++;

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
    const bigRoadRaw = this.calculateBigRoadRaw(data);

    // 模拟下一局开庄
    const bankerSimulation = this.simulateNextResult(bigRoadRaw, 'red');
    // 模拟下一局开闲
    const playerSimulation = this.simulateNextResult(bigRoadRaw, 'blue');

    return {
      banker: {
        bigEye: this.predictDerivedRoad(bankerSimulation, 1, 1),
        small: this.predictDerivedRoad(bankerSimulation, 2, 1),
        cockroach: this.predictDerivedRoad(bankerSimulation, 3, 1)
      },
      player: {
        bigEye: this.predictDerivedRoad(playerSimulation, 1, 1),
        small: this.predictDerivedRoad(playerSimulation, 2, 1),
        cockroach: this.predictDerivedRoad(playerSimulation, 3, 1)
      }
    };
  }

  // ==================== 珠盘路 ====================

  private calculateBeadPlate(data: Record<string, GameResult>): Position[] {
    const positions: Position[] = [];
    let index = 0;

    Object.entries(data).forEach(([key, item]) => {
      const col = Math.floor(index / 6);
      const row = index % 6;

      positions.push({
        col,
        row,
        value: this.getResultText(item.result),
        color: this.getResultColor(item.result),
        ext: item.ext
      });

      index++;
    });

    return positions;
  }

  // ==================== 大路 ====================

  private calculateBigRoadRaw(data: Record<string, GameResult>): Position[][] {
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

    return grid;
  }

  private processBigRoadWithTurning(grid: Position[][]): Position[] {
    const result: Position[] = [];
    const maxRow = 5; // 第6行开始转弯

    grid.forEach((column, colIndex) => {
      column.forEach((item, rowIndex) => {
        if (!item) return;

        let finalCol = colIndex;
        let finalRow = rowIndex;

        // 处理转弯
        if (rowIndex > maxRow) {
          const offset = rowIndex - maxRow;
          finalCol = colIndex + offset;
          finalRow = maxRow;
        }

        result.push({
          ...item,
          col: finalCol,
          row: finalRow
        });
      });
    });

    return result;
  }

  // ==================== 下三路（大眼、小路、蟑螂） ====================

  private calculateDerivedRoad(bigRoadGrid: Position[][], colGap: number, rowGap: number): Position[] {
    const result: Position[] = [];
    const startCol = colGap;

    // 从指定列开始
    for (let col = startCol; col < bigRoadGrid.length; col++) {
      const column = bigRoadGrid[col] || [];

      column.forEach((item, row) => {
        if (!item) return;

        let color: 'red' | 'blue';

        if (row === 0) {
          // 换列判断
          color = this.compareCols(bigRoadGrid, col, colGap);
        } else {
          // 向下判断
          color = this.compareDown(bigRoadGrid, col, row, colGap);
        }

        result.push({
          col: col - startCol,
          row,
          value: '',
          color,
          ext: 0
        });
      });
    }

    return result;
  }

  private compareCols(grid: Position[][], currentCol: number, gap: number): 'red' | 'blue' {
    const col1 = grid[currentCol - 1] || [];
    const col2 = grid[currentCol - gap - 1] || [];

    return col1.length === col2.length ? 'red' : 'blue';
  }

  private compareDown(grid: Position[][], col: number, row: number, gap: number): 'red' | 'blue' {
    const compareCol = grid[col - gap] || [];

    // 检查对应位置是否有数据
    if (compareCol[row]) {
      return 'red';
    }

    // 检查是否是直落
    if (!compareCol[row] && !compareCol[row - 1]) {
      return 'red';
    }

    return 'blue';
  }

  // ==================== 预测辅助 ====================

  private simulateNextResult(grid: Position[][], color: 'red' | 'blue'): Position[][] {
    const newGrid = JSON.parse(JSON.stringify(grid)); // 深拷贝
    const lastCol = newGrid.length - 1;
    const lastItem = newGrid[lastCol]?.[newGrid[lastCol].length - 1];

    if (!lastItem) return newGrid;

    const mockResult: Position = {
      col: 0,
      row: 0,
      value: color === 'red' ? 'B' : 'P',
      color,
      ext: 0
    };

    // 判断是否需要换列
    if (lastItem.color === color) {
      // 同色，向下
      newGrid[lastCol].push(mockResult);
    } else {
      // 不同色，换列
      newGrid.push([mockResult]);
    }

    return newGrid;
  }

  private predictDerivedRoad(grid: Position[][], colGap: number, rowGap: number): 'red' | 'blue' {
    const lastCol = grid.length - 1;
    const lastRow = (grid[lastCol]?.length || 1) - 1;

    if (lastRow === 0) {
      return this.compareCols(grid, lastCol, colGap);
    } else {
      return this.compareDown(grid, lastCol, lastRow, colGap);
    }
  }

  // ==================== 工具方法 ====================

  private getResultText(result: number): string {
    switch(result) {
      case 1: return 'B';
      case 2: return 'P';
      case 3: return 'T';
      default: return '';
    }
  }

  private getResultColor(result: number): string {
    switch(result) {
      case 1: return '#EC2024'; // 庄-红色
      case 2: return '#2E83FF'; // 闲-蓝色
      case 3: return '#159252'; // 和-绿色
      default: return '#666666';
    }
  }

  private getColorType(result: number): 'red' | 'blue' | 'green' {
    switch(result) {
      case 1: return 'red';
      case 2: return 'blue';
      case 3: return 'green';
      default: return 'red';
    }
  }

  private toAbsolutePositions(positions: Position[], roadType: keyof typeof this.gridSizes): AbsolutePosition[] {
    const gridSize = this.gridSizes[roadType];

    return positions.map((pos, index) => ({
      ...pos,
      left: pos.col * gridSize,
      top: pos.row * gridSize,
      id: `${roadType}-${pos.col}-${pos.row}-${index}`
    }));
  }
}

// 导出单例
export default new RoadmapCalculator();
