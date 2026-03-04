# AI Chatbot Widget

A production-ready RAG (Retrieval-Augmented Generation) chatbot that lets users chat with the content of any website in real time.

## Live Demo

[chatbot-widget-plum.vercel.app](https://chatbot-widget-plum.vercel.app/)

Paste any URL, wait 10 to 20 seconds, and ask questions about its content.

## What it does

Most AI chatbots answer from general knowledge and hallucinate when asked about specific business content. This widget solves that by grounding every answer exclusively in the content of a given website. If the answer is not on the page, the chatbot says so.

This makes it directly useful for:

- Customer support bots trained on a company's documentation
- Product assistants that answer questions about a specific service
- Internal tools that let teams query knowledge bases in plain language

## How it works

1. The user pastes a URL
2. The backend fetches and cleans the page content
3. The text is split into overlapping chunks and converted into vector embeddings using OpenAI
4. When the user asks a question, the most semantically relevant chunks are retrieved via cosine similarity search
5. Those chunks are sent to GPT-4o as context, which generates a grounded answer

## Tech Stack

- **Frontend:** Next.js, TypeScript, TailwindCSS, shadcn/ui, Zustand
- **Backend:** Next.js API Routes, Node.js
- **AI:** OpenAI GPT-4o, text-embedding-3-small
- **Deployment:** Vercel

## Key Technical Decisions

**No vector database.** Embeddings are stored in memory on the client side and sent with each request. This eliminates infrastructure complexity for single-session use cases while keeping the architecture easy to extend with pgvector or Pinecone when scale requires it.

**Chunk overlap.** Each text chunk shares 50 words with the previous one to prevent meaning from being lost at boundaries, improving retrieval accuracy on longer pages.

**Client-side chunk storage via Zustand.** The ingested knowledge base lives in the browser session, making the app fully stateless on the backend and trivially scalable.

## About

Built by Franco Hormazabal, a Full Stack Engineer with a strong background in Full Stack production systems. Currently expanding into React and AI integrations.

[linkedin.com/in/franco-hormazabal](https://www.linkedin.com/in/franco-hormazabal)
