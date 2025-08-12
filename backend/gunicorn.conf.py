# Gunicorn configuration file for production

# Server socket
bind = "0.0.0.0:8000"
backlog = 2048

# Worker processes
workers = 4
worker_class = "uvicorn.workers.UvicornWorker"
worker_connections = 1000
timeout = 30
keepalive = 2

# Restart workers after this many requests, to help prevent memory leaks
max_requests = 1000
max_requests_jitter = 100

# Logging
accesslog = "/var/log/producflow/access.log"
errorlog = "/var/log/producflow/error.log"
loglevel = "info"
access_log_format = '%(h)s %(l)s %(u)s %(t)s "%(r)s" %(s)s %(b)s "%(f)s" "%(a)s" %(D)s'

# Process naming
proc_name = "producflow-api"

# Daemon mode (set to True for production)
daemon = False

# User and group to run as (uncomment for production)
# user = "www-data"
# group = "www-data"

# Preload application for better performance
preload_app = True

# Graceful timeout
graceful_timeout = 30

# Temporary directory
tmp_upload_dir = None