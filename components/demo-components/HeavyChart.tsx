// components/demo-components/HeavyChart.tsx
"use client";

import { useEffect, useState } from 'react';

export default function HeavyChart() {
  const [data, setData] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 模拟大数据处理
  useEffect(() => {
    const generateData = () => {
      // 模拟复杂的计算
      const newData = Array.from({ length: 1000 }, (_, i) => 
        Math.sin(i * 0.01) * 50 + Math.random() * 20
      );
      setData(newData);
      setIsLoading(false);
    };

    // 模拟加载延迟
    const timer = setTimeout(generateData, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="heavy-chart-loading">
        <div className="loading-spinner"></div>
        <p>正在生成图表数据...</p>
      </div>
    );
  }

  return (
    <div className="heavy-chart">
      <div className="chart-header">
        <h3>📊 复杂图表组件</h3>
        <p>模拟大数据可视化，包含1000个数据点</p>
      </div>
      
      <div className="chart-container">
        <svg width="100%" height="300" viewBox="0 0 800 300">
          {/* 网格线 */}
          <defs>
            <pattern id="grid" width="40" height="30" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 30" fill="none" stroke="#e0e0e0" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          {/* 数据线条 */}
          <polyline
            fill="none"
            stroke="#667eea"
            strokeWidth="2"
            points={data.map((value, index) => 
              `${(index / data.length) * 800},${150 - value}`
            ).join(' ')}
          />
          
          {/* 数据点 */}
          {data.slice(0, 50).map((value, index) => (
            <circle
              key={index}
              cx={(index / 50) * 800}
              cy={150 - value}
              r="3"
              fill="#764ba2"
              opacity="0.7"
            />
          ))}
        </svg>
      </div>
      
      <div className="chart-stats">
        <div className="stat-item">
          <span className="stat-label">数据点数量:</span>
          <span className="stat-value">{data.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">最大值:</span>
          <span className="stat-value">{Math.max(...data).toFixed(2)}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">最小值:</span>
          <span className="stat-value">{Math.min(...data).toFixed(2)}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">平均值:</span>
          <span className="stat-value">{(data.reduce((a, b) => a + b, 0) / data.length).toFixed(2)}</span>
        </div>
      </div>

      <style jsx>{`
        .heavy-chart {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .chart-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .chart-header h3 {
          color: #333;
          margin-bottom: 0.5rem;
          font-size: 1.5rem;
        }

        .chart-header p {
          color: #666;
          font-size: 0.95rem;
          margin: 0;
        }

        .chart-container {
          margin-bottom: 2rem;
          background: #f8f9fa;
          border-radius: 8px;
          padding: 1rem;
        }

        .chart-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
        }

        .stat-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem;
          background: #f8f9fa;
          border-radius: 6px;
        }

        .stat-label {
          color: #666;
          font-size: 0.9rem;
        }

        .stat-value {
          color: #333;
          font-weight: 600;
          font-size: 1rem;
        }

        .heavy-chart-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 300px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }

        .heavy-chart-loading p {
          color: #666;
          font-size: 1rem;
          margin: 0;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (prefers-color-scheme: dark) {
          .heavy-chart {
            background: #2a2a2a;
          }

          .chart-header h3 {
            color: #ffffff;
          }

          .chart-header p {
            color: #cccccc;
          }

          .chart-container {
            background: #1a1a1a;
          }

          .stat-item {
            background: #1a1a1a;
          }

          .stat-label {
            color: #cccccc;
          }

          .stat-value {
            color: #ffffff;
          }

          .heavy-chart-loading {
            background: #2a2a2a;
          }

          .heavy-chart-loading p {
            color: #cccccc;
          }
        }
      `}</style>
    </div>
  );
}