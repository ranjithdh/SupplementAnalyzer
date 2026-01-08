<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Supplement Analyzer

An autonomous web scraping and content analysis agent that extracts structured data from URLs using Gemini AI. This tool is specifically optimized for extracting nutritional information and supplement facts.

## Features

- **Autonomous Extraction**: Powered by Gemini 3 Flash Preview with Google Search grounding.
- **Visual Analysis**: Polished UI that mirrors physical Supplement Facts labels.
- **Structured Data**: Extracts data into a clean JSON format for easy integration.
- **Multimodal Support**: Can analyze product pages using both URLs and optional label images.
- **Modern UI/UX**: Dark theme with professional brand colors and interactive analysis states.

## Run Locally

**Prerequisites:** Node.js

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set the API Key:**
   Create a `.env` file (or set in your environment):
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

3. **Run the app:**
   ```bash
   npm run dev
   ```

4. **Access the tool:**
   Open your browser at `http://localhost:3000`.
