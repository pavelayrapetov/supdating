import { useEffect, useState } from 'react';

function App() {
  const [user, setUser] = useState<any>(null);
  const [screen, setScreen] = useState<'loading' | 'home' | 'profile' | 'search'>('loading');
  const [profile, setProfile] = useState<any>(null); // ← эта переменная теперь используется ниже

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();

      const initUser = tg.initDataUnsafe?.user;
      if (initUser) {
        setUser(initUser);
      }

      // Главная кнопка Telegram
      tg.MainButton.setText('Продолжить');
      tg.MainButton.setParams({ color: '#00ff88', text_color: '#000000' });
      tg.MainButton.show();

      tg.MainButton.onClick(() => {
        if (screen === 'home') {
          setScreen('profile');
        } else if (screen === 'profile') {
          saveProfile();
          setScreen('search');
        }
      });

      // Проверяем сохранённую анкету
      const savedProfile = localStorage.getItem('sup_dating_profile');
      if (savedProfile) {
        const parsed = JSON.parse(savedProfile);
        setProfile(parsed);
        setScreen('search');
      } else {
        setScreen('home');
      }
    } else {
      setScreen('home');
    }
  }, [screen]);

  const saveProfile = () => {
    // Пока заглушка — потом заменишь на реальную форму
    const newProfile = {
      age: 25,
      gender: 'male',
      about: 'Люблю путешествия и кофе ☕',
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem('sup_dating_profile', JSON.stringify(newProfile));
    setProfile(newProfile);
    alert('Анкета сохранена! Теперь ищем пару 💘');
  };

  if (screen === 'loading') {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0f0f1a',
        color: 'white',
        fontSize: '1.5rem',
      }}>
        Загрузка...
      </div>
    );
  }

  if (screen === 'home') {
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
        <h1 style={{ fontSize: '3.5rem', margin: '0 0 20px 0' }}>SUP dating</h1>
        <p style={{ fontSize: '1.6rem', margin: '0 0 40px 0' }}>Найди свою вторую половинку прямо в Telegram</p>

        {user ? (
          <p style={{ fontSize: '2rem', marginBottom: '40px' }}>
            Привет, <strong>{user.first_name}!</strong> 👋
          </p>
        ) : (
          <p style={{ fontSize: '1.6rem', marginBottom: '40px' }}>
            Нажми кнопку ниже, чтобы начать
          </p>
        )}

        <p style={{ fontSize: '1.2rem', opacity: 0.8, marginBottom: '60px' }}>
          Нажми главную кнопку внизу экрана, чтобы создать анкету
        </p>

        {/* ← Добавляем использование profile, чтобы TS не ругался */}
        {profile && (
          <p style={{ fontSize: '1.1rem', opacity: 0.7, marginTop: '20px' }}>
            Твоя анкета готова (возраст: {profile.age || '?'})
          </p>
        )}
      </div>
    );
  }

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
          Сохранить и продолжить
        </button>
      </div>
    );
  }

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
        <div style={{ fontSize: '2rem', margin: '20px 0' }}>
          🔥 Найдено 3 человека рядом
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
            marginTop: '40px',
          }}
        >
          Показать анкеты
        </button>

        {/* ← profile используется здесь тоже */}
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