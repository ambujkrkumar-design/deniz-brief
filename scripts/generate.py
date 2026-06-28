import anthropic
import json
import os
from datetime import datetime

client = anthropic.Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])

PROMPT = """You are curating a weekly AI intelligence briefing for Deniz, SVP of Client Transformation at Lyra Technology Group. Lyra is a Managed Service Provider (MSP) that manages IT for mid-market companies. Deniz advises C-suite clients on technology strategy. She is sharp, busy, and client-facing.

Generate exactly 5 AI topics that are relevant THIS week. Each topic must be something that actually happened or emerged in the last 7 days. Filter everything through this lens: how does this affect mid-market companies, MSPs, or C-suite technology decisions?

Return ONLY a valid JSON object with this exact structure — no preamble, no markdown, no explanation:

{
  "week": "<Month Day, Year>",
  "topics": [
    {
      "id": 1,
      "title": "<short punchy title>",
      "one_liner": "<one sentence: what happened and why it matters for mid-market IT clients>",
      "deep_dive": "<3-4 sentences: what happened, the technical context, and the broader implications>",
      "lyra_impact": "<2-3 sentences: specifically how this affects MSPs or Lyra's mid-market clients>",
      "conversation_line": "<one sentence Deniz can say verbatim in a client meeting to sound informed>"
    }
  ]
}

Today's date is """ + datetime.now().strftime("%B %d, %Y") + """."""

def generate_briefing():
    print("Calling Claude API...")

    message = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=4000,
        messages=[
            {"role": "user", "content": PROMPT}
        ]
    )

    raw = message.content[0].text
    print("Response received. Parsing JSON...")

    # Strip markdown code blocks if Claude wrapped the response
    clean = raw.strip()
    if clean.startswith("```"):
        clean = clean.split("```")[1]
        if clean.startswith("json"):
            clean = clean[4:]
    clean = clean.strip()

    # Parse and validate the JSON
    briefing = json.loads(clean)

    # Add metadata
    briefing["generated_at"] = datetime.utcnow().isoformat() + "Z"

    # Write to docs/briefing.json
    output_path = os.path.join(os.path.dirname(__file__), "../docs/briefing.json")
    with open(output_path, "w") as f:
        json.dump(briefing, f, indent=2)

    print(f"briefing.json written with {len(briefing['topics'])} topics.")
    print(f"Week: {briefing['week']}")

if __name__ == "__main__":
    generate_briefing()
