#!/bin/bash

# 🚀 VietFuture AI Integration - Testing Guide

echo "=========================================="
echo "VietFuture AI Chatbot - Setup Guide"
echo "=========================================="
echo ""

echo "1️⃣  Starting Backend Server..."
echo "📁 Navigate to: cd BE"
echo "📦 Install dependencies: npm install"
echo "🚀 Start server: npm run dev"
echo ""

echo "2️⃣  Starting Frontend Development Server..."
echo "📁 Navigate to: cd FE"
echo "📦 Install dependencies: npm install"
echo "🚀 Start frontend: npm start"
echo ""

echo "3️⃣  Testing API Endpoints"
echo ""
echo "📝 Create test CV file: test_cv.txt"
echo ""
echo "Test endpoints with curl:"
echo ""

echo "🤖 General Chat:"
echo 'curl -X POST http://localhost:5000/api/coze/chat \'
echo '  -H "Content-Type: application/json" \'
echo '  -d '"'"'{
    "message": "Xin chào, bạn là ai?",
    "user_id": 1
  }'"'"''
echo ""

echo "📊 Analyze CV (Capability Assessment):"
echo 'curl -X POST http://localhost:5000/api/cv-analysis/analyze-capability \'
echo '  -H "Content-Type: application/json" \'
echo '  -d '"'"'{
    "cvContent": "...",
    "user_id": 1
  }'"'"''
echo ""

echo "📄 CV Analysis (Coze):"
echo 'curl -X POST http://localhost:5000/api/coze/analyze-cv \'
echo '  -H "Content-Type: application/json" \'
echo '  -d '"'"'{
    "cvContent": "...",
    "user_id": 1
  }'"'"''
echo ""

echo "❓ Ask About CV (Coze):"
echo 'curl -X POST http://localhost:5000/api/coze/ask-cv \'
echo '  -H "Content-Type: application/json" \'
echo '  -d '"'"'{
    "cvContent": "...",
    "question": "What are my main skills?",
    "user_id": 1
  }'"'"''
echo ""

echo "=========================================="
echo "🎯 Requirements Check"
echo "=========================================="
echo ""
echo "✅ Backend .env file:"
echo "  - DATABASE_URL: mysql://root:123456@localhost:3306/vietfuture"
echo "  - JWT_SECRET: (your secret)"
echo "  - COZE_API_KEY: pat_bG4AfkP3IX2OYaTD5IwTKA0ZK6ZCzdVYHqjTv11t4y1uGZ3KPukw1S4UaEXkWiyN"
echo "  - COZE_BOT_ID: 86998725321256574693362796989143"
echo "  - COZE_API_URL: https://api.coze.com/v1"
echo ""
echo "✅ Frontend .env file:"
echo "  - REACT_APP_API_URL=http://localhost:5000/api"
echo ""

echo "=========================================="
echo "🐛 Troubleshooting"
echo "=========================================="
echo ""
echo "❌ 'Cannot find module' errors:"
echo "   → Run: npm install in BE and FE folders"
echo ""
echo "❌ 'COZE_API_KEY not found':"
echo "   → Check .env file has correct Coze credentials"
echo ""
echo "❌ 'User has no roadmap':"
echo "   → User must have completed upload CV and assessment first"
echo ""
echo "❌ API returns 'Failed to get response from Coze':"
echo "   → Check Coze API key validity"
echo "   → Check internet connection"
echo "   → Check Coze server status"
echo ""

echo "=========================================="
