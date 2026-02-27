interface TelegramWebAppUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
  added_to_attachment_menu?: boolean;
  allows_write_to_pm?: boolean;
  photo_url?: string;
}

interface TelegramWebAppInitDataUnsafe {
  user?: TelegramWebAppUser;
}

interface BottomButton {
  text: string;
  color: string;
  textColor: string;
  isVisible: boolean;
  isActive: boolean;
  hasShineEffect: boolean;
  isProgressVisible: boolean;

  setText(text: string): BottomButton;
  show(): BottomButton;
  hide(): BottomButton;
  enable(): BottomButton;
  disable(): BottomButton;
  showProgress(leaveActive?: boolean): BottomButton;
  hideProgress(): BottomButton;
  setParams(params: {
    text?: string;
    color?: string;
    text_color?: string;
    has_shine_effect?: boolean;
    is_active?: boolean;
    is_visible?: boolean;
  }): BottomButton;
  onClick(callback: () => void): void;
  offClick(callback: () => void): void;
}

interface TelegramWebApp {
  ready: () => void;
  expand: () => void;
  initDataUnsafe: TelegramWebAppInitDataUnsafe;
  MainButton: BottomButton;
}

interface Window {
  Telegram: {
    WebApp: TelegramWebApp;
  };
}