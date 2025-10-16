import React, { useEffect, useState } from 'react';
import { useMemoizedFn } from 'ahooks';
import { ConfigProvider, Select, Button, Typography, Card } from '@ones-design/core';
import { Table } from '@ones-design/table';
import { ONES } from '@ones-open/sdk';

const { Title, Text } = Typography;

interface Team {
  id: string;
  name: string;
  createdAt: string;
  owner: string;
}

interface User {
  id: string;
  name: string;
  email: string;
}

interface Project {
  id: string;
  name: string;
  createdAt: string;
}

const Page2: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(false);
  const [teamUsers, setTeamUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && !(window as any).ONES && ONES) {
      (window as any).ONES = ONES;
    }
  }, []);

  const fetchTeams = useMemoizedFn(async () => {
    if (!ONES) {
      return;
    }
    setLoading(true);
    try {
      const res = await ONES.fetchOpenAPI('/v2/account/teams');
      const data = await res.json();
      const teamList = (data?.data?.teams || []).map((team: any) => ({
        ...team,
        createdAt: new Date(team.createTime / 1000).toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        }),
      }));
      setTeams(teamList);
    } catch (error) {
      console.error('获取团队列表失败:', error);
    } finally {
      setLoading(false);
    }
  });

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  const onTeamSelect = useMemoizedFn(async (value: string) => {
    setSelectedTeam(value || null);
    if (!value) {
      setTeamUsers([]);
      setProjects([]);
      return;
    }
    fetchTeamUsers(value);
    fetchProjects(value);
  });

  const fetchTeamUsers = useMemoizedFn(async (value: string) => {
    if (!ONES) {
      return;
    }
    try {
      const res = await ONES.fetchOpenAPI(`/v2/account/users/search?teamID=${value}`);
      const data = await res.json();
      setTeamUsers(data?.data?.list || []);
    } catch (error) {
      console.error('获取用户列表失败:', error);
    }
  });

  const fetchProjects = useMemoizedFn(async (value: string) => {
    if (!ONES) {
      return;
    }
    try {
      const res = await ONES.fetchOpenAPI(`/v2/project/projects?teamID=${value}`);
      const data = await res.json();
      const projectList = (data?.data?.list || []).map((project: any) => ({
        ...project,
        createdAt: new Date(project.createTime).toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        }),
      }));
      setProjects(projectList);
    } catch (error) {
      console.error('获取项目列表失败:', error);
    }
  });

  return (
    <ConfigProvider>
      <div className="container">
        <Card style={{ marginBottom: '24px' }}>
          <div className="header">
            <Title level={3} style={{ margin: 0 }}>
              团队列表
            </Title>
            <Button type="primary" onClick={fetchTeams} loading={loading}>
              刷新团队
            </Button>
          </div>
          <Table
            loading={loading}
            columns={[
              {
                dataIndex: 'id',
                lock: true,
                width: 120,
                title: '团队UUID',
                render: (text: string) => <Text>{text}</Text>,
              },
              {
                dataIndex: 'name',
                title: '团队名称',
                width: 150,
              },
              {
                dataIndex: 'createdAt',
                title: '创建日期',
                width: 180,
              },
              {
                dataIndex: 'owner',
                title: '团队负责人',
                width: 150,
              },
            ]}
            dataSource={teams}
          />
        </Card>

        <Card style={{ width: '100%', marginBottom: '24px' }}>
          <Title level={4} style={{ marginBottom: '16px' }}>
            选择团队
          </Title>
          <Select
            style={{ width: '100%' }}
            placeholder="请选择团队"
            options={teams.map((team) => ({
              label: team.name,
              value: team.id,
            }))}
            value={selectedTeam || undefined}
            onChange={onTeamSelect}
            allowClear
          />
        </Card>

        {selectedTeam ? (
          <>
            <Card style={{ marginBottom: '24px' }}>
              <Title level={4} style={{ marginBottom: '16px' }}>
                团队成员
              </Title>
              <Table
                columns={[
                  {
                    dataIndex: 'id',
                    lock: true,
                    width: 120,
                    title: '用户UUID',
                    render: (text: string) => <Text>{text}</Text>,
                  },
                  {
                    dataIndex: 'name',
                    title: '用户名称',
                    width: 150,
                  },
                  {
                    dataIndex: 'email',
                    title: '邮箱',
                    width: 200,
                  },
                ]}
                dataSource={teamUsers}
              />
            </Card>

            <Card>
              <Title level={4} style={{ marginBottom: '16px' }}>
                项目列表
              </Title>
              <Table
                columns={[
                  {
                    dataIndex: 'id',
                    width: 120,
                    title: '项目UUID',
                    render: (text: string) => <Text>{text}</Text>,
                  },
                  {
                    dataIndex: 'name',
                    title: '项目名称',
                    width: 200,
                  },
                  {
                    dataIndex: 'createdAt',
                    title: '创建时间',
                    width: 180,
                  },
                ]}
                dataSource={projects}
              />
            </Card>
          </>
        ) : null}
      </div>
      <style>{`
        .container {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          width: 100%;
          padding: 24px;
          background-color: #f5f5f5;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
      `}</style>
    </ConfigProvider>
  );
};

export default Page2;
