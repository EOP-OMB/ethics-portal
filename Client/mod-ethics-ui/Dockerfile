FROM nginxinc/nginx-unprivileged

COPY config.conf.template /etc/nginx/templates/config.conf.template
COPY nginx.conf /etc/nginx/nginx.conf

COPY /app /usr/share/nginx/html

EXPOSE 5001

# ENTRYPOINT [ "bash", "/usr/share/nginx/html/nginx-entrypoint.sh" ]
