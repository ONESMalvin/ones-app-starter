#!/usr/bin/env node

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// 加载环境变量
require('dotenv').config();

// 从 .env 文件或环境变量中获取配置
const ONES_SERVER_URL = process.env.ONES_SERVER_URL || 'https://your-ones-server.com';
const APP_ID = process.env.APP_ID || 'app_your_app_id';
const RELAY_TOKEN = process.env.RELAY_TOKEN || 'your_relay_token';
const PORT = process.env.PORT || '3000';

// 检查必要的环境变量
if (!ONES_SERVER_URL || !APP_ID || !RELAY_TOKEN) {
  console.error('❌ 缺少必要的环境变量:');
  console.error('   ONES_SERVER_URL:', ONES_SERVER_URL ? '✅' : '❌');
  console.error('   APP_ID:', APP_ID ? '✅' : '❌');
  console.error('   RELAY_TOKEN:', RELAY_TOKEN ? '✅' : '❌');
  console.error('\n请检查 .env 文件或设置环境变量');
  process.exit(1);
}

// 构建命令参数
const serverUrl = `${ONES_SERVER_URL}/platform/plugin_relay/app_dispatch/${APP_ID}`;
const args = [
  '-s', serverUrl,
  '-a', APP_ID,
  '-t', RELAY_TOKEN,
  '-p', PORT
];

console.log('🚀 启动 ONES 代理...');
console.log('📋 配置信息:');
console.log(`   Server URL: ${serverUrl}`);
console.log(`   App ID: ${APP_ID}`);
console.log(`   Port: ${PORT}`);
console.log('');

// 启动代理进程
const agentProcess = spawn('ones_appv2_local_agent', args, {
  stdio: ['inherit', 'pipe', 'pipe']
});

// 重定向输出到 agent.log
const logStream = fs.createWriteStream('agent.log', { flags: 'a' });
agentProcess.stdout.pipe(logStream);
agentProcess.stderr.pipe(logStream);

// 同时输出到控制台
agentProcess.stdout.on('data', (data) => {
  console.log(data.toString());
});

agentProcess.stderr.on('data', (data) => {
  console.error(data.toString());
});

// 处理进程退出
agentProcess.on('close', (code) => {
  console.log(`\n📝 代理进程退出，代码: ${code}`);
  logStream.end();
});

agentProcess.on('error', (error) => {
  console.error('❌ 启动代理失败:', error.message);
  process.exit(1);
});

// 优雅关闭
process.on('SIGINT', () => {
  console.log('\n🛑 正在关闭代理...');
  agentProcess.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('\n🛑 正在关闭代理...');
  agentProcess.kill('SIGTERM');
});
