#  MERN AI Blog Application



#  Overview

A modern **AI-powered Blog Platform** built using the **MERN Stack** with **Tailwind CSS**.

Apart from the traditional CRUD functionality, the application also integrates an **n8n AI Agent** that allows users to manage blogs using **natural language prompts**.

Instead of manually clicking buttons, users can simply type commands like:

> "Create a blog titled *AI is the Future*"

or

> "Delete my blog whose id is "blogId"

The AI Agent understands the request and performs the required CRUD operation automatically.

---

# Features

## Authentication

* Secure JWT Authentication
* User Registration
* User Login
* Protected Routes
* Password Hashing using bcrypt

---
# Application Preview

## Home Page

<p align="center">
<img width="1520" height="779" alt="image" src="https://github.com/user-attachments/assets/1cbcdfb9-321c-4524-8b50-1c02b6988946" />

</p>

---

## Authentication

<p align="center">
 <img width="1536" height="779" alt="image" src="https://github.com/user-attachments/assets/6da01bff-1d28-4194-9d26-bd9d5775f456" />

</p>

---

## All Blogs

<p align="center">
 <img width="1516" height="776" alt="image" src="https://github.com/user-attachments/assets/5ff9155b-606f-4efb-8fbc-4c4e7df37266" />

</p>

---

## Single Blog

<p align="center">
<img width="1418" height="779" alt="image" src="https://github.com/user-attachments/assets/ceca6d9e-191e-405b-8083-ce49b3704abc" />

</p>

---

## Create Blog

<p align="center">
 <img width="1469" height="741" alt="image" src="https://github.com/user-attachments/assets/22a2f6e7-e53e-4ab2-871a-022cd0d19cdf" />

</p>

---

## AI Blog Assistant

<p align="center">
  <img width="1536" height="741" alt="image" src="https://github.com/user-attachments/assets/19ecdade-151c-4922-ba48-087c2d3eff3e" />


</p>

---

## n8n Workflow

<p align="center">
  <img width="852" height="427" alt="Screenshot 2026-07-07 105203" src="https://github.com/user-attachments/assets/401c0619-226f-439d-b963-c3c78e98a199" />

</p>

---
# Demo

### Live Website

https://uzerqureshi-blog.netlify.app

---

### YouTube Demo

https://youtu.be/uINd_sg_WIo?si=yNYHee2JN6HF6yXs

---


## Blog Management

* Create Blog
* Read Blogs
* Update Blog
* Delete Blog
* View Single Blog
* Rich Blog Cards
* Responsive Layout

---

## AI Blog Assistant

Integrated with **n8n AI Workflow**

The AI Agent can

* Create Blogs
* Read Blogs
* Update Blogs
* Delete Blogs

using simple English prompts.

Example:

```
Create a blog about Artificial Intelligence
```

```
Update my blog title to "React 2026" whose id is "blogId"
```

```
Delete my  blog whose id is "blogId"
```

---

## UI

* Modern Design
* Tailwind CSS
* Fully Responsive
* Mobile Friendly
* Loading Animations
* Beautiful Cards
* Clean Dashboard

---

# Tech Stack

## Frontend

* React.js
* Tailwind CSS
* Axios
* React Router

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcrypt

## AI

* n8n
* AI Agent
* HTTP Request Nodes

---

# Project Structure

```
MERN-BLOG
│
├── client
│   ├── public
│   ├── src
│   ├── package.json
│
├── server
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── config
│   ├── package.json
│
├── n8n-workflows
│     workflow.json
│
└── README.md
```

---

# Prerequisites

Install the following before starting the project.

* Node.js (v24+ Recommended)
* npm
* MongoDB Community Server OR MongoDB Atlas
* Git
* n8n

---

# Clone Repository

```bash
git clone https://github.com/08Uzair/Uzer-2025.git

cd Uzer-2025
```

---

# Environment Variables

## Server

Changes inside the  file  of  **server** folder.

```env
PORT=8810

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

CLIENT_URL=http://localhost:3000

N8N_WEBHOOK_URL=http://localhost:5678/webhook/blog-agent
```

Example:

```env
PORT=8810

MONGO_URI=mongodb://127.0.0.1:27017/blogdb

JWT_SECRET=mySecretKey123
```

---

# Install Dependencies

## Backend

```bash
cd server

npm install
```

---

## Frontend

Open another terminal

```bash
cd client

npm install
```

---

# Start the Backend

```bash
cd server

npm start
```

Server starts on

```
http://localhost:8810
```

You should see something similar to

```
MongoDB Connected

Server Running on Port 8810
```

---

# Start the Frontend

Open another terminal

