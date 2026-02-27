import { useEffect, useState } from 'react';

interface User {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
  photo_url?: string;
  // другие поля Telegram, если нужны
}

interface Profile {
  age: number;
  gender: string;
  about: string;
  createdAt: string;
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [screen, setScreen] = useState<'loading' | 'profile' | 'search'>('loading');

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();

      // Получаем пользователя из Telegram
      const initUser = tg.initDataUnsafe?.user as User | undefined;
      if (initUser) {
        setUser(initUser);
      }

      // Проверяем сохранённую анкету
      const savedProfile = localStorage.getItem('sup_dating_profile');
      if (savedProfile) {
        const parsed = JSON.parse(savedProfile) as Profile;
        setProfile(parsed);
        setScreen('search');
      } else {
        setScreen('profile');
      }
    } else {
      setScreen('profile');
    }
  }, []);

  // Сохранение анкеты (заглушка — потом подключишь реальную форму)
  const saveProfile = () => {
    const newProfile: Profile = {
      age: 25,
      gender: 'male',
      about: 'Люблю путешествия и кофе ☕',
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem('sup_dating_profile', JSON.stringify(newProfile));
    setProfile(newProfile);
    setScreen('search');
    alert('Анкета сохранена! Ищем пару 💘');
  };

  if (screen === 'loading') {
    return (
      <div style={{
        height: '100vh',
        background: '#0f0f1a',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.5rem',
      }}>
        Загрузка...
      </div>
    );
  }

  // Экран анкеты (первый раз)
  if (screen === 'profile') {
    return (
      <div style={{
        minHeight: '100vh',
        padding: '40px 20px',
        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <h1 style={{ fontSize: '2.8rem', marginBottom: '30px' }}>Создай анкету</h1>

        <input
          type="number"
          placeholder="Возраст"
          style={{ padding: '15px', margin: '10px', width: '80%', borderRadius: '12px', border: 'none', fontSize: '1.2rem' }}
        />
        <select
          style={{ padding: '15px', margin: '10px', width: '80%', borderRadius: '12px', border: 'none', fontSize: '1.2rem' }}
        >
          <option value="">Пол</option>
          <option value="male">Мужчина</option>
          <option value="female">Женщина</option>
          <option value="other">Другое</option>
        </select>
        <textarea
          placeholder="Расскажи о себе..."
          style={{ padding: '15px', margin: '10px', width: '80%', height: '120px', borderRadius: '12px', border: 'none', fontSize: '1.2rem' }}
        />

        <button
          onClick={saveProfile}
          style={{
            marginTop: '30px',
            padding: '18px 60px',
            fontSize: '1.5rem',
            background: 'linear-gradient(90deg, #ff6b6b, #ff8e53)',
            color: 'white',
            border: 'none',
            borderRadius: '50px',
            cursor: 'pointer',
          }}
        >
          Сохранить и начать поиск
        </button>

        {user && (
          <p style={{ marginTop: '20px', fontSize: '1.2rem' }}>
            Привет, {user.first_name}!
          </p>
        )}
      </div>
    );
  }

  // Экран поиска пары
  if (screen === 'search') {
    return (
      <div style={{
        minHeight: '100vh',
        padding: '40px 20px',
        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '30px' }}>Поиск пары</h1>
        <p style={{ fontSize: '1.6rem', marginBottom: '40px' }}>
          Ищем для тебя идеальную пару...
        </p>
        <div style={{ fontSize: '2.5rem', margin: '40px 0' }}>
          🔥 3 человека рядом
        </div>
        <button
          onClick={() => alert('Скоро здесь будут реальные анкеты! 💘')}
          style={{
            padding: '18px 50px',
            fontSize: '1.5rem',
            background: '#ff6b6b',
            color: 'white',
            border: 'none',
            borderRadius: '50px',
            cursor: 'pointer',
          }}
        >
          Показать анкеты
        </button>

        {profile && (
          <p style={{ marginTop: '40px', fontSize: '1.2rem', opacity: 0.8 }}>
            Твоя анкета: {profile.gender === 'male' ? 'Мужчина' : 'Женщина'}, {profile.age} лет
          </p>
        )}
      </div>
    );
  }

  return null;
}

export default App;