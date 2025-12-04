// components/demo-components/DataTable.tsx
"use client";

import { useEffect, useState } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: {
    name: string;
  };
}

export default function DataTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // 模拟API调用延迟
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // 分页逻辑
  const totalPages = Math.ceil(users.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentUsers = users.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  if (isLoading) {
    return (
      <div className="data-table-loading">
        <div className="loading-spinner"></div>
        <p>正在加载用户数据...</p>
      </div>
    );
  }

  return (
    <div className="data-table">
      <div className="table-header">
        <h3>📋 用户数据表格</h3>
        <p>展示分页数据加载和表格组件功能</p>
      </div>
      
      <div className="table-container">
        <table className="user-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>姓名</th>
              <th>邮箱</th>
              <th>电话</th>
              <th>公司</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{user.company.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="table-footer">
        <div className="pagination-info">
          显示 {startIndex + 1} - {Math.min(endIndex, users.length)} 条，共 {users.length} 条记录
        </div>
        
        <div className="pagination-controls">
          <button 
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="pagination-button"
          >
            上一页
          </button>
          
          <div className="page-numbers">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
              return (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`page-number ${currentPage === page ? 'active' : ''}`}
                >
                  {page}
                </button>
              );
            })}
          </div>
          
          <button 
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="pagination-button"
          >
            下一页
          </button>
        </div>
      </div>

      <style jsx>{`
        .data-table {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .table-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .table-header h3 {
          color: #333;
          margin-bottom: 0.5rem;
          font-size: 1.5rem;
        }

        .table-header p {
          color: #666;
          font-size: 0.95rem;
          margin: 0;
        }

        .table-container {
          overflow-x: auto;
          margin-bottom: 2rem;
        }

        .user-table {
          width: 100%;
          border-collapse: collapse;
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .user-table th {
          background: #f8f9fa;
          padding: 1rem;
          text-align: left;
          font-weight: 600;
          color: #495057;
          border-bottom: 2px solid #e9ecef;
          font-size: 0.9rem;
        }

        .user-table td {
          padding: 1rem;
          border-bottom: 1px solid #e9ecef;
          color: #666;
          font-size: 0.9rem;
        }

        .user-table tr:hover {
          background: #f8f9fa;
        }

        .user-table tr:last-child td {
          border-bottom: none;
        }

        .table-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .pagination-info {
          color: #666;
          font-size: 0.9rem;
        }

        .pagination-controls {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .pagination-button {
          padding: 0.5rem 1rem;
          border: 1px solid #e9ecef;
          background: white;
          color: #666;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 0.9rem;
        }

        .pagination-button:hover:not(:disabled) {
          background: #f8f9fa;
          border-color: #667eea;
          color: #667eea;
        }

        .pagination-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .page-numbers {
          display: flex;
          gap: 0.25rem;
        }

        .page-number {
          padding: 0.5rem 0.75rem;
          border: 1px solid #e9ecef;
          background: white;
          color: #666;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 0.9rem;
          min-width: 32px;
          text-align: center;
        }

        .page-number:hover {
          background: #f8f9fa;
          border-color: #667eea;
          color: #667eea;
        }

        .page-number.active {
          background: #667eea;
          border-color: #667eea;
          color: white;
        }

        .data-table-loading {
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

        .data-table-loading p {
          color: #666;
          font-size: 1rem;
          margin: 0;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .data-table {
            padding: 1rem;
          }

          .table-footer {
            flex-direction: column;
            align-items: stretch;
          }

          .pagination-controls {
            justify-content: center;
          }

          .user-table {
            font-size: 0.85rem;
          }

          .user-table th,
          .user-table td {
            padding: 0.75rem 0.5rem;
          }
        }

        @media (prefers-color-scheme: dark) {
          .data-table {
            background: #2a2a2a;
          }

          .table-header h3 {
            color: #ffffff;
          }

          .table-header p {
            color: #cccccc;
          }

          .user-table {
            background: #1a1a1a;
          }

          .user-table th {
            background: #333;
            color: #ffffff;
            border-color: #444;
          }

          .user-table td {
            border-color: #444;
            color: #cccccc;
          }

          .user-table tr:hover {
            background: #333;
          }

          .pagination-info {
            color: #cccccc;
          }

          .pagination-button,
          .page-number {
            background: #333;
            border-color: #444;
            color: #cccccc;
          }

          .pagination-button:hover:not(:disabled),
          .page-number:hover {
            background: #444;
            border-color: #667eea;
            color: #667eea;
          }

          .page-number.active {
            background: #667eea;
            border-color: #667eea;
            color: #ffffff;
          }

          .data-table-loading {
            background: #2a2a2a;
          }

          .data-table-loading p {
            color: #cccccc;
          }
        }
      `}</style>
    </div>
  );
}