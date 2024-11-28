# Legal Assistant

[![Vercel Frontend Deployment Status](https://img.shields.io/github/deployments/sharanry/legal-assistant/Production?label=vercel&logo=vercel&logoColor=white)](https://legal-assistant-bay.vercel.app/)
[![Vercel Backend Deployment Status](https://img.shields.io/github/deployments/sharanry/legal-assistant/Production?label=vercel&logo=vercel&logoColor=white)](./)

A simple AI-powered legal document analysis tool that helps lawyers and legal professionals efficiently review and analyze contracts and legal documents.

## ✨ Features

- 📄 PDF document upload and viewing
- 🔍 AI-powered contract analysis
- 📋 Clause extraction and categorization
- 📝 Contract history tracking

## 🛠️ Tech Stack

- **Frontend:**
  - React.js
  - PDF.js for document viewing
  - Axios for API requests
  - Material-UI components

- **Backend:**
  - Node.js
  - Express.js
  - OpenAI API integration
  - File system management

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- OpenRouter API key

### Instructions to run locally

```bash
# Clone the repository
git clone https://github.com/sharanry/legal-assistant.git

# Navigate to project directory
cd legal-assistant

# Install server dependencies
npm install --prefix server

# Install client dependencies 
npm install --prefix client

# Run the server in the background
npm start --prefix server &

# Run the client in the foreground
npm start --prefix client
```
