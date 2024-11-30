# Legal Assistant

Frontend: [![Vercel Frontend Deployment Status](https://img.shields.io/github/deployments/sharanry/legal-assistant/Production?label=vercel&logo=vercel&logoColor=white)](https://legal-assistant-bay.vercel.app/)

Backend: [![Vercel Backend Deployment Status](https://img.shields.io/github/deployments/sharanry/legal-assistant/Production?label=vercel&logo=vercel&logoColor=white)](./)

A simple AI-powered legal document analysis tool that helps lawyers and legal professionals efficiently review and analyze contracts and legal documents.

## ✨ Features

- 📄 PDF document upload and viewing
- 🔍 AI-powered contract analysis
- 📋 Clause extraction and categorization
- 📝 Contract history tracking

## 🏗️ Architecture

### Frontend
- **Framework**: React with Material-UI components
- **Key Components**:
  - Contract header for metadata display (parties, dates, values)
  - File upload interface
  - PDF viewer
  - Clauses table with critical section highlighting
    - Indemnification clauses
    - Termination clauses 
    - Liability clauses
- **State Management**: React hooks for contract data and UI interactions
- **Future Scope**:
  - More well thought out UI/UX
    - Drag and drop file upload
    - Navigable to different sections of the contract by clicking on clauses
  - More modern looking UI components

### Backend Server
- **Core**: Express.js server for contract analysis
- **File Handling**:
  - PDF upload via Multer middleware
  - Temporary storage in /tmp directory
  - Automatic cleanup after processing
- **Security**:
  - CORS protection
  - Whitelisted frontend origins
- **API Endpoints**:
  - `/api/analyze-contract`:
    - PDF text extraction with LangChain
    - Structured prompt generation
    - OpenRouter API integration
    - JSON response with metadata, clauses and issues
- **Operations**:
  - Comprehensive request logging
  - Error handling throughout pipeline

- **Future Scope**:
  - Testing each step of the pipeline
    - Unit testing of the LLM calls
  - Traceability of LLM provider response times, costs, and token usage.

### ML/AI Architecture
- **Document Processing**: 
  - PDF text extraction with LangChain
  - Custom preprocessing pipeline for legal documents
  - Structured data extraction using prompting and langchain's robust parser

- **Model Provider**: OpenRouter
  - Flexible model switching (Claude-2, GPT-4, Mistral, etc.)
  - Cost-effective scaling with model selection
  - Single API interface for multiple models
  - Pay-as-you-go pricing model

- **Prompt Engineering**:
  - Context-aware system prompts
  - Structured output prompting

- **Future Scope**:
  - More comprehensive clause analysis
    - More robust parsing of clauses
    - More advanced prompting to extract more information
  - Robustness and efficiency using structured outputs
    - Guaranteeing robustness using structured outputs using frameworks like outlines or guidance.


## 🚀 Deployment

### Vercel Deployment
- Auto-deployed from main branch
- Secret Keys: Securely managed through Vercel
