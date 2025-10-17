import React, { useEffect, useState } from 'react';
import { ONES } from '@ones-open/sdk';

interface Team {
  id: string;
  name: string;
  createdAt: string;
  owner: string;
}

const ExamplePage: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined' && !(window as unknown as { ONES?: unknown }).ONES && ONES) {
      (window as unknown as { ONES: unknown }).ONES = ONES;
    }
  }, []);

  const fetchTeams = async () => {
    if (!ONES) {
      return;
    }
    setLoading(true);
    setResult('正在调用 /v2/account/teams 接口...');
    
    try {
      const res = await ONES.fetchOpenAPI('/v2/account/teams');
      const data = await res.json();
      
      const teamList = (data?.data?.teams || []).map((team: unknown) => {
        const teamData = team as Record<string, unknown>;
        return {
          ...teamData,
          createdAt: new Date((teamData.createTime as number) / 1000).toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          }),
        };
      });
      
      setTeams(teamList);
      setResult(`团队列表获取成功！\n\n接口响应:\n${JSON.stringify(data, null, 2)}`);
    } catch (error: unknown) {
      console.error('获取团队列表失败:', error);
      setResult(`获取团队列表失败: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="container">
        <h1>Hello World!</h1>
        <p>欢迎来到 ONES 应用示例页面</p>
        <button 
          id="teams-api-button" 
          className="api-button"
          onClick={fetchTeams}
          disabled={loading}
        >
          {loading ? '正在调用...' : '调用 /v2/account/teams 接口'}
        </button>
        
        {result && (
          <div className="result">
            <pre>{result}</pre>
          </div>
        )}
        
        {teams.length > 0 && (
          <div className="teams-list">
            <h3>团队列表</h3>
            <div className="teams-grid">
              {teams.map((team) => (
                <div key={team.id} className="team-card">
                  <h4>{team.name}</h4>
                  <p><strong>UUID:</strong> {team.id}</p>
                  <p><strong>创建时间:</strong> {team.createdAt}</p>
                  {team.owner && <p><strong>负责人:</strong> {team.owner}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <style>{`
        .page {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          margin: 0;
          padding: 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .container {
          text-align: center;
          background: white;
          padding: 3rem;
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          max-width: 800px;
          margin: 2rem;
          width: 100%;
        }

        h1 {
          color: #333;
          font-size: 3rem;
          margin-bottom: 1rem;
          background: linear-gradient(45deg, #667eea, #764ba2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        p {
          color: #666;
          font-size: 1.2rem;
          margin-bottom: 2rem;
        }

        .api-button {
          background: linear-gradient(45deg, #667eea, #764ba2);
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: 50px;
          font-size: 1.1rem;
          cursor: pointer;
          transition: transform 0.2s;
          margin: 0.5rem;
        }

        .api-button:hover:not(:disabled) {
          transform: translateY(-2px);
        }

        .api-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .result {
          margin-top: 2rem;
          padding: 1rem;
          background: #f8f9fa;
          border-radius: 10px;
          text-align: left;
          font-family: monospace;
          white-space: pre-wrap;
          max-height: 300px;
          overflow-y: auto;
        }

        .teams-list {
          margin-top: 2rem;
          text-align: left;
        }

        .teams-list h3 {
          color: #333;
          margin-bottom: 1rem;
          border-bottom: 2px solid #667eea;
          padding-bottom: 0.5rem;
          text-align: center;
        }

        .teams-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1rem;
          margin-top: 1rem;
        }

        .team-card {
          background: #f8f9fa;
          padding: 1rem;
          border-radius: 10px;
          border-left: 4px solid #667eea;
        }

        .team-card h4 {
          margin: 0 0 0.5rem 0;
          color: #333;
        }

        .team-card p {
          margin: 0.25rem 0;
          font-size: 0.9rem;
          color: #666;
        }
      `}</style>
    </div>
  );
};

export default ExamplePage;
