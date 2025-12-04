// components/skeletons/TableSkeleton.tsx
"use client";

export function TableSkeleton() {
  return (
    <div className="table-skeleton">
      <div className="skeleton-header">
        <div className="skeleton-title"></div>
        <div className="skeleton-actions">
          <div className="skeleton-button small"></div>
          <div className="skeleton-button small"></div>
        </div>
      </div>
      <div className="skeleton-table">
        <div className="skeleton-table-header">
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className="skeleton-header-cell"></div>
          ))}
        </div>
        <div className="skeleton-table-body">
          {Array.from({ length: 8 }, (_, rowIndex) => (
            <div key={rowIndex} className="skeleton-table-row">
              {Array.from({ length: 5 }, (_, cellIndex) => (
                <div key={cellIndex} className="skeleton-cell"></div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="skeleton-pagination">
        <div className="skeleton-page-info"></div>
        <div className="skeleton-page-buttons">
          <div className="skeleton-button tiny"></div>
          <div className="skeleton-button tiny"></div>
          <div className="skeleton-button tiny"></div>
          <div className="skeleton-button tiny"></div>
        </div>
      </div>

      <style jsx>{`
        .table-skeleton {
          padding: 1.5rem;
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .skeleton-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .skeleton-title {
          height: 20px;
          width: 200px;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          border-radius: 4px;
          animation: shimmer 1.5s infinite;
        }

        .skeleton-actions {
          display: flex;
          gap: 0.75rem;
        }

        .skeleton-button {
          height: 28px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          background-size: 200% 100%;
          border-radius: 4px;
          animation: shimmer 1.5s infinite;
        }

        .skeleton-button.small {
          width: 80px;
        }

        .skeleton-table {
          margin-bottom: 1.5rem;
          overflow: hidden;
        }

        .skeleton-table-header {
          display: flex;
          background: #f8f9fa;
          padding: 0.75rem;
          border-radius: 4px 4px 0 0;
          border-bottom: 1px solid #e9ecef;
        }

        .skeleton-header-cell {
          height: 16px;
          flex: 1;
          background: linear-gradient(90deg, #e0e0e0 25%, #d0d0d0 50%, #e0e0e0 75%);
          background-size: 200% 100%;
          border-radius: 2px;
          animation: shimmer 1.5s infinite;
          margin-right: 1rem;
        }

        .skeleton-header-cell:last-child {
          margin-right: 0;
        }

        .skeleton-table-body {
          background: #fff;
        }

        .skeleton-table-row {
          display: flex;
          padding: 0.75rem;
          border-bottom: 1px solid #f0f0f0;
        }

        .skeleton-table-row:last-child {
          border-bottom: none;
        }

        .skeleton-cell {
          height: 14px;
          flex: 1;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          border-radius: 2px;
          animation: shimmer 1.5s infinite;
          margin-right: 1rem;
        }

        .skeleton-cell:last-child {
          margin-right: 0;
        }

        .skeleton-pagination {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .skeleton-page-info {
          height: 14px;
          width: 150px;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          border-radius: 2px;
          animation: shimmer 1.5s infinite;
        }

        .skeleton-page-buttons {
          display: flex;
          gap: 0.5rem;
        }

        .skeleton-button.tiny {
          width: 24px;
          height: 24px;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
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
          .table-skeleton {
            background: #2a2a2a;
          }

          .skeleton-title {
            background: linear-gradient(90deg, #3a3a3a 25%, #4a4a4a 50%, #3a3a3a 75%);
          }

          .skeleton-table-header {
            background: #1a1a1a;
            border-color: #444;
          }

          .skeleton-header-cell {
            background: linear-gradient(90deg, #4a4a4a 25%, #5a5a5a 50%, #4a4a4a 75%);
          }

          .skeleton-table-row {
            border-color: #333;
          }

          .skeleton-cell {
            background: linear-gradient(90deg, #3a3a3a 25%, #4a4a4a 50%, #3a3a3a 75%);
          }

          .skeleton-page-info,
          .skeleton-button.tiny {
            background: linear-gradient(90deg, #3a3a3a 25%, #4a4a4a 50%, #3a3a3a 75%);
          }
        }
      `}</style>
    </div>
  );
}