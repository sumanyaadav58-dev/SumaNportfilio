# Suman Yadav, Portfolio Dashboard

A responsive portfolio with a dashboard layout. Frontend is plain HTML, CSS and JavaScript. The optional Node backend stores contact messages.

## Run locally
    npm install
    npm start
Open http://localhost:3000

## Deploy
**Static hosting (GitHub Pages, Netlify, Vercel):** upload the `public/` folder. The contact form falls back to opening your email app, so it still works.

**With the backend (Render, Railway, Fly.io, any VPS):** push this folder to GitHub, create a Node web service, build command `npm install`, start command `npm start`. Set `ADMIN_KEY` to a secret value, then read messages with:
    curl -H "x-admin-key: YOUR_KEY" https://your-site/api/messages

## Edit your content
- Everything is in `public/index.html`: project, skill and stat lists are at the top of the `<script>`, text is in the scene sections, styles are in the `<style>` block
- CV: replace `public/assets/Suman_Yadav_CV.pdf`
