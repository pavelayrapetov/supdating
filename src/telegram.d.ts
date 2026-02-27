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

interface TelegramWebApp {
  ready: () => void;
  expand: () => void;
  initDataUnsafe: TelegramWebAppInitDataUnsafe;
  MainButton: {
    setText: (text: string) => void;
    show: () => void;
    hide: () => void;
  };
}

interface Window {
  Telegram: {
    WebApp: TelegramWebApp;
  };
}