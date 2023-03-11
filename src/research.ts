/* eslint-disable @typescript-eslint/naming-convention */
import * as vscode from 'vscode';
import { get_settings } from './settings';
import { query_completion } from './openai';
import { PaperInfo, SearchParams, search_papers, sample_and_summarize_papers } from './papers';
import { WikiInfo, search_wikipedia } from './wikipedia';
import { replace_selection } from './utils';

export async function do_research(prompt: string) {
  const settings = get_settings();
  const n_papers = settings.paper_space;
  const paper_tokens = Math.ceil(settings.paper_tokens / 100 * settings.max_tokens);
  const use_wikipedia = settings.use_wikipedia;

  let [papers, search] = await search_papers(prompt, n_papers, settings);
  console.log(`papers: ${papers.length}`);

  replace_selection(search.response);
  let wiki_search: Promise<WikiInfo> = Promise.resolve({ summary: '' });
  if ( use_wikipedia && (papers.length > 0) ) {
    // start search in parallel to paper summary
    wiki_search = search_wikipedia(prompt, search, settings);
  }
  papers = await sample_and_summarize_papers(papers, paper_tokens, search, settings);
  console.log(`papers sampled and summarized (${papers.length})`);

  if (papers.length === 0) {
    replace_selection('No relevant papers found. Consider expanding your paper space, resending your prompt, or adjusting it.\n');
    return;
  }

  const full_prompt = get_full_prompt(papers, await wiki_search, search);
  const research = await query_completion(full_prompt, settings);
  console.log(`research completed (${research.length} chars)`);
  replace_selection('\n## Review\n\n' + research.trim());
}

function get_full_prompt(papers: PaperInfo[], wiki: WikiInfo, search: SearchParams): string {
  let full_prompt = 
    `write a response to the prompt. address the research questions.
    use all relevant papers listed below, and cite what you use in the response.
    DO NOT cite papers other than the provided ones, but you may add additional uncited information that might be considered common knowledge.
    try to explain acronyms and definitions of domain-specific terms.
    finally, add a section of "## Follow-up questions" to the response.\n\n`;
  full_prompt += wiki['summary'] + '\n\n';
  for (let i = 0; i < papers.length; i++) {
    full_prompt += papers[i]['summary'] + '\n\n';
  }
  full_prompt += `## Prompt\n\n${search.prompt}\n`;
  full_prompt += `## Research questions\n\n${search.questions}\n`;
  return full_prompt;
}
