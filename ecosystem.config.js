module.exports = {
    apps: [
        {
            name: 'portal',
            exec_mode: 'cluster',
            instances: 1, // Use 'max' to run across all CPU cores
            script: './build/src/app.js', // Use the compiled JavaScript file
            args: '',
            error_file: './logs/error.log',
            out_file: './logs/output.log',
            max_memory_restart: '1G',
            max_restarts: 10,
            autostart: true,
            restart_delay: 3000,
            log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
            env: {
                NODE_ENV: 'production',
                PORT: 5000 // Port for production
            }
        }
    ]
};
