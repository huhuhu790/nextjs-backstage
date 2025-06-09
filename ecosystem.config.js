module.exports = {
    apps: [
        {
            name: 'NextJS:3006',
            script: 'npm',
            args: 'start', //running on port 3000
            instances: 1,
            autorestart: false,       // 崩溃后自动重启
            watch: false,            // 关闭文件变化监控
        }
    ]
};