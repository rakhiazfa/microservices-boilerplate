FROM nginx:stable-alpine

COPY api_json_errors.conf /etc/nginx/
COPY api_backends.conf /etc/nginx/
COPY api_gateway.conf /etc/nginx/
COPY nginx.conf /etc/nginx/
COPY api_conf.d/ /etc/nginx/api_conf.d/

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]