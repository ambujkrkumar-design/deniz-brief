const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';

// Lyra context injected into every request
const LYRA_CONTEXT = `You are an AI assistant built into "The Deniz Brief" — a weekly intelligence briefing for Deniz, SVP of Client Transformation at Lyra Technology Group. Lyra is a Managed Service Provider (MSP) that manages IT for mid-market companies. Deniz advises C-suite clients on technology strategy. She is sharp, busy, and client-facing. Keep all answers concise, practical, and filtered through the lens of MSPs and mid-market IT decision-makers. Never use jargon without explaining it. Speak to her as a peer, not a student.`;

export default {
  async fetch(request, env) {

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return corsResponse('', 204);
    }

    const url = new URL(request.url);

    // ── /chat endpoint ─────────────────────────────────────
    if (url.pathname === '/chat' && request.method === 'POST') {
      const { question, topic } = await request.json();

      const prompt = `${LYRA_CONTEXT}

The user is reading a briefing topic titled: "${topic.title}"

Here is the full context of that topic:
${topic.deep_dive}

Lyra client impact: ${topic.lyra_impact}

The user is now asking a follow-up question: "${question}"

Answer in 3-5 sentences. Be specific and practical. Focus on what it means for mid-market companies or MSPs.`;

      const answer = await callClaude(prompt, env.ANTHROPIC_API_KEY);
      return corsResponse(JSON.stringify({ answer }), 200);
    }

    // ── /meeting-prep endpoint ─────────────────────────────
    if (url.pathname === '/meeting-prep' && request.method === 'POST') {
      const { who, topics } = await request.json();

      const topicSummaries = topics.map(t =>
        `- ${t.title}: ${t.one_liner}`
      ).join('\n');

      const prompt = `${LYRA_CONTEXT}

Deniz has the following meeting: "${who}"

This week's AI briefing covers these 5 topics:
${topicSummaries}

Your job:
1. Identify which 2-3 topics are most relevant to this specific meeting
2. For each relevant topic, give Deniz one thing to say — a specific, confident sentence she can use verbatim
3. End with one sentence on the overall AI narrative she should project in this meeting

Keep the total response under 200 words. Format it cleanly — no bullet symbols, just clear labeled sections.`;

      const prep = await callClaude(prompt, env.ANTHROPIC_API_KEY);
      return corsResponse(JSON.stringify({ prep }), 200);
    }

    return corsResponse('Not found', 404);
  }
};

// ── Call Claude API ────────────────────────────────────────
async function callClaude(prompt, apiKey) {
  const response = await fetch(ANTHROPIC_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }]
    })
  });

  const data = await response.json();
  return data.content[0].text;
}

// ── CORS helper ───────────────────────────────────────────
function corsResponse(body, status) {
  return new Response(body, {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}
