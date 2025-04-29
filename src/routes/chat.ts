import express from 'express';
import { getGeminiResponse } from '../utils/gemini';

const router = express.Router();

router.post('/message', async (req, res) => {
  const { message } = req.body;

  try {
    const response = await getGeminiResponse(message);
    res.json({ response });
  } catch (error) {
    console.error('Gemini Error:', error instanceof Error ? error.message : error);
    res.status(500).json({ error: 'Failed to get a response from Gemini.' });
  }
});


export default router;
