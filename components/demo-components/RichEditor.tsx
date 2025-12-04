// components/demo-components/RichEditor.tsx
"use client";

import { useEffect, useState, useRef } from 'react';

export default function RichEditor() {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const editorRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // 模拟富文本编辑器初始化
    const initializeEditor = async () => {
      // 模拟加载时间
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // 设置初始内容
      const initialContent = `# 欢迎使用富文本编辑器

这是一个功能丰富的文本编辑器演示。

## 主要特性

- **实时字数统计**：自动计算字数和字符数
- **语法高亮**：支持Markdown语法
- **自动保存**：内容变化时自动保存
- **多格式支持**：支持多种文本格式

## 使用说明

1. 在下方文本框中输入内容
2. 系统会自动统计字数和字符数
3. 支持基本的Markdown语法
4. 内容会实时保存到本地存储

开始编辑你的文档吧！`;

      setContent(initialContent);
      setIsLoading(false);
    };

    initializeEditor();
  }, []);

  // 处理内容变化
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    
    // 更新字数统计
    const words = newContent.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
    setCharCount(newContent.length);
    
    // 自动保存到本地存储
    localStorage.setItem('rich-editor-content', newContent);
  };

  // 格式化文本
  const formatText = (format: 'bold' | 'italic' | 'underline') => {
    if (!editorRef.current) return;
    
    const textarea = editorRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    
    let formattedText = '';
    switch (format) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        break;
      case 'underline':
        formattedText = `<u>${selectedText}</u>`;
        break;
    }
    
    const newContent = content.substring(0, start) + formattedText + content.substring(end);
    setContent(newContent);
    
    // 恢复光标位置
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + formattedText.length, start + formattedText.length);
    }, 0);
  };

  // 清空内容
  const clearContent = () => {
    if (confirm('确定要清空所有内容吗？')) {
      setContent('');
      localStorage.removeItem('rich-editor-content');
    }
  };

  // 插入示例文本
  const insertSampleText = () => {
    const sampleText = '\n\n这是一段示例文本，展示了富文本编辑器的基本功能。';
    setContent(content + sampleText);
  };

  if (isLoading) {
    return (
      <div className="rich-editor-loading">
        <div className="loading-spinner"></div>
        <p>正在初始化富文本编辑器...</p>
      </div>
    );
  }

  return (
    <div className="rich-editor">
      <div className="editor-header">
        <h3>📝 富文本编辑器</h3>
        <p>支持Markdown语法和实时统计功能</p>
      </div>

      <div className="editor-toolbar">
        <div className="toolbar-group">
          <button 
            onClick={() => formatText('bold')}
            className="toolbar-button"
            title="加粗"
          >
            <strong>B</strong>
          </button>
          <button 
            onClick={() => formatText('italic')}
            className="toolbar-button"
            title="斜体"
          >
            <em>I</em>
          </button>
          <button 
            onClick={() => formatText('underline')}
            className="toolbar-button"
            title="下划线"
          >
            <u>U</u>
          </button>
        </div>
        
        <div className="toolbar-group">
          <button 
            onClick={insertSampleText}
            className="toolbar-button"
            title="插入示例文本"
          >
            示例
          </button>
          <button 
            onClick={clearContent}
            className="toolbar-button danger"
            title="清空内容"
          >
            清空
          </button>
        </div>
      </div>

      <div className="editor-content">
        <textarea
          ref={editorRef}
          value={content}
          onChange={handleContentChange}
          placeholder="在这里输入你的内容..."
          className="editor-textarea"
          rows={20}
        />
      </div>

      <div className="editor-stats">
        <div className="stat-item">
          <span className="stat-label">字数:</span>
          <span className="stat-value">{wordCount}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">字符数:</span>
          <span className="stat-value">{charCount}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">行数:</span>
          <span className="stat-value">{content.split('\n').length}</span>
        </div>
      </div>

      <div className="editor-preview">
        <h4>预览</h4>
        <div className="preview-content">
          {content.split('\n').map((line, index) => (
            <div key={index} className="preview-line">
              {line.startsWith('# ') && <h1>{line.substring(2)}</h1>}
              {line.startsWith('## ') && <h2>{line.substring(3)}</h2>}
              {line.startsWith('### ') && <h3>{line.substring(4)}</h3>}
              {line.startsWith('**') && line.endsWith('**') && <strong>{line.substring(2, line.length - 2)}</strong>}
              {line.startsWith('*') && line.endsWith('*') && !line.startsWith('**') && <em>{line.substring(1, line.length - 1)}</em>}
              {!line.startsWith('#') && !line.startsWith('**') && !line.startsWith('*') && line && <p>{line}</p>}
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .rich-editor {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .editor-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .editor-header h3 {
          color: #333;
          margin-bottom: 0.5rem;
          font-size: 1.5rem;
        }

        .editor-header p {
          color: #666;
          font-size: 0.95rem;
          margin: 0;
        }

        .editor-toolbar {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.5rem;
          padding: 1rem;
          background: #f8f9fa;
          border-radius: 8px;
          flex-wrap: wrap;
        }

        .toolbar-group {
          display: flex;
          gap: 0.5rem;
        }

        .toolbar-button {
          padding: 0.5rem 1rem;
          border: 1px solid #e9ecef;
          background: white;
          color: #666;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .toolbar-button:hover {
          background: #f8f9fa;
          border-color: #667eea;
          color: #667eea;
        }

        .toolbar-button.danger {
          color: #dc3545;
        }

        .toolbar-button.danger:hover {
          background: #dc3545;
          color: white;
          border-color: #dc3545;
        }

        .editor-content {
          margin-bottom: 1.5rem;
        }

        .editor-textarea {
          width: 100%;
          min-height: 300px;
          padding: 1rem;
          border: 2px solid #e9ecef;
          border-radius: 8px;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          font-size: 0.9rem;
          line-height: 1.6;
          resize: vertical;
          transition: border-color 0.2s ease;
        }

        .editor-textarea:focus {
          outline: none;
          border-color: #667eea;
        }

        .editor-stats {
          display: flex;
          justify-content: center;
          gap: 2rem;
          margin-bottom: 2rem;
          padding: 1rem;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
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

        .editor-preview {
          background: #f8f9fa;
          border-radius: 8px;
          padding: 1.5rem;
        }

        .editor-preview h4 {
          color: #333;
          margin-bottom: 1rem;
          font-size: 1.1rem;
        }

        .preview-content {
          background: white;
          padding: 1rem;
          border-radius: 4px;
          border: 1px solid #e9ecef;
          min-height: 100px;
          max-height: 200px;
          overflow-y: auto;
        }

        .preview-line {
          margin-bottom: 0.5rem;
        }

        .preview-line h1,
        .preview-line h2,
        .preview-line h3 {
          color: #333;
          margin: 0.5rem 0;
        }

        .preview-line p {
          color: #666;
          margin: 0.25rem 0;
          line-height: 1.5;
        }

        .rich-editor-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 400px;
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

        .rich-editor-loading p {
          color: #666;
          font-size: 1rem;
          margin: 0;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .rich-editor {
            padding: 1.5rem;
          }

          .editor-toolbar {
            flex-direction: column;
            gap: 0.5rem;
          }

          .editor-stats {
            flex-direction: column;
            gap: 1rem;
          }

          .editor-textarea {
            min-height: 200px;
          }
        }

        @media (prefers-color-scheme: dark) {
          .rich-editor {
            background: #2a2a2a;
          }

          .editor-header h3 {
            color: #ffffff;
          }

          .editor-header p {
            color: #cccccc;
          }

          .editor-toolbar {
            background: #333;
          }

          .toolbar-button {
            background: #444;
            border-color: #555;
            color: #cccccc;
          }

          .toolbar-button:hover {
            background: #555;
            border-color: #667eea;
            color: #667eea;
          }

          .toolbar-button.danger {
            color: #ff6b6b;
          }

          .toolbar-button.danger:hover {
            background: #ff6b6b;
            color: #ffffff;
            border-color: #ff6b6b;
          }

          .editor-textarea {
            background: #1a1a1a;
            border-color: #444;
            color: #cccccc;
          }

          .editor-textarea:focus {
            border-color: #667eea;
          }

          .editor-stats {
            background: #333;
          }

          .stat-label {
            color: #cccccc;
          }

          .stat-value {
            color: #ffffff;
          }

          .editor-preview {
            background: #333;
          }

          .editor-preview h4 {
            color: #ffffff;
          }

          .preview-content {
            background: #1a1a1a;
            border-color: #444;
          }

          .preview-line h1,
          .preview-line h2,
          .preview-line h3 {
            color: #ffffff;
          }

          .preview-line p {
            color: #cccccc;
          }

          .rich-editor-loading {
            background: #2a2a2a;
          }

          .rich-editor-loading p {
            color: #cccccc;
          }
        }
      `}</style>
    </div>
  );
}