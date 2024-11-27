import express from 'express';
import cors from 'cors';
import multer from 'multer';
import OpenAI from 'openai';
import pdf from 'pdf-parse';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';
import logger from './utils/logger.js';
import { JsonOutputParser } from '@langchain/core/output_parsers';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  logger.request(req);
  next();
});

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_KEY,
});

app.post('/api/analyze-contract', upload.single('pdf'), async (req, res) => {
  try {
    logger.log('Received contract analysis request');

    if (!req.file) {
      logger.error('No PDF file uploaded');
      return res.status(400).json({ error: 'No PDF file uploaded' });
    }

    logger.log(`Processing file: ${req.file.originalname}`);
    const dataBuffer = await fs.promises.readFile(req.file.path);
    const pdfData = await pdf(dataBuffer);
    
    logger.log('Sending request to OpenRouter API');
    const response = await openai.chat.completions.create({
      model: "anthropic/claude-3.5-haiku-20241022:beta",
      messages: [{
        role: "user",
        content: `Analyze this contract and extract metadata, clauses, and potential issues. Format the response as JSON with the following structure:
        {
          "metadata": {
            "contractType": "type of contract (e.g., SaaS Agreement, Service Agreement)",
            "parties": {
              "provider": "name of the service provider/vendor",
              "client": "name of the client/customer"
            },
            "effectiveDate": "contract effective date if mentioned",
            "contractValue": "contract value if mentioned"
          },
          "clauses": [
            {
              "type": "clause type",
              "title": "clause title",
              "summary": "brief summary",
              "location": "section number or page",
              "potentialIssues": [
                {
                  "severity": "high|medium|low",
                  "description": "description of the potential issue",
                  "recommendation": "recommended action or improvement"
                }
              ]
            }
          ]
        }
        
        Contract text:
        ${pdfData.text}`
      }]
    });

    // Parse the JSON response
    let analysis;
    try {
      const parser = new JsonOutputParser();
      analysis = await parser.parse(response.choices[0].message.content);
    } catch (err) {
      logger.error('Failed to parse AI response', err);
      return res.status(500).json({ 
        error: 'Failed to parse contract analysis results',
        details: err.message
      });
    }
    
    logger.log(`Successfully analyzed contract with ${analysis.clauses.length} clauses`);
    res.json(analysis);

  } catch (error) {
    logger.error('Error analyzing contract', error);
    res.status(500).json({ error: 'Failed to analyze contract' });
  } finally {
    // Clean up uploaded file
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) logger.error('Error deleting temporary file', err);
        else logger.log('Temporary file cleaned up');
      });
    }
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  logger.log(`Server running on port ${PORT}`);
});
