import { Injectable } from '@angular/core';
import {
  audioToTextUseCase,
  createThreadUseCase,
  imageGenerationUseCase,
  imageVariationUseCase,
  orthographyUseCase,
  postQuestionUseCase,
  prosConsStreamUseCase,
  prosConsUseCase,
  textToAudioUseCase,
  translateTextUseCase,
} from '@use-cases/index';

import { from, Observable, of, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OpenAiService {
  checkOrthography(prompt: string) {
    return from(orthographyUseCase(prompt));
  }

  prosConsDiscusser(prompt: string) {
    return from(prosConsUseCase(prompt));
  }

  prosConsStreamDiscusser(prompt: string, abortSignal: AbortSignal) {
    return prosConsStreamUseCase(prompt, abortSignal);
  }

  translateText(prompt: string, lang: string) {
    return from(translateTextUseCase(prompt, lang));
  }

  textToAudio(prompt: string, voice: string) {
    return from(textToAudioUseCase(prompt, voice));
  }

  audioToText(file: File, prompt?: string) {
    return from(audioToTextUseCase(file, prompt));
  }

  imageGeneration(prompt: string, originalImage?: string, maskImage?: string) {
    return from(imageGenerationUseCase(prompt, originalImage, maskImage));
  }

  imageVariation(originalImage: string) {
    return from(imageVariationUseCase(originalImage));
  }

  // createThread(): Observable<string> {
  //   if (localStorage.getItem('thread')) {
  //     return of(localStorage.getItem('thread')!);
  //   }

  //   return from(createThreadUseCase()).pipe(
  //     tap((thread) => {
  //       localStorage.setItem('thread', thread);
  //     })
  //   );
  // }

  createThread(): Observable<string> {
    const storedId = localStorage.getItem('thread');

    // Si tenemos un ID válido y distinto de null/undefined/empty
    if (storedId && storedId.length > 0 && storedId !== 'undefined') {
      return of(storedId);
    }

    // Forzar la creación de un nuevo hilo
    localStorage.removeItem('thread');
    return from(createThreadUseCase()).pipe(
      tap((threadId) => {
        localStorage.setItem('thread', threadId);
      })
    );
  }

  postQuestion(threadId: string, question: string) {
    return from(postQuestionUseCase(threadId, question));
  }
}
