# Vedant AI

A simple full-stack AI chatbot website.

## Run locally

1. Install Node.js.
2. Open a terminal in this folder.
3. Run:
   npm install
4. Copy `.env.example` to `.env`.
5. Put your AI API key in `.env`:
   OPENAI_API_KEY=...
6. Run:
   npm start
7. Open http://localhost:3000

## Publish

Deploy this Node/Express project to a service that supports Node.js.
Set the environment variable `OPENAI_API_KEY` in the host's environment settings.
Do NOT put the API key inside `public/index.html` or other browser code.

The visible brand is "Vedant AI"; you can also connect a custom domain such as vedantai.example once you have a domain and hosting account.

Note: the model name in `server.js` must be changed if the API account you use does not have access to that model.
