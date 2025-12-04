// components/demo-components/ComplexForm.tsx
"use client";

import { useState } from 'react';

export default function ComplexForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    experience: '',
    skills: [] as string[],
    bio: '',
    agreeToTerms: false,
    subscribeNewsletter: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const skillOptions = [
    'JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js',
    'Python', 'Java', 'Go', 'Rust', 'Docker', 'Kubernetes'
  ];

  const experienceOptions = [
    '0-1年', '1-3年', '3-5年', '5-8年', '8-12年', '12年以上'
  ];

  // 处理输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  // 处理技能选择
  const handleSkillChange = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    setSubmitSuccess(false);

    try {
      // 模拟API提交
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('表单提交成功:', formData);
      setSubmitSuccess(true);
      
      // 重置表单
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          position: '',
          experience: '',
          skills: [],
          bio: '',
          agreeToTerms: false,
          subscribeNewsletter: false
        });
        setSubmitSuccess(false);
      }, 3000);
      
    } catch (error) {
      console.error('表单提交失败:', error);
      alert('表单提交失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="complex-form">
      <div className="form-header">
        <h3>📝 复杂表单组件</h3>
        <p>包含多种输入类型、验证逻辑和提交状态管理</p>
      </div>

      {submitSuccess && (
        <div className="success-message">
          <h4>✅ 提交成功！</h4>
          <p>您的信息已成功提交，正在重置表单...</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="form-content">
        {/* 基本信息 */}
        <div className="form-section">
          <h4>基本信息</h4>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">姓名 *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="请输入您的姓名"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">邮箱 *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="请输入您的邮箱"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="phone">电话 *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="请输入您的电话号码"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="company">公司</label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                placeholder="请输入您的公司名称"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="position">职位</label>
              <input
                type="text"
                id="position"
                name="position"
                value={formData.position}
                onChange={handleInputChange}
                placeholder="请输入您的职位"
              />
            </div>

            <div className="form-group">
              <label htmlFor="experience">工作经验 *</label>
              <select
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                required
              >
                <option value="">请选择工作经验</option>
                {experienceOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 技能选择 */}
        <div className="form-section">
          <h4>技能选择 *</h4>
          <div className="skills-grid">
            {skillOptions.map(skill => (
              <label key={skill} className="skill-checkbox">
                <input
                  type="checkbox"
                  checked={formData.skills.includes(skill)}
                  onChange={() => handleSkillChange(skill)}
                />
                <span>{skill}</span>
              </label>
            ))}
          </div>
          <div className="selected-skills">
            已选择: {formData.skills.join(', ') || '无'}
          </div>
        </div>

        {/* 个人简介 */}
        <div className="form-section">
          <h4>个人简介</h4>
          <div className="form-group">
            <label htmlFor="bio">个人简介</label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              rows={5}
              placeholder="请简单介绍一下您自己..."
            />
          </div>
        </div>

        {/* 条款和订阅 */}
        <div className="form-section">
          <h4>条款和订阅</h4>
          <div className="checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleInputChange}
                required
              />
              <span>我同意服务条款 *</span>
            </label>
          </div>

          <div className="checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="subscribeNewsletter"
                checked={formData.subscribeNewsletter}
                onChange={handleInputChange}
              />
              <span>订阅新闻通讯</span>
            </label>
          </div>
        </div>

        {/* 提交按钮 */}
        <div className="form-actions">
          <button 
            type="submit" 
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="submitting">
                <span className="spinner"></span>
                提交中...
              </span>
            ) : (
              '提交表单'
            )}
          </button>
        </div>
      </form>

      <style jsx>{`
        .complex-form {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .form-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .form-header h3 {
          color: #333;
          margin-bottom: 0.5rem;
          font-size: 1.5rem;
        }

        .form-header p {
          color: #666;
          font-size: 0.95rem;
          margin: 0;
        }

        .success-message {
          background: #d4edda;
          border: 1px solid #c3e6cb;
          border-radius: 8px;
          padding: 1rem;
          margin-bottom: 2rem;
          text-align: center;
        }

        .success-message h4 {
          color: #155724;
          margin-bottom: 0.5rem;
          font-size: 1.1rem;
        }

        .success-message p {
          color: #155724;
          margin: 0;
          font-size: 0.9rem;
        }

        .form-content {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .form-section {
          background: #f8f9fa;
          padding: 1.5rem;
          border-radius: 8px;
          border-left: 4px solid #667eea;
        }

        .form-section h4 {
          color: #333;
          margin-bottom: 1rem;
          font-size: 1.1rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-group label {
          color: #333;
          font-weight: 500;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          padding: 0.75rem;
          border: 1px solid #e9ecef;
          border-radius: 4px;
          font-size: 0.9rem;
          transition: border-color 0.2s ease;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #667eea;
        }

        .skills-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .skill-checkbox {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          font-size: 0.9rem;
          color: #666;
        }

        .skill-checkbox input[type="checkbox"] {
          margin: 0;
        }

        .selected-skills {
          color: #667eea;
          font-size: 0.85rem;
          font-weight: 500;
          margin-top: 0.5rem;
        }

        .checkbox-group {
          margin-bottom: 1rem;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          font-size: 0.9rem;
          color: #666;
        }

        .checkbox-label input[type="checkbox"] {
          margin: 0;
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-top: 2rem;
        }

        .submit-button {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 0.75rem 2rem;
          border-radius: 6px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          min-width: 120px;
        }

        .submit-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .submit-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .submitting {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid #ffffff;
          border-top: 2px solid transparent;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .complex-form {
            padding: 1.5rem;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .skills-grid {
            grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
          }

          .form-actions {
            flex-direction: column;
            align-items: center;
          }
        }

        @media (prefers-color-scheme: dark) {
          .complex-form {
            background: #2a2a2a;
          }

          .form-header h3 {
            color: #ffffff;
          }

          .form-header p {
            color: #cccccc;
          }

          .success-message {
            background: #1a4d2e;
            border-color: #2d5a3d;
          }

          .success-message h4,
          .success-message p {
            color: #d4edda;
          }

          .form-section {
            background: #333;
            border-left-color: #667eea;
          }

          .form-section h4 {
            color: #ffffff;
          }

          .form-group label {
            color: #ffffff;
          }

          .form-group input,
          .form-group select,
          .form-group textarea {
            background: #1a1a1a;
            border-color: #444;
            color: #cccccc;
          }

          .form-group input:focus,
          .form-group select:focus,
          .form-group textarea:focus {
            border-color: #667eea;
          }

          .skill-checkbox,
          .checkbox-label {
            color: #cccccc;
          }

          .selected-skills {
            color: #667eea;
          }
        }
      `}</style>
    </div>
  );
}