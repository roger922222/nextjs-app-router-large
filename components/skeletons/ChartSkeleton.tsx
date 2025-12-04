// components/skeletons/ChartSkeleton.tsx
"use client";

export function ChartSkeleton() {
  return (
    <div className="chart-skeleton">
      <div className="skeleton-header">
        <div className="skeleton-title"></div>
        <div className="skeleton-subtitle"></div>
      </div>
      <div className="skeleton-chart-area">
        <div className="skeleton-chart-bars">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="skeleton-bar" style={{ height: `${Math.random() * 60 + 20}%` }}></div>
          ))}
        </div>
        <div className="skeleton-chart-lines">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="skeleton-line"></div>
          ))}
        </div>
      </div>
      <div className="skeleton-legend">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="skeleton-legend-item">
            <div className="skeleton-legend-color"></div>
            <div className="skeleton-legend-text"></div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .chart-skeleton {
          padding: 1.5rem;
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .skeleton-header {
          margin-bottom: 1.5rem;
        }

        .skeleton-title {
          height: 20px;
          width: 50%;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          border-radius: 4px;
          animation: shimmer 1.5s infinite;
          margin-bottom: 0.5rem;
        }

        .skeleton-subtitle {
          height: 14px;
          width: 30%;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          border-radius: 4px;
          animation: shimmer 1.5s infinite;
        }

        .skeleton-chart-area {
          position: relative;
          height: 200px;
          margin-bottom: 1rem;
          background: #f8f9fa;
          border-radius: 6px;
          overflow: hidden;
        }

        .skeleton-chart-bars {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 100%;
          display: flex;
          align-items: flex-end;
          justify-content: space-around;
          padding: 0 1rem;
        }

        .skeleton-bar {
          width: 20px;
          background: linear-gradient(90deg, #667eea 25%, #764ba2 50%, #667eea 75%);
          background-size: 200% 100%;
          border-radius: 2px 2px 0 0;
          animation: shimmer 1.5s infinite;
        }

        .skeleton-chart-lines {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
        }

        .skeleton-line {
          height: 1px;
          background: #e0e0e0;
        }

        .skeleton-legend {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
          flex-wrap: wrap;
        }

        .skeleton-legend-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .skeleton-legend-color {
          width: 12px;
          height: 12px;
          background: linear-gradient(90deg, #667eea 25%, #764ba2 50%, #667eea 75%);
          background-size: 200% 100%;
          border-radius: 2px;
          animation: shimmer 1.5s infinite;
        }

        .skeleton-legend-text {
          height: 12px;
          width: 60px;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          border-radius: 2px;
          animation: shimmer 1.5s infinite;
        }

        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        @media (prefers-color-scheme: dark) {
          .chart-skeleton {
            background: #2a2a2a;
          }

          .skeleton-title,
          .skeleton-subtitle,
          .skeleton-legend-text {
            background: linear-gradient(90deg, #3a3a3a 25%, #4a4a4a 50%, #3a3a3a 75%);
          }

          .skeleton-chart-area {
            background: #1a1a1a;
          }

          .skeleton-line {
            background: #3a3a3a;
          }
        }
      `}</style>
    </div>
  );
}