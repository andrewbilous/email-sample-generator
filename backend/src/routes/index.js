import OpenAI from "openai";

import dotenv from 'dotenv';
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function routePromptToAssistant(prompt) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.0,
    messages: [
      {
        role: "system",
        content: 'Classify the prompt as one of: ["sales", "followup"]. Return only the label.'
      },
      { role: "user", content: prompt }
    ]
  });

  const label = completion.choices[0].message.content.trim().toLowerCase();
  return label === "sales" || label === "followup" ? label : "sales";
}


async function generateSalesEmail(prompt) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.7,
    messages: [
      {
        role: "system",
        content: `You are a senior SaaS sales copywriter. Craft a concise, value‑driven cold sales email. Respond ONLY with valid JSON like: {"subject":"...", "body":"..."}. No markdown, no explanations.`
      },
      { role: "user", content: prompt }
    ]
  });

  const raw = completion.choices[0].message.content;
  console.log('SALES GPT output:', raw);

  const cleaned = raw.replace(/```json|```/g, '').trim();

  let subject = '', body = '';
  try {
    const json = JSON.parse(cleaned);
    subject = json.subject ?? '';
    body = json.body ?? '';
  } catch (err) {
    console.error('❌ Failed to parse LLM response as JSON:', cleaned);
    throw new Error('Invalid JSON format from OpenAI');
  }

  return { subject, body };
}


async function generateFollowupEmail(prompt) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.7,
    messages: [
      {
        role: "system",
        content: `You are a professional customer-success rep. Write a polite follow-up email referencing a previous interaction. Respond ONLY with valid JSON like: {"subject": "...", "body": "..."}. No markdown, no explanations.`
      },
      { role: "user", content: prompt }
    ]
  });

  const raw = completion.choices[0].message.content;

  const cleaned = raw.replace(/```json|```/g, '').trim();

  let subject = '', body = '';
  try {
    const json = JSON.parse(cleaned);
    subject = json.subject ?? '';
    body = json.body ?? '';
  } catch (err) {
    console.error('❌ Failed to parse follow-up JSON:', cleaned);
    throw new Error('Invalid JSON from OpenAI in follow-up email');
  }

  return { subject, body };
}

export default async function routes(fastify, options) {

  fastify.get('/ping', async () => {
    return 'pong\n';
  });

  fastify.post('/emails', async (request) => {
    const { to, cc, bcc, subject, body } = request.body;

    const [id] = await fastify.knex('emails').insert({
      to,
      cc,
      bcc,
      subject,
      body,
      created_at: new Date()
    });

    return { id, to, cc, bcc, subject, body };
  });

  fastify.get('/emails', async () => {
    const emails = await fastify.knex('emails').select('*').orderBy('created_at', 'desc');
    return emails;
  });

 
  fastify.post('/route-email', async (request, reply) => {
    const { prompt } = request.body;
    try {
      const label = await routePromptToAssistant(prompt);
      return { label };
    } catch (err) {
      request.log.error(err);
      reply.code(500);
      return { error: 'AI classification failed' };
    }
  });

 
  fastify.post('/generate-email', async (request, reply) => {
    const { prompt } = request.body;

    try {

      const type = await routePromptToAssistant(prompt);


      let generated;
      if (type === 'sales') {
        generated = await generateSalesEmail(prompt);
      } else {
        generated = await generateFollowupEmail(prompt);
      }

      return { ...generated, type };
    } catch (err) {
      request.log.error(err);
      reply.code(500);
      return { error: 'Email generation failed' };
    }
  });
}
