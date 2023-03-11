/* eslint-disable @typescript-eslint/naming-convention */
import * as vscode from 'vscode';
import axios from 'axios';
import { JarvisSettings } from './settings';

export async function query_completion(
    prompt: string, settings: JarvisSettings,
    adjust_max_tokens: number = 0): Promise<string> {
  if ( !settings.openai_api_key ) {
    vscode.window.showErrorMessage('OpenAI API key not set');
    throw new Error('OpenAI API key not set');
  }

  let url: string = '';
  let responseParams: any = {
    model: settings.model,
    max_tokens: settings.max_tokens - Math.ceil(prompt.length / 4) - adjust_max_tokens,
    temperature: settings.temperature,
    top_p: settings.top_p,
    frequency_penalty: settings.frequency_penalty,
    presence_penalty: settings.presence_penalty,
  };

  if (settings.model.includes('gpt-3.5-turbo')) {
    url = 'https://api.openai.com/v1/chat/completions';
    responseParams = {...responseParams,
      messages: [
        {role: 'system', content: 'You are Jarvis, the helpful assistant.'},
        {role: 'user', content: prompt}
      ],
    };
  } else {
    url = 'https://api.openai.com/v1/completions';
    responseParams = {...responseParams,
      prompt: prompt,
    };
  }

  const response = await axios.post(url, responseParams, {
    timeout: settings.timeout,
    headers: {
      Authorization: 'Bearer ' + settings.openai_api_key
    }
  }).catch((error) => {
    console.log('OpenAI error: ', error);
    return error;
  });
  const data = response.data;

  if (response.message && response.message.includes('timeout')) {
    const selection = await vscode.window.showErrorMessage(
      'OpenAI request timed out. You can increase the timeout in the settings.',
      'Retry', 'Cancel');
    if ( selection === 'Cancel' ) {
      return '';
    } else {
      console.log('retrying request');
      return await query_completion(prompt, settings, adjust_max_tokens);
    }
  }
  if (response.status !== 200 && response.response.status !== 400) {
    vscode.window.showErrorMessage('OpenAI request failed: ' + response.error.message);
    return '';
  }

  if (data) {
    // output completion
    if (data.hasOwnProperty('choices') && (data.choices[0].text)) {
      return data.choices[0].text;
    }
    if (data.hasOwnProperty('choices') && data.choices[0].message.content) {
      return data.choices[0].message.content;
    }
  }

  // display error message
  const error = response.response.data.error.message;
  const selection = await vscode.window.showErrorMessage(
    `Error: ${error}`, 'Retry', 'Cancel');
  if ( selection === 'Cancel' ) {
    return '';
  }
  // adjust & retry

  // find all numbers in error message
  const max_tokens = [...error.matchAll(/([0-9]+)/g)];

  // adjust max tokens
  if ((max_tokens !== null) &&
      (error.includes('reduce'))) {
    adjust_max_tokens = parseInt(max_tokens[1]) - parseInt(max_tokens[0]) + 1;
  }

  // retry
  return await query_completion(prompt, settings, adjust_max_tokens);
}
