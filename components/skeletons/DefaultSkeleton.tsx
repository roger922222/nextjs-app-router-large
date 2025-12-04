// components/skeletons/DefaultSkeleton.tsx
"use client";

export function DefaultSkeleton() {
  return (
    <div className="default-skeleton">
      <div className="skeleton-header">
        <div className="skeleton-title"></div>
        <div className="skeleton-subtitle"></div>
      </div>
      <div className="skeleton-content">
        <div className="skeleton-line"></div>
        <div className="skeleton-line short"></div>
        <div className="skeleton-line"></div>
        <div className="skeleton-line medium"></div>
      </div>
      <div className="skeleton-actions">
        <div className="skeleton-button"></div>
        <div className="skeleton-button small"></div>
      </div>

      <style jsx>{`
        .default-skeleton {
          padding: 1.5rem;
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .skeleton-header {
          margin-bottom: 1.5rem;
        }

        .skeleton-title {
          height: 24px;
          width: 60%;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          border-radius: 4px;
          animation: shimmer 1.5s infinite;
          margin-bottom: 0.5rem;
        }

        .skeleton-subtitle {
          height: 16px;
          width: 40%;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          border-radius: 4px;
          animation: shimmer 1.5s infinite;
        }

        .skeleton-content {
          margin-bottom: 1.5rem;
        }

        .skeleton-line {
          height: 12px;
          width: 100%;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          border-radius: 4px;
          animation: shimmer 1.5s infinite;
          margin-bottom: 0.75rem;
        }

        .skeleton-line.short {
          width: 70%;
        }

        .skeleton-line.medium {
          width: 85%;
        }

        .skeleton-actions {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .skeleton-button {
          height: 36px;
          width: 100px;
          background: linear-gradient(90deg, #667eea 25%, #764ba2 50%, #667eea 75%);
          background-size: 200% 100%;
          border-radius: 6px;
          animation: shimmer 1.5s infinite;
        }

        .skeleton-button.small {
          width: 60px;
          height: 28px;
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
          .default-skeleton {
            background: #2a2a2a;
          }

          .skeleton-title,
          .skeleton-subtitle,
          .skeleton-line {
            background: linear-gradient(90deg, #3a3a3a 25%, #4a4a4a 50%, #3a3a3a 75%);
          }

          .skeleton-button {
            background: linear-gradient(90deg, #4a5fc1 25%, #5a3f92 50%, #4a5fc1 75%);
          }
        }
      `}</style>
    </div>
  );
}