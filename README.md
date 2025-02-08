# 📊 Nginx Log Parser (Node.js)

This script **parses Nginx log files**, converts them into **CSV format**, and automatically **commits and pushes** them to a Git repository.

---

## 📌 **Requirements**
✅ **Node.js** installed on your system  
✅ **Git** installed and configured  
✅ **Docker (optional)** if you want to run the script in a container

---

## 🚀 **Step-by-Step Installation and Setup**

### **Step 1: Install Node.js**
If you don’t have **Node.js** installed, download and install it from:  
🔗 [https://nodejs.org/](https://nodejs.org/)

To check if Node.js is installed, run:
```bash
node -v

Step 2: Create a Sample Nginx Log File
touch nginx.log

Step 3: Run the Script
node parse_nginx_logs.js

This will:
✅ Read the nginx.log file
✅ Convert it into nginx_logs.csv
✅ Automatically commit & push the CSV file to Git

🎯 Additional Features
Filter Logs by HTTP Status Code
Example: Get only 404 logs
node parse_nginx_logs.js --filter 404

Sort Logs by a Specific Field
Example: Sort by IP address.
node parse_nginx_logs.js --sort ip

Combine Filter & Sort
Example: Get only 200 status logs and sort them by date.
node parse_nginx_logs.js --filter 200 --sort date

🐳 Run with Docker
Build the Docker Image
docker build -t nginx-log-parser .

Run the Docker Container
docker run --rm nginx-log-parser
