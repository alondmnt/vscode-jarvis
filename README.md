# Jarvis

[![DOI](https://zenodo.org/badge/doi/10.5281/zenodo.7746861.png)](https://zenodo.org/badge/latestdoi/612752168)

Jarvis is an AI assistant for compiling scientific literature auto-reviews based on free text prompts. This extension was ported from [Jarvis](https://github.com/alondmnt/joplin-plugin-jarvis) for the [Joplin](https://joplinapp.org) note-taking app.

## Features

Write what you're interested about, select the text, and run the command "Research with Jarvis". Wait 2-3 minutes for all the output to appear in the note (depending on internet traffic). Jarvis will update the content as it finds new information on the web (using Semantic Scholar, Crossref, Elsevier, Springer & Wikipedia databases). In the end you will get a report with the following sections: title, prompt, research questions, queries, references, review and follow-up questions.

![](https://github.com/alondmnt/vscode-jarvis/blob/main/images/jarvis-demo.gif?raw=true)

## Dependencies

- For GPT-3, you will need to get a free [OpenAI API Key](https://platform.openai.com/account/api-keys)
- For searching via Scopus (optional, recommended to try) you will need to get a free [Scopus API key](https://dev.elsevier.com/apikey/manage)
- For access to Springer's paper repository (optional) you will need to get a free [Springer API key](https://dev.springernature.com/admin/applications)

## Release Notes

### 0.0.2-0.0.3

Improved Wikipedia summary.

### 0.0.1

Ported Jarvis (research mode) from Joplin.

---
