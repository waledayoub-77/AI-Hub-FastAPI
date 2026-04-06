import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class AiService {
  private readonly openaiApiKey?: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly supabaseService: SupabaseService,
  ) {
    this.openaiApiKey = this.configService.get<string>('OPENAI_API_KEY');
  }

  async useModel(key: string, input: string) {
    let output = '';

    if (!key || !input) {
      throw new Error('Both key and input are required.');
    }

    if (key === 'summarizer') {
      output = await this.generateText(
        'Summarize the user text into concise bullet points.',
        input,
      );
    } else if (key === 'translator') {
      output = await this.generateText(
        'Translate the user text. Keep the meaning and tone intact.',
        input,
      );
    } else if (key === 'chat') {
      output = await this.generateText('Reply as a helpful AI assistant.', input);
    } else if (key === 'image-generator') {
      output = await this.generateImage(input);
    } else {
      throw new Error('Unsupported model key.');
    }

    await this.saveHistory(key, input, output);

    return { key, output };
  }

  private async generateText(instruction: string, input: string) {
    const openai = this.getOpenAIClient();

    const response = await openai.chat.completions.create({
      model: 'gpt-4.1-mini',
      messages: [
        { role: 'system', content: instruction },
        { role: 'user', content: input },
      ],
    });

    return response.choices[0]?.message?.content ?? '';
  }

  private async generateImage(input: string) {
    const openai = this.getOpenAIClient();

    const response = await openai.images.generate({
      model: 'gpt-image-1',
      prompt: input,
      size: '1024x1024',
    });

    const image = response.data?.[0];

    if (!image) {
      return 'No image generated.';
    }

    if (image.url) {
      return image.url;
    }

    if (image.b64_json) {
      return `data:image/png;base64,${image.b64_json}`;
    }

    return 'Image generated but no display payload returned.';
  }

  private async saveHistory(key: string, input: string, output: string) {
    // Keep history logging best-effort so AI responses are not blocked by schema mismatches.
    await this.supabaseService.client
      .from('history')
      .insert({ key, input, output, created_at: new Date().toISOString() });
  }

  private getOpenAIClient() {
    if (!this.openaiApiKey) {
      throw new Error('OPENAI_API_KEY is required to use AI models.');
    }

    return new OpenAI({ apiKey: this.openaiApiKey });
  }
}
