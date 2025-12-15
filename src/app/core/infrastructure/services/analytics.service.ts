import { Injectable } from '@angular/core';

declare global {
  interface Window {
    dataLayer: any[];
  }
}

interface ChatbotCloseParams {
  chatDuration: number;
  messagesSent: number;
  messagesReceived: number;
  userEngaged: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private readonly SESSION_STORAGE_KEY = 'chatbot_first_interaction';

  private pushEvent(event: string, params: Record<string, any> = {}): void {
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event,
        ...params
      });
    }
  }

  private getCommonParams(): Record<string, any> {
    const isFirstInteraction = this.checkAndSetFirstInteraction();
    const sessionId = this.getOrCreateSessionId();

    return {
      page_path: typeof window !== 'undefined' ? window.location.pathname : '',
      page_title: typeof document !== 'undefined' ? document.title : '',
      timestamp: new Date().toISOString(),
      session_id: sessionId,
      is_first_interaction: isFirstInteraction
    };
  }

  private checkAndSetFirstInteraction(): boolean {
    if (typeof sessionStorage === 'undefined') return false;

    const hasInteracted = sessionStorage.getItem(this.SESSION_STORAGE_KEY);
    if (!hasInteracted) {
      sessionStorage.setItem(this.SESSION_STORAGE_KEY, 'true');
      return true;
    }
    return false;
  }

  private getOrCreateSessionId(): string {
    if (typeof sessionStorage === 'undefined') return 'unknown';

    const storageKey = 'chatbot_session_id';
    let sessionId = sessionStorage.getItem(storageKey);

    if (!sessionId) {
      sessionId = `chatbot_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem(storageKey, sessionId);
    }

    return sessionId;
  }

  trackChatbotOpen(): void {
    this.pushEvent('chatbot_interaction', {
      action: 'open',
      element_id: 'chatbot-button',
      ...this.getCommonParams()
    });
  }

  trackChatbotClose(params: ChatbotCloseParams): void {
    this.pushEvent('chatbot_interaction', {
      action: 'close',
      element_id: 'chatbot-close-button',
      chat_duration: params.chatDuration,
      messages_sent: params.messagesSent,
      messages_received: params.messagesReceived,
      user_engaged: params.userEngaged,
      ...this.getCommonParams()
    });
  }
}
