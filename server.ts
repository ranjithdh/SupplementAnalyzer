import dotenv from 'dotenv';
// Load environment variables - try .env.local first, then .env
dotenv.config({ path: '.env.local' });
dotenv.config(); // This will load .env as a fallback (won't override existing vars)

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { analyzeUrl } from './services/geminiService';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

// Diagnostic: Check if API key is present
if (!process.env.GEMINI_API_KEY) {
    console.warn('WARNING: GEMINI_API_KEY is not set in environment variables.');
} else {
    console.log('GEMINI_API_KEY is present (length: ' + process.env.GEMINI_API_KEY.length + ')');
}

// Middleware to parse JSON bodies
app.use(express.json());

// Health Check
app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

// Test Endpoint
app.get('/api/test', (req, res) => {
    res.json({
        status: 'ok',
        env: {
            hasApiKey: !!process.env.GEMINI_API_KEY,
            port: PORT,
            nodeEnv: process.env.NODE_ENV
        }
    });
});

// API Endpoint for Analysis
app.post('/api/analyze', async (req, res) => {
    const { url, imageUrl } = req.body;
    console.log(`Received analysis request for URL: ${url}`);

    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        const result = await analyzeUrl(url, imageUrl);
        res.json(result);
    } catch (error: any) {
        console.error('API Error:', error);
        res.status(500).json({ error: error.message || 'An error occurred during analysis' });
    }
});

// Serve static files from the build directory
app.use(express.static(path.join(__dirname, 'dist')));

// Send all other requests to the React app (Express 5 requires named wildcard)
app.get('/{*path}', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:${PORT}`);
});
