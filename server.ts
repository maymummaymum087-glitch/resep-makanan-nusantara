import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Lazy initialize Gemini client
  let aiClient: GoogleGenAI | null = null;
  function getAIClient(): GoogleGenAI {
    if (!aiClient) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('GEMINI_API_KEY environment variable is not set.');
      }
      aiClient = new GoogleGenAI({ apiKey });
    }
    return aiClient;
  }

  // API Health Check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // AI Chef Assistant Endpoint
  app.post('/api/chef-ai', async (req, res) => {
    try {
      const { prompt, recipeContext, language = 'id' } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
      }

      const ai = getAIClient();
      const systemInstruction = `Anda adalah "Chef Nusantara", seorang ahli kuliner tradisional Indonesia yang sangat berpengalaman, ramah, dan membantu.
Tugas Anda adalah menjawab pertanyaan pengguna seputar resep masakan daerah Indonesia, tips memasak, substitusi bahan, teknik ungkep/tumis/kukus, serta variasi bumbu.
Gunakan bahasa Indonesia yang ramah, sopan, dan jelas.
Jika pengguna menanyakan sesuatu di luar topik kuliner/resep, ingatkan dengan ramah bahwa Anda difokuskan pada kuliner Nusantara.
Context Resep Saat Ini (jika ada): ${recipeContext ? JSON.stringify(recipeContext) : 'Tidak ada'}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      res.json({ answer: response.text });
    } catch (error: any) {
      console.error('Error in /api/chef-ai:', error);
      res.status(500).json({
        error: error.message || 'Gagal terhubung dengan Chef AI Nusantara',
        fallback: 'Maaf, Chef AI sedang beristirahat. Silakan pastikan kunci API Gemini sudah terkonfigurasi di pengaturan aplikasi.'
      });
    }
  });

  // AI Fridge / Leftover Recipe Generator
  app.post('/api/fridge-recipes', async (req, res) => {
    try {
      const { ingredients } = req.body;
      if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
        return res.status(400).json({ error: 'Ingredients array is required' });
      }

      const ai = getAIClient();
      const promptText = `Saya memiliki bahan-bahan berikut di kulkas: ${ingredients.join(', ')}.
Tolong berikan 2 ide masakan khas daerah Indonesia yang dapat dibuat dari bahan-bahan tersebut (atau dengan sedikit tambahan bumbu dapur standar).
Sajikan dalam format JSON array yang berisi object dengan properti:
- title (nama masakan)
- region (daerah asal)
- description (deskripsi singkat)
- extraIngredientsNeeded (array string bahan tambahan yang disarankan)
- summarySteps (array string 3-4 langkah utama singkat)
- cookTimeMinutes (angka estimasi menit)`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: promptText,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.6,
        },
      });

      let jsonResult;
      try {
        jsonResult = JSON.parse(response.text || '[]');
      } catch (e) {
        jsonResult = [];
      }

      res.json({ recipes: jsonResult });
    } catch (error: any) {
      console.error('Error in /api/fridge-recipes:', error);
      res.status(500).json({ error: error.message || 'Gagal memproses rekomendasi resep' });
    }
  });

  // Vite Development / Production Static Server Middleware
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Nusantara Recipe server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
