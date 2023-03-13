/* eslint-disable @typescript-eslint/naming-convention */
import * as vscode from 'vscode';

export const search_prompts: { [engine: string] : string; } = {
  'Scopus': `
    next, generate a few valid Scopus search queries, based on the questions and prompt, using standard Scopus operators.
    try to use various search strategies in the multiple queries. for example, if asked to compare topics A and B, you could search for ("A" AND "B"),
    and you could also search for ("A" OR "B") and then compare the results.
    only if explicitly required in the prompt, you can use additional operators to filter the results, like the publication year, language, subject area, or DOI (when provided).
    try to keep the search queries short and simple, and not too specific (consider ambiguities).`,
  'Semantic Scholar': `
    next, generate a few valid Semantic Scholar search queries, based on the questions and prompt, by concatenating with "+" a few keywords.
    try to use various search strategies in the multiple queries. for example, if asked to compare topics A and B, you could search for A+B,
    and you could also search for A or B in separate queries and then compare the results.
    only if explicitly required in the prompt, you can use additional fields to filter the results, such as &year=, &publicationTypes=, &fieldsOfStudy=.
    keep the search queries short and simple.`,
};

export interface JarvisSettings {
  openai_api_key: string;
  scopus_api_key: string;
  springer_api_key: string;
  model: string;
  temperature: number;
  max_tokens: number;
  top_p: number;
  frequency_penalty: number;
  presence_penalty: number;
  timeout: number;
  paper_search_engine: string;
  use_wikipedia: boolean;
  paper_space: number;
  paper_tokens: number;
  include_paper_summary: boolean;
};

export function get_settings(): JarvisSettings {
  const settings = vscode.workspace.getConfiguration('jarvis');
  return {
    openai_api_key: settings.get('openAI.apiKey') as string,
    scopus_api_key: settings.get('scopus.apiKey') as string,
    springer_api_key: settings.get('springer.apiKey') as string,
    model: settings.get('openAI.model') as string,
    temperature: settings.get('openAI.temperature') as number,
    max_tokens: settings.get('openAI.maxTokens') as number,
    top_p: settings.get('openAI.topP') as number,
    frequency_penalty: settings.get('openAI.frequencyPenalty') as number,
    presence_penalty: settings.get('openAI.presencePenalty') as number,
    timeout: 1000*(settings.get('openAI.timeout') as number),
    paper_search_engine: settings.get('research.searchEngine') as string,
    use_wikipedia: settings.get('research.searchWikipedia') as boolean,
    paper_space: settings.get('research.paperSpace') as number,
    paper_tokens: settings.get('research.paperTokens') as number,
    include_paper_summary: settings.get('research.includeSummary') as boolean,
  };
}
