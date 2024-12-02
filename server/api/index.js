import express from 'express';
import cors from 'cors';
import multer from 'multer';
import OpenAI from 'openai';
import fs from 'fs';
import dotenv from 'dotenv';
import logger from '../utils/logger.js';
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { StructuredOutputParser } from "langchain/output_parsers";
import { z } from "zod";
dotenv.config();

// Define the schema for potential issues
const potentialIssueSchema = z.object({
  severity: z.enum(["high", "medium", "low"]),
  description: z.string(),
  recommendation: z.string()
});

// Define the schema for a clause
const clauseSchema = z.object({
  title: z.string(),
  summary: z.string(),
  location: z.string(),
  potentialIssues: z.array(potentialIssueSchema)
});

// Define the schema for critical clauses
const criticalClauseSchema = clauseSchema.extend({
  present: z.boolean()
});

// Define the complete output schema
const contractAnalysisSchema = z.object({
  metadata: z.object({
    contractType: z.string(),
    parties: z.object({
      provider: z.string(),
      client: z.string()
    }),
    effectiveDate: z.string(),
    contractValue: z.string()
  }),
  criticalClauses: z.object({
    indemnification: criticalClauseSchema,
    termination: criticalClauseSchema,
    liability: criticalClauseSchema
  }),
  clauses: z.array(clauseSchema.extend({
    type: z.string()
  }))
});

// Create the parser
const parser = StructuredOutputParser.fromZodSchema(contractAnalysisSchema);

const app = express();
const upload = multer({ 
  dest: '/tmp',
});

// In-memory job storage (replace with Redis/DB in production)
const jobs = new Map();

app.use(cors());
app.use(express.json());

// whitelist frontend origin
const whitelist = ['http://localhost:3000', "https://legal-assistant-bay.vercel.app"];
const corsOptions = {
  origin: (origin, callback) => {
    logger.log(`Origin: ${origin}`);
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
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

    const jobId = Date.now().toString();
    jobs.set(jobId, {
      status: 'processing',
      filePath: req.file.path,
      result: null,
      error: null
    });

    // Start processing in background
    processContract(jobId, req.file).catch(error => {
      logger.error('Error in background processing', error);
      jobs.set(jobId, {
        status: 'error',
        filePath: req.file.path,
        result: null,
        error: error.message
      });
    });

    // Return immediately with job ID
    res.json({ jobId });

  } catch (error) {
    logger.error('Error initiating contract analysis', error);
    res.status(500).json({ error: 'Failed to initiate contract analysis' });
  }
});

app.get('/api/job-status/:jobId', (req, res) => {
  const jobId = req.params.jobId;
  const job = jobs.get(jobId);

  if (!job) {
    return res.status(404).json({ error: 'Job not found' });
  }

  // If job is complete, clean up
  if (job.status === 'completed' || job.status === 'error') {
    // Clean up file after sending response
    if (job.filePath) {
      fs.unlink(job.filePath, (err) => {
        if (err) logger.error('Error deleting temporary file', err);
        else logger.log('Temporary file cleaned up');
      });
    }
    // Remove job from memory after 5 minutes
    setTimeout(() => jobs.delete(jobId), 5 * 60 * 1000);
  }

  res.json({
    status: job.status,
    result: job.result,
    error: job.error
  });
});

// Background processing function
async function processContract(jobId, file) {
  try {
    logger.log(`Processing file: ${file.originalname}`);
    const loader = new PDFLoader(file.path, {
      splitPages: false,
    });
    const docs = await loader.load();
    const pdfData = docs[0].pageContent;

    if (!pdfData) {
      throw new Error('No text extracted from PDF');
    }

    // Get the format instructions
    const formatInstructions = parser.getFormatInstructions();

    const prompt = `Analyze this contract and extract metadata, clauses, and potential issues. Make sure to ALWAYS include Indemnification, Termination, and Liability clauses if they are present in the contract, even if there are other clauses that might seem more important.

${formatInstructions}

Pay special attention to Indemnification, Termination, and Liability clauses. These MUST be included in the analysis if they are present in the contract.

Contract text:
${pdfData}`;

    logger.log('Sending request to OpenRouter API');
    const response = await openai.chat.completions.create({
      model: "anthropic/claude-3.5-haiku-20241022:beta",
      messages: [{
        role: "user",
        content: prompt
      }]
    });

    // Parse and validate the response
    const analysis = await parser.parse(response.choices[0].message.content);
    
    logger.log(`Successfully analyzed contract with ${analysis.clauses.length} clauses`);
    
    // Update job with success result
    jobs.set(jobId, {
      status: 'completed',
      filePath: file.path,
      result: analysis,
      error: null
    });

  } catch (error) {
    logger.error('Error processing contract', error);
    // Provide more detailed error message for parsing failures
    const errorMessage = error.name === 'ZodError' 
      ? `Invalid response format: ${error.errors.map(e => e.message).join(', ')}`
      : error.message;
      
    jobs.set(jobId, {
      status: 'error',
      filePath: file.path,
      result: null,
      error: errorMessage
    });
  }
}

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  logger.log(`Server running on port ${PORT}`);
});
