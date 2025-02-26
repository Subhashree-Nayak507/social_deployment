# Social Media App

A feature-rich social media application built with React.js, MongoDB, Node.js, Express, and Tailwind CSS.

## Features

- ⚛️ **Tech Stack**: React.js, MongoDB, Node.js, Express, Tailwind
- 🔐 **Authentication**: JSON Web Tokens (JWT)
- 🔥 **React Query**: Efficient data fetching, caching, and synchronization
- 👥 **Suggested Users to Follow**
- ✍️ **Creating Posts**
- 🗑️ **Deleting Posts**
- 💬 **Commenting on Posts**
- ❤️ **Liking Posts**
- 🔒 **Delete Posts** (if you are the owner)
- 📝 **Edit Profile Info**
- 🖼️ **Edit Cover Image and Profile Image**
- 📷 **Image Uploads using Cloudinary**
- 🔔 **Send Notifications**

## Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Subhashree-Nayak507/social_deployment.git
cd social-deployment
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory and add the following variables:
```env
MONGO_URI=your_mongodb_connection_string
PORT=your_port_number
JWT_SECRET=your_jwt_secret
NODE_ENV=development
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### 4. Build the App
```bash
npm run build
```

### 5. Start the App
```bash
npm start
```

