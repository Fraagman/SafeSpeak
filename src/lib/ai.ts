export type RedactResult = {
  redacted: string;
  entities: { type: string; text: string }[];
};

export type ClassifyResult = {
  tags: string[];
  severity: number; // 1 (low) to 5 (very severe)
  urgency: "low" | "medium" | "high" | "immediate";
  summary: string;
};

type ScrubMatch = {
  start: number;
  end: number;
  text: string;
  type: string;
  placeholder: string;
  priority: number;
};

type PatternConfig = {
  type: string;
  placeholder: string;
  regex: RegExp;
  priority: number;
  validate?: (match: string) => boolean;
};

const SCRUB_PATTERNS: PatternConfig[] = [
  {
    type: "CARD",
    placeholder: "[CARD]",
    regex: /\b(?:\d[\s-]?){12,18}\d\b/g,
    priority: 4,
    validate: (match) => {
      const digits = match.replace(/\D+/g, "");
      return digits.length >= 13 && digits.length <= 16;
    },
  },
  {
    type: "EMAIL",
    placeholder: "[EMAIL]",
    regex: /\b[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}\b/gi,
    priority: 3,
  },
  {
    type: "PHONE",
    placeholder: "[PHONE]",
    regex: /\b(?:\+?\d{1,3}[\s-]?)?(?:\(?\d{2,4}\)?[\s-]?){2,4}\d{2,4}\b/g,
    priority: 2,
    validate: (match) => {
      const digits = match.replace(/\D+/g, "");
      return digits.length >= 7 && digits.length <= 15;
    },
  },
  {
    type: "IP",
    placeholder: "[IP]",
    regex: /\b(?:(?:25[0-5]|2[0-4]\d|1?\d?\d)\.){3}(?:25[0-5]|2[0-4]\d|1?\d?\d)\b/g,
    priority: 1,
  },
];

export function basicScrub(input: string): RedactResult {
  const matches: ScrubMatch[] = [];

  SCRUB_PATTERNS.forEach((pattern) => {
    const regex = new RegExp(pattern.regex.source, pattern.regex.flags);
    let execResult: RegExpExecArray | null;

    while ((execResult = regex.exec(input)) !== null) {
      const matchedText = execResult[0];
      const start = execResult.index;
      const end = start + matchedText.length;

      if (pattern.validate && !pattern.validate(matchedText)) {
        continue;
      }

      let overlaps = false;
      for (let i = matches.length - 1; i >= 0; i -= 1) {
        const existing = matches[i];
        const overlap = start < existing.end && existing.start < end;
        if (overlap) {
          if (pattern.priority > existing.priority) {
            matches.splice(i, 1);
          } else {
            overlaps = true;
            break;
          }
        }
      }

      if (overlaps) {
        continue;
      }

      matches.push({
        start,
        end,
        text: matchedText,
        type: pattern.type,
        placeholder: pattern.placeholder,
        priority: pattern.priority,
      });
    }
  });

  if (matches.length === 0) {
    return { redacted: input, entities: [] };
  }

  matches.sort((a, b) => a.start - b.start);

  let cursor = 0;
  let redacted = "";
  const entities = matches.map(({ type, text }) => ({ type, text }));

  matches.forEach((match) => {
    redacted += input.slice(cursor, match.start);
    redacted += match.placeholder;
    cursor = match.end;
  });

  redacted += input.slice(cursor);

  return { redacted, entities };
}

const TAG_RULES: Array<{ tag: string; keywords: string[] }> = [
  { tag: "stalking", keywords: ["stalk", "follow", "track"] },
  { tag: "physical", keywords: ["hit", "punch", "slap", "grab", "grope", "assault"] },
  {
    tag: "online",
    keywords: [
      "online",
      "dm",
      "social",
      "email",
      "message",
      "chat",
      "whatsapp",
      "telegram",
    ],
  },
  { tag: "verbal", keywords: ["verbal", "yell", "insult", "abuse", "threat"] },
  { tag: "workplace", keywords: ["work", "office", "boss", "manager", "coworker", "hr"] },
  { tag: "public", keywords: ["street", "bus", "train", "public", "market"] },
  { tag: "sexual", keywords: ["sexual", "catcall", "explicit", "indecent"] },
  { tag: "threat", keywords: ["threat", "kill", "weapon", "knife", "gun", "danger"] },
];

const SEVERITY_RULES: Array<{ level: number; keywords: string[] }> = [
  { level: 5, keywords: ["gun", "knife", "weapon", "kill", "rape"] },
  { level: 4, keywords: ["assault", "attack", "injur", "bleed", "hospital"] },
  { level: 3, keywords: ["threat", "stalk", "follow"] },
];

const URGENCY_KEYWORDS = ["immediate", "now", "urgent", "danger"];

const MIN_SUMMARY_LENGTH = 160;
const MAX_SUMMARY_LENGTH = 300;

function includesKeyword(text: string, keywords: string[]): boolean {
  return keywords.some((keyword) => text.includes(keyword));
}

function buildSummary(source: string): string {
  const trimmed = source.trim();
  if (!trimmed) {
    return "";
  }

  const sentenceMatch = trimmed.match(/^(.*?[.!?])(?:\s|$)/);
  if (sentenceMatch && sentenceMatch[1]) {
    return sentenceMatch[1].trim();
  }

  const targetLength = Math.min(
    MAX_SUMMARY_LENGTH,
    Math.max(MIN_SUMMARY_LENGTH, trimmed.length),
  );
  return trimmed.slice(0, targetLength).trim();
}

export function classifyHeuristic(text: string): ClassifyResult {
  const normalized = text.toLowerCase();
  const tags = new Set<string>();

  TAG_RULES.forEach((rule) => {
    if (includesKeyword(normalized, rule.keywords)) {
      tags.add(rule.tag);
    }
  });

  const severityRule = SEVERITY_RULES.find((rule) => includesKeyword(normalized, rule.keywords));
  const severity = severityRule ? ruleClamp(severityRule.level) : 2;

  let urgency: "low" | "medium" | "high" | "immediate" = "medium";
  if (severity >= 5 || includesKeyword(normalized, URGENCY_KEYWORDS)) {
    urgency = "immediate";
  } else if (severity === 4) {
    urgency = "high";
  }

  if (tags.size === 0) {
    tags.add("verbal");
  }

  const summary = buildSummary(text);
  const limitedTags = Array.from(tags).slice(0, 5);

  return {
    tags: limitedTags,
    severity,
    urgency,
    summary,
  };
}

function ruleClamp(level: number): number {
  if (level < 1) {
    return 1;
  }
  if (level > 5) {
    return 5;
  }
  return level;
}
