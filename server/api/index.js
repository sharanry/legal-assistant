import express from 'express';
import cors from 'cors';
import multer from 'multer';
import OpenAI from 'openai';
import fs from 'fs';
import dotenv from 'dotenv';
import logger from '../utils/logger.js';
import { JsonOutputParser } from '@langchain/core/output_parsers';
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
dotenv.config();


const app = express();
const upload = multer({ 
  dest: '/tmp',
});

app.use(cors());
app.use(express.json());

// whitelist frontend origin
const whitelist = ['http://localhost:3000', "https://legal-assistant-bay.vercel.app"];
const corsOptions = {
  origin: '*',
  credentials: true,
};
app.use(cors(corsOptions));


// Request logging middleware
app.use((req, res, next) => {
  logger.request(req);
  next();
});

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
});

app.get('/api/health', (req, res) => {
    res.send('OK');
  });


app.post('/api/analyze-contract', upload.single('pdf'), async (req, res) => {
  try {
    logger.log('Received contract analysis request');

    if (!req.file) {
      logger.error('No PDF file uploaded');
      return res.status(400).json({ error: 'No PDF file uploaded' });
    }

    logger.log(`PDF file path: ${req.file.path}`);

    logger.log(`Processing file: ${req.file.originalname}`);
    const loader = new PDFLoader(req.file.path, {
        splitPages: false,
    });
    const docs = await loader.load();
    const pdfData = docs[0].pageContent;

    if (!pdfData) {
      logger.error('No text extracted from PDF');
      return res.status(400).json({ error: 'No text extracted from PDF' });
    }

    const prompt = `Analyze this contract and extract metadata, clauses, and potential issues. Make sure to ALWAYS include Indemnification, Termination, and Liability clauses if they are present in the contract, even if there are other clauses that might seem more important. Format the response as JSON with the following structure:
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
    "criticalClauses": {
        "indemnification": {
            "present": boolean,
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
        },
        "termination": {
            "present": boolean,
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
        },
        "liability": {
            "present": boolean,
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

Pay special attention to Indemnification, Termination, and Liability clauses. These MUST be included in the analysis if they are present in the contract.

Contract text:
${pdfData}`
    
    logger.log('Sending request to OpenRouter API');
    logger.log(prompt);
    const response = await openai.chat.completions.create({
      model: "anthropic/claude-3.5-haiku-20241022:beta",
      messages: [{
        role: "user",
        content: prompt
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

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  logger.log(`Server running on port ${PORT}`);
});
