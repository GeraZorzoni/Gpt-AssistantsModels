import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import {
  ChatMessageComponent,
  MyMessageComponent,
  TextMessageBoxComponent,
  TypingLoaderComponent,
} from '@components/index';
import { Message } from '@interfaces/messages.interface';
import { OpenAiService } from 'app/presentation/services/openai.service';

@Component({
  selector: 'app-pros-cons-stream-page',
  standalone: true,
  imports: [
    CommonModule,
    ChatMessageComponent,
    MyMessageComponent,
    TextMessageBoxComponent,
    TypingLoaderComponent,
  ],
  templateUrl: './prosConsStreamPage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProsConsStreamPageComponent {
  public messages = signal<Message[]>([]);
  public isLoading = signal(false);
  public openAiService = inject(OpenAiService);

  public abortSignal = new AbortController();

  async handleMessage(prompt: string) {
    this.abortSignal.abort();
    this.abortSignal = new AbortController();

    this.messages.update((prev) => [
      ...prev,
      { isGpt: false, text: prompt },
      {
        isGpt: true,
        text: '...',
      },
    ]);

    this.isLoading.set(true);

    const stream = this.openAiService.prosConsStreamDiscusser(
      prompt,
      this.abortSignal.signal
    );

    this.isLoading.set(false);

    for await (const text of stream) {
      this.handleStreamResponse(text);
    }
  }

  handleStreamResponse(message: string) {
    this.messages().pop();
    const messages = this.messages();

    this.messages.set([...messages, { isGpt: true, text: message }]);
  }
}
