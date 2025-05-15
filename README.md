<a href="https://chat.vercel.ai/">
  <img alt="Mandaleen Fit - AI Fitness and Nutrition Coach." src="app/(chat)/opengraph-image.png">
  <h1 align="center">Mandaleen Fit</h1>
</a>

<p align="center">
  Mandaleen Fit - An AI Fitness and Nutrition Coach Built With Next.js and the AI SDK by Vercel.
</p>

<p align="center">
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#model-providers"><strong>Model Providers</strong></a> ·
  <a href="#deploy-your-own"><strong>Deploy Your Own</strong></a> ·
  <a href="#running-locally"><strong>Running locally</strong></a>
</p>
<br/>

## Features

- [Next.js](https://nextjs.org) App Router
  - Advanced routing for seamless navigation and performance
  - React Server Components (RSCs) and Server Actions for server-side rendering and increased performance
- [AI SDK](https://sdk.vercel.ai/docs)
  - Unified API for generating text, structured objects, and tool calls with LLMs
  - Hooks for building dynamic chat and generative user interfaces
  - Supports Google (default), OpenAI, Anthropic, Cohere, and other model providers
- [shadcn/ui](https://ui.shadcn.com)
  - Styling with [Tailwind CSS](https://tailwindcss.com)
  - Component primitives from [Radix UI](https://radix-ui.com) for accessibility and flexibility
- Data Persistence
  - [Vercel Postgres powered by Neon](https://vercel.com/storage/postgres) for saving chat history and user data
  - [Vercel Blob](https://vercel.com/storage/blob) for efficient object storage
- [NextAuth.js](https://github.com/nextauthjs/next-auth)
  - Simple and secure authentication

## Model Providers

This template is now configured to use Google Gemini's **`gemini-2.0-flash-lite-001`** model as the default for chat interactions. This change is reflected in `app/(chat)/api/chat/route.ts`.

The `ai/index.ts` file also defines other models:

- `geminiProModel` (using `gemini-1.5-pro-002`)
- `geminiFlashModel` (using `gemini-1.5-flash-002`)

To switch to a different model for the chat:

1. Open `app/(chat)/api/chat/route.ts`.
2. Change the import from `import { geminiFlashLiteModel } from "@/ai";` to import the desired model (e.g., `geminiProModel`).
3. Update the `model` property in the `streamText` call to use the imported model.

With the [AI SDK](https://sdk.vercel.ai/docs), you can also adapt the application to use other LLM providers like [OpenAI](https://openai.com), [Anthropic](https://anthropic.com), [Cohere](https://cohere.com/), and [many more](https://sdk.vercel.ai/providers/ai-sdk-providers) by modifying the model definitions in `ai/index.ts` and updating the relevant API routes.

## Deploy Your Own

You can deploy your own version of Mandaleen Fit to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fmistanisjo%2Fmistanis-fit&env=AUTH_SECRET,GOOGLE_GENERATIVE_AI_API_KEY&envDescription=Learn%20more%20about%20how%20to%20get%20the%20API%20Keys%20for%20the%20application&envLink=https%3A%2F%2Fgithub.com%2Fmistanisjo%2Fmistanis-fit%2Fblob%2Fmain%2F.env.example&demo-title=Mandaleen%20Fit&demo-description=Mandaleen%20Fit%20-%20AI%20Fitness%20and%20Nutrition%20Coach.&demo-url=https%3A%2F%2Fgemini.vercel.ai&stores=[{%22type%22:%22postgres%22},{%22type%22:%22blob%22}])
Note: The `repository-url` in the deploy button above still points to the original Vercel template. It should ideally point to your repository `https://github.com/mistanisjo/mistanis-fit` if this README is for your specific project. I've updated it in this change. The `demo-url` also points to the original demo.

## Running locally

You will need to use the environment variables [defined in `.env.example`](.env.example) to run Mandaleen Fit. It's recommended you use [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables) for this, but a `.env` file is all that is necessary.

> Note: You should not commit your `.env` file or it will expose secrets that will allow others to control access to your various Google Cloud and authentication provider accounts.

1. Install Vercel CLI: `npm i -g vercel`
2. Link local instance with Vercel and GitHub accounts (creates `.vercel` directory): `vercel link`
3. Download your environment variables: `vercel env pull`

```bash
pnpm install
pnpm dev
```

Your app template should now be running on [localhost:3000](http://localhost:3000/).
