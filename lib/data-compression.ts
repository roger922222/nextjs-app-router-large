// lib/data-compression.ts
/**
 * 数据传输优化工具
 * 实现数据压缩、分页、批处理等功能
 */

import zlib from 'zlib';

// 压缩配置接口
interface CompressionConfig {
  type: 'gzip' | 'deflate' | 'brotli';
  level?: number;
  threshold?: number;
}

// 分页配置接口
interface PaginationConfig {
  page: number;
  pageSize: number;
  totalItems?: number;
  totalPages?: number;
}

// 分页结果接口
interface PaginationResult<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

// 批量请求配置
interface BatchRequestConfig {
  batchSize?: number;
  delay?: number;
  timeout?: number;
  retries?: number;
}

/**
 * 数据压缩管理器
 */
export class DataCompressionManager {
  private config: CompressionConfig;

  constructor(config: CompressionConfig = { type: 'gzip', level: 6, threshold: 1024 }) {
    this.config = config;
  }

  /**
   * 压缩数据
   */
  compress(data: any): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const dataBuffer = Buffer.from(JSON.stringify(data));
      
      // 小数据直接返回，不压缩
      if (dataBuffer.length < (this.config.threshold || 1024)) {
        resolve(dataBuffer);
        return;
      }

      switch (this.config.type) {
        case 'gzip':
          zlib.gzip(dataBuffer, { level: this.config.level || zlib.constants.Z_DEFAULT_COMPRESSION }, (err, result) => {
            if (err) reject(err);
            resolve(result);
          });
          break;

        case 'deflate':
          zlib.deflate(dataBuffer, { level: this.config.level || zlib.constants.Z_DEFAULT_COMPRESSION }, (err, result) => {
            if (err) reject(err);
            resolve(result);
          });
          break;

        case 'brotli':
          if ('brotliCompress' in zlib) {
            zlib.brotliCompress(dataBuffer, { quality: this.config.level || 6 }, (err, result) => {
              if (err) reject(err);
              resolve(result);
            });
          } else {
            // Fallback to gzip if brotli not supported
            zlib.gzip(dataBuffer, (err, result) => {
              if (err) reject(err);
              resolve(result);
            });
          }
          break;

        default:
          resolve(dataBuffer);
      }
    });
  }

  /**
   * 解压数据
   */
  decompress(buffer: Buffer): Promise<any> {
    return new Promise((resolve, reject) => {
      // 尝试检测压缩类型
      const magicNumber = buffer.slice(0, 2).toString('hex');
      
      let decompressFn: (buf: Buffer, cb: (err: Error | null, result: Buffer) => void) => void;

      if (magicNumber === '1f8b') {
        // Gzip
        decompressFn = zlib.gunzip;
      } else if (magicNumber === '789c') {
        // Deflate
        decompressFn = zlib.inflate;
      } else if ('brotliDecompress' in zlib && magicNumber.startsWith('1890')) {
        // Brotli
        decompressFn = zlib.brotliDecompress as any;
      } else {
        // 未压缩数据
        try {
          resolve(JSON.parse(buffer.toString()));
          return;
        } catch (error) {
          reject(new Error('Failed to parse uncompressed data'));
          return;
        }
      }

      decompressFn(buffer, (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        try {
          resolve(JSON.parse(result.toString()));
        } catch (error) {
          reject(new Error('Failed to parse decompressed data'));
        }
      });
    });
  }

  /**
   * 智能压缩策略
   */
  getOptimalCompressionType(): 'gzip' | 'deflate' | 'brotli' {
    // 检查Node.js版本是否支持brotli
    if ('brotliCompress' in zlib) {
      return 'brotli'; // Brotli压缩率更高
    }
    return 'gzip'; // 兼容性最好
  }

  /**
   * 计算压缩率
   */
  calculateCompressionRate(original: any, compressed: Buffer): number {
    const originalSize = Buffer.from(JSON.stringify(original)).length;
    const compressedSize = compressed.length;
    return ((originalSize - compressedSize) / originalSize) * 100;
  }
}

/**
 * 数据分页管理器
 */
export class DataPaginationManager {
  /**
   * 分页处理
   */
  paginate<T>(
    data: T[],
    config: PaginationConfig
  ): PaginationResult<T> {
    const { page, pageSize, totalItems } = config;
    const safePage = Math.max(1, page);
    const safePageSize = Math.max(1, Math.min(pageSize, 100)); // 限制最大页大小
    
    const total = totalItems || data.length;
    const startIndex = (safePage - 1) * safePageSize;
    const endIndex = startIndex + safePageSize;
    
    const paginatedData = data.slice(startIndex, endIndex);
    const totalPages = Math.ceil(total / safePageSize);
    
    return {
      data: paginatedData,
      pagination: {
        page: safePage,
        pageSize: safePageSize,
        totalItems: total,
        totalPages,
        hasNext: safePage < totalPages,
        hasPrevious: safePage > 1
      }
    };
  }

  /**
   * 生成分页元数据
   */
  generatePaginationMetadata(
    page: number,
    pageSize: number,
    totalItems: number
  ) {
    const totalPages = Math.ceil(totalItems / pageSize);
    
    return {
      page,
      pageSize,
      totalItems,
      totalPages,
      hasNext: page < totalPages,
      hasPrevious: page > 1,
      links: {
        self: this.generatePageLink(page, pageSize),
        first: this.generatePageLink(1, pageSize),
        last: this.generatePageLink(totalPages, pageSize),
        next: page < totalPages ? this.generatePageLink(page + 1, pageSize) : null,
        prev: page > 1 ? this.generatePageLink(page - 1, pageSize) : null
      }
    };
  }

  private generatePageLink(page: number, pageSize: number): string {
    return `?page=${page}&pageSize=${pageSize}`;
  }
}

/**
 * 批量请求管理器
 */
export class BatchRequestManager {
  private config: BatchRequestConfig = {
    batchSize: 10,
    delay: 50,
    timeout: 30000,
    retries: 3
  };

  constructor(config?: BatchRequestConfig) {
    this.config = { ...this.config, ...config };
  }

  /**
   * 执行批量请求
   */
  async executeBatchRequests<T>(
    requests: Array<() => Promise<T>>,
    config?: Partial<BatchRequestConfig>
  ): Promise<T[]> {
    const batchConfig = { ...this.config, ...config };
    const results: T[] = [];
    let retryCount = 0;

    // 分批处理请求
    for (let i = 0; i < requests.length; i += batchConfig.batchSize!) {
      const batch = requests.slice(i, i + batchConfig.batchSize!);
      
      try {
        const batchResults = await Promise.all(batch.map(request => request()));
        results.push(...batchResults);
        
        // 添加延迟，避免服务器过载
        if (i + batchConfig.batchSize! < requests.length) {
          await new Promise(resolve => setTimeout(resolve, batchConfig.delay!));
        }
      } catch (error) {
        retryCount++;
        
        if (retryCount > batchConfig.retries!) {
          throw new Error(`Batch request failed after ${retryCount} retries`);
        }
        
        // 重试当前批次
        i -= batchConfig.batchSize!;
      }
    }

    return results;
  }
}