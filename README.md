# AI SDR + Meeting AI + Knowledge Base

A comprehensive AI-powered system that integrates multiple AI capabilities to enhance sales and customer relationship management. The system includes AI-driven lead generation, personalized email outreach, meeting analysis, and a knowledge base.

![System Architecture](./docs/system-architecture.png)

## Table of Contents

- [Overview](#overview)
- [Key Components](#key-components)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Architecture](#architecture)
- [Contributing](#contributing)
- [License](#license)

## Overview

This system is designed to transform the traditional sales development process by leveraging AI at every stage:

1. **AI Lead Generator & Analyzer**: Scrapes LinkedIn and other platforms to find potential leads and analyzes them for fit.
2. **Personalized AI Email Generator**: Creates highly personalized emails based on prospect data and pain points.
3. **AI Follow-up & Meeting Scheduler**: Monitors email responses and automates follow-ups.
4. **AI Meeting Notes & Knowledge Base**: Captures, summarizes, and makes searchable all meeting knowledge.

## Key Components

### Backend Components

- **FastAPI Backend**: RESTful API service that handles all requests
- **LinkedIn Scraper**: Selenium-based web scraper for LinkedIn data
- **LLM Service**: Integration with language models (via Groq)
- **Email Service**: Email generation and workflow management
- **Vector Service**: Embedding generation and vector database operations

### Frontend Components

- **Next.js Application**: Modern React-based UI
- **Dashboard**: Analytics and overview of prospects
- **Prospect View**: Details and management of potential customers
- **Email Editor**: AI-assisted email composition
- **Reply Tracker**: Monitor and respond to prospect replies
- **Knowledge Base UI**: Search and browse meeting insights

### Databases & Storage

- **Supabase**: Authentication and persistent data storage
- **Redis**: Caching and temporary data storage
- **Pinecone**: Vector database for semantic search

## Prerequisites

- Python 3.9+
- Node.js 18+
- Docker and Docker Compose (optional but recommended)
- Supabase account
- Redis instance
- Pinecone account
- Groq API key (or other LLM provider)
- Gmail API credentials (for email monitoring)

## Installation

You can set up this project using Docker Compose (recommended) or manual installation.

### Backend Setup

#### Option 1: Using Docker Compose

1. Clone the repository:
   ```bash
   git clone https://github.com/mohdjami/ai-sdr.git
   cd ai-sdr-system/backend
   ```

2. Create environment variables file:
   ```bash
   cp .env.example .env
   ```

3. Edit the `.env` file with your configuration (API keys, database URLs, etc.)

4. Run the Docker Compose:
   ```bash
   docker-compose up -d
   ```

#### Option 2: Manual Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ai-sdr-system.git
   cd ai-sdr-system/backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create environment variables file:
   ```bash
   cp .env.example .env
   ```

5. Edit the `.env` file with your configuration

6. Run Redis (if not using external instance):
   ```bash
   docker run -d -p 6379:6379 redis
   ```

7. Start the FastAPI server:
   ```bash
   uvicorn main:app --reload
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd ai-sdr-system/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment variables file:
   ```bash
   cp .env.example .env.local
   ```

4. Edit the `.env.local` file with your configuration (API URL, Supabase keys, etc.)

5. Start the development server:
   ```bash
   npm run dev
   ```

## Configuration

### Required Environment Variables

#### Backend (.env)

```
# FastAPI
PORT=8000

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Pinecone
PINECONE_API_KEY=your-api-key

# LLM Service
GROQ_API_KEY=your-api-key

# LinkedIn Credentials (for scraping)
LINKEDIN_EMAIL=your-email
LINKEDIN_PASSWORD=your-password

# Gmail API
GMAIL_CREDENTIALS=path-to-credentials.json

# Meeting Service
MEETING_API_KEY=your-api-key
```

#### Frontend (.env.local)

```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Usage

After installation and configuration, the system will be accessible at:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

### Getting Started

1. **Login to the system** using your Supabase credentials
2. **Generate leads** by going to the Prospects tab and clicking "Find Leads"
3. **Create personalized emails** by selecting a prospect and clicking "Draft Email"
4. **Monitor responses** in the Reply Tracker tab
5. **Schedule meetings** with interested prospects
6. **View meeting transcripts and insights** in the Knowledge Base tab

## API Documentation

The API documentation is available at `http://localhost:8000/docs` when the backend is running.

### Key Endpoints

- `GET /prospects` - Fetch qualified prospects
- `POST /draft-emails` - Generate email draft for a prospect
- `GET /track-replies` - Fetch and analyze new email replies
- `POST /add-bot` - Add bot to meeting and store details

## Architecture

### System Architecture

The system is built with a microservices architecture:

![Deployment Architecture](./docs/deployment-architecture.png)

### Data Flow

1. **Lead Generation Flow**:
   - LinkedIn scraper collects posts and profiles
   - LLM analyzes content to identify pain points and fit
   - Qualified prospects are stored in Redis and Supabase

2. **Email Generation Flow**:
   - Frontend sends prospect data to email generator
   - Email service processes through workflow (subject, content, refinement)
   - Final email draft is returned to frontend
   - User edits and sends email
   - Email is stored in Supabase for tracking

3. **Reply Monitoring Flow**:
   - System fetches new replies from Gmail
   - LLM analyzes sentiment and intent
   - Follow-up suggestions are generated
   - Results displayed in frontend

4. **Meeting Knowledge Flow**:
   - Meeting bot joins meetings via API
   - Transcripts processed by meeting analyzer
   - Key insights extracted and summarized
   - Meeting data stored in vector database
   - Users search and retrieve meeting knowledge

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.