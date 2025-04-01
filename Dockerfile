FROM node:18 AS build
WORKDIR /app

# คัดลอกไฟล์ทั้งหมดรวมถึง .env
COPY . . 

# ติดตั้ง dependencies และ Build
RUN npm install && npm run build

# ใช้ nginx เป็น Web Server
FROM nginx:alpine

# คัดลอก nginx.conf ไปยัง nginx ของ Container
COPY nginx.conf /etc/nginx/conf.d/default.conf

# คัดลอกไฟล์ Build ไปที่ Nginx
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
