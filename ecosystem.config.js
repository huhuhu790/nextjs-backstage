module.exports = {
    apps: [
        {
            name: 'NextJS:3006',
            script: './node_modules/next/dist/bin/next',
            args: 'start -p 3006', // 直接指定端口
            instances: 1,
            autorestart: false,
            exec_mode: 'fork', 
            watch: false,
            env: {
                NODE_ENV: 'production'
            }
        }
    ]
}