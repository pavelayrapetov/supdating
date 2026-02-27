import { useEffect, useState } from 'react';

interface User {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
  photo_url?: string;
}

interface Profile {
  age: number;
  gender: 'male' | 'female' | 'other';
  about: string;
  createdAt: string;
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [screen, setScreen] = useState<'loading' | 'profile' | 'search'>('loading');

  // Форма анкеты (локальное состояние)
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'other' | ''>('');
  const [about, setAbout] = useState('');

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();

      // Получаем данные пользователя
      const initUser = tg.initDataUnsafe?.user as User | undefined;
      if (initUser) {
        setUser(initUser);
      }

      // Проверяем сохранённую анкету
      const saved = localStorage.getItem('sup_dating_profile');
      if (saved) {
        try {
          const parsed = JSON.parse(saved) as Profile;
          setProfile(parsed);
          setScreen('search');
        } catch (e) {
          console.error('Ошибка парсинга анкеты:', e);
          setScreen('profile');
        }
      } else {
        setScreen('profile');
      }
    } else {
      // Не в Telegram — показываем анкету
      setScreen('profile');
    }
  }, []);

  const handleSaveProfile = () => {
    if (!age || !gender) {
      alert('Заполните возраст и пол!');
      return;
    }

    const ageNum = parseInt(age, 10);
    if (isNaN(ageNum) || ageNum < 18) {
      alert('Возраст должен быть числом от 18 лет!');
      return;
    }

    const newProfile: Profile = {
      age: ageNum,
      gender,
      about: about.trim(),
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem('sup_dating_profile', JSON.stringify(newProfile));
    setProfile(newProfile);
    setScreen('search');
    alert('Анкета сохранена! Ищем пару 💘');
  };

  if (screen === 'loading') {
    return (
      <div
        style={{
          height: '100vh',
          background: '#0f0f1a',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5rem',
        }}
      >
        Загрузка...
      </div>
    );
  }

  if (screen === 'profile') {
    return (
      <div
        style={{
          minHeight: '100vh',
          padding: '40px 20px',
          background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <h1 style={{ fontSize: '2.8rem', marginBottom: '30px' }}>Создай анкету</h1>

        <input
          type="number"
          placeholder="Возраст"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          style={{
            padding: '15px',
            margin: '10px',
            width: '80%',
            maxWidth: '400px',
            borderRadius: '12px',
            border: 'none',
            fontSize: '1.2rem',
          }}
        />

        <select
          value={gender}
          onChange={(e) => setGender(e.target.value as 'male' | 'female' | 'other' | '')}
          style={{
            padding: '15px',
            margin: '10px',
            width: '80%',
            maxWidth: '400px',
            borderRadius: '12px',
            border: 'none',
            fontSize: '1.2rem',
          }}
        >
          <option value="">Выберите пол</option>
          <option value="male">Мужчина</option>
          <option value="female">Женщина</option>
          <option value="other">Другое</option>
        </select>

        <textarea
          placeholder="Расскажи о себе (что ищешь, интересы, возраст партнёра и т.д.)"
          value={about}
          onChange={(e) => setAbout(e.target.value)}
          style={{
            padding: '15px',
            margin: '10px',
            width: '80%',
            maxWidth: '400px',
            height: '140px',
            borderRadius: '12px',
            border: 'none',
            fontSize: '1.2rem',
            resize: 'vertical',
          }}
        />

        <button
          onClick={handleSaveProfile}
          style={{
            marginTop: '30px',
            padding: '18px 60px',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            background: 'linear-gradient(90deg, #ff6b6b, #ff8e53)',
            color: 'white',
            border: 'none',
            borderRadius: '50px',
            cursor: 'pointer',
            boxShadow: '0 8px 25px rgba(255,107,107,0.4)',
          }}
        >
          Сохранить и начать поиск
        </button>

        {user && (
          <p style={{ marginTop: '25px', fontSize: '1.3rem' }}>
            Привет, {user.first_name}!
          </p>
        )}
      </div>
    );
  }

  // Экран поиска (для тех, у кого анкета уже есть)
  if (screen === 'search') {
    return (
      <div
        style={{
          minHeight: '100vh',
          padding: '40px 20px',
          background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <h1 style={{ fontSize: '3.2rem', marginBottom: '30px' }}>Поиск пары</h1>

        <p style={{ fontSize: '1.6rem', marginBottom: '40px', opacity: 0.9 }}>
          Ищем для тебя идеальную пару...
        </p>

        <div style={{ fontSize: '3rem', margin: '40px 0' }}>🔥</div>
        <p style={{ fontSize: '2rem', marginBottom: '60px' }}>Найдено 3 человека рядом</p>

        <button
          onClick={() => alert('Скоро здесь будут реальные анкеты с фото и описанием 💘')}
          style={{
            padding: '18px 60px',
            fontSize: '1.5rem',
            background: '#ff6b6b',
            color: 'white',
            border: 'none',
            borderRadius: '50px',
            cursor: 'pointer',
            boxShadow: '0 8px 25px rgba(255,107,107,0.4)',
          }}
        >
          Показать анкеты
        </button>

        {profile && (
          <p style={{ marginTop: '40px', fontSize: '1.2rem', opacity: 0.8 }}>
            Твоя анкета сохранена: {profile.gender === 'male' ? 'Мужчина' : 'Женщина'}, {profile.age} лет
          </p>
        )}

        {user && (
          <p style={{ marginTop: '20px', fontSize: '1.2rem' }}>
            Привет, {user.first_name}!
          </p>
        )}
      </div>
    );
  }

  return null;
}

export default App;