```bash
cd client

npm start
```

Frontend starts on

```
http://localhost:3000
```

Open

```
http://localhost:3000
```

in your browser.

---
# Setup n8n Workflow (Docker)

This project includes a pre-configured **n8n Docker image** hosted on Docker Hub, making setup quick and easy.

---

## Step 1: Pull the Docker Image

```bash
docker pull 08uzair/blog-agent-n8n:latest
```

> **Note:** Replace `latest` with another tag if you're using a different version.

---

## Step 2: Set Your Groq API Key as an Environment Variable

Create a `.env` file and add your Groq API key:

```env
GROQ_API_KEY=your_groq_api_key_here
```

---

## Step 3: Run the Docker Container

```bash
docker run -d \
  --name blog-agent-n8n \
  -p 5678:5678 \
  --env-file .env \
  08uzair/blog-agent-n8n:latest
```

---

## Step 4: Verify the Container

Check that the container is running:

```bash
docker ps
```

You should see a container named **blog-agent-n8n** with port **5678** exposed.

---

## Step 5: Open n8n

Open your browser and visit:

```text
http://localhost:5678
```

If prompted, create your n8n account (first-time setup only).

---

## Step 6: Activate the Workflow

The workflow is already included in the Docker image.

1. Open **Workflows**.
2. Verify that the imported workflow is present.
3. Configure any required credentials (MongoDB, AI provider, etc.).
4. Click **Active** to enable the workflow.

---

## Step 7: Configure the Backend

Copy the webhook URL from the **Webhook** node.

Example:

```text
http://localhost:5678/webhook/blog-agent
```

Add it to your backend `.env` file:

```env
N8N_WEBHOOK_URL=http://localhost:5678/webhook/blog-agent
```

Restart your backend server after saving the changes.

---

# Useful Docker Commands

### Start the container

```bash
docker start blog-agent-n8n
```

### Stop the container

```bash
docker stop blog-agent-n8n
```

### Restart the container

```bash
docker restart blog-agent-n8n
```

### View logs

```bash
docker logs -f blog-agent-n8n
```

### Remove the container

```bash
docker rm -f blog-agent-n8n
```

---

## Setup Checklist

Before using the AI-powered blog features, ensure that:

* MongoDB is running
* Backend server is running (`http://localhost:8810`)
* Frontend is running (`http://localhost:3000`)
* Docker container is running
* The n8n workflow is active
* Required credentials are configured
* `N8N_WEBHOOK_URL` matches the webhook URL from the workflow

You're now ready to manage blogs using natural language with the integrated AI agent.


# Running Everything Together

Open **three terminals**.

### Terminal 1

Backend

```bash
cd server

npm start
```

---

### Terminal 2

Frontend

```bash
cd client

npm start
```

---

### Terminal 3

Set your Groq API key and start n8n

```bash
export GROQ_API_KEY=your_groq_api_key_here

npx n8n start
```

> **Windows (PowerShell):** `$env:GROQ_API_KEY="your_groq_api_key_here"`

Now everything is connected.

---

# REST APIs

### Authentication

```
POST
/api/v1/user/auth/signUp
```

```
POST
/api/v1/user/auth/signIn
```

---

### Blogs

```
GET
/api/v1/blogPost/allBlogs
```

```
GET
/api/v1/blogPost/singlePost/:id
```

```
POST
/api/v1/blogPost/createBlog
```

```
PUT
/api/v1/blogPost/:id
```

```
DELETE
/api/v1/blogPost/:id
```

---

### Categories

```
GET
/api/v1/category/allCategories
```

```
POST
/api/v1/category/createCategory
```

# Future Improvements

* AI Blog Summarizer
* AI Blog Generator
* Image Upload
* Rich Text Editor
* Comments
* Likes
* Bookmarks
* Search & Filters
* Notifications
* Dark Mode
* Admin Dashboard

---

# Contributing

Contributions are always welcome.

1. Fork the repository

2. Create a new branch

```
git checkout -b feature-name
```

3. Commit changes

```
git commit -m "Added new feature"
```

4. Push

```
git push origin feature-name
```

5. Create a Pull Request

---

# Support

If you found this project useful,

please consider giving it a star on GitHub.

It helps the project grow and motivates future improvements.

---

# Author

**Uzair Qureshi**

GitHub

https://github.com/08Uzair

LinkedIn

https://www.linkedin.com/posts/uzairqureshi0803_nextjs-reactjs-nodejs-ugcPost-7478063409071132672-KqiJ/?utm_source=share&utm_medium=member_desktop&rcm=ACoAAEBTSccBjl6Qp83SDD2w98ZKcuAZnzuudlU
