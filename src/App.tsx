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

  // Состояние формы анкеты
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'other' | ''>('');
  const [about, setAbout] = useState('');

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();

      // Получаем пользователя
      const initUser = tg.initDataUnsafe?.user as User | undefined;
      if (initUser) {
        setUser(initUser);
      }

      // Загружаем сохранённую анкету
      const saved = localStorage.getItem('sup_dating_profile');
      if (saved) {
        try {
          const parsed = JSON.parse(saved) as Profile;
          setProfile(parsed);
          // Заполняем форму при повторном открытии
          setAge(parsed.age.toString());
          setGender(parsed.gender);
          setAbout(parsed.about);
          setScreen('search');
        } catch (e) {
          console.error('Ошибка загрузки анкеты:', e);
          setScreen('profile');
        }
      } else {
        setScreen('profile');
      }
    } else {
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
          placeholder="Расскажи о себе..."
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

  if (screen === 'search') {
    // Моковые анкеты для отображения
    const mockProfiles = [
      {
        id: 1,
        name: 'Анастасия',
        age: 24,
        gender: 'female',
        about: 'Люблю путешествия, кофе и хорошие разговоры до утра ☕✈️ Ищу того, с кем не захочется заканчивать вечер',
        photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=987&q=80',
      },
      {
        id: 2,
        name: 'Максим',
        age: 27,
        gender: 'male',
        about: 'Спорт, книги, кино и котики. Ищу девушку, с которой можно вместе смотреть сериалы и гулять по ночному городу 🌃',
        photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=987&q=80',
      },
      {
        id: 3,
        name: 'Екатерина',
        age: 22,
        gender: 'female',
        about: 'Танцы, музыка, природа. Обожаю спонтанные поездки и новых людей. Давай создадим историю? 🎶🌲',
        photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=987&q=80',
      },
      {
        id: 4,
        name: 'Дмитрий',
        age: 29,
        gender: 'male',
        about: 'Работаю в IT, люблю готовить, путешествовать и смотреть на звёзды. Ищу ту, с кем можно молчать и всё равно быть счастливыми ⭐',
        photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=987&q=80',
      },
    ];

    return (
      <div
        style={{
          minHeight: '100vh',
          padding: '20px',
          background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <h1 style={{ fontSize: '2.8rem', margin: '20px 0 30px' }}>Поиск пары</h1>

        <p style={{ fontSize: '1.4rem', marginBottom: '30px', opacity: 0.9 }}>
          Вот кто рядом с тобой прямо сейчас 🔥
        </p>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '30px',
          width: '100%',
          maxWidth: '420px',
        }}>
          {mockProfiles.map((p) => (
            <div
              key={p.id}
              style={{
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <img
                src={p.photo}
                alt={p.name}
                style={{
                  width: '100%',
                  height: '300px',
                  objectFit: 'cover',
                }}
              />
              <div style={{ padding: '20px' }}>
                <h2 style={{ fontSize: '1.8rem', margin: '0 0 8px' }}>
                  {p.name}, {p.age}
                </h2>
                <p style={{ fontSize: '1.1rem', margin: '0 0 15px', opacity: 0.9 }}>
                  {p.about}
                </p>

                <div style={{ display: 'flex', gap: '30px', justifyContent: 'center' }}>
                  <button
                    onClick={() => alert(`Ты лайкнул ${p.name}! ❤️`)}
                    style={{
                      padding: '15px 40px',
                      fontSize: '1.6rem',
                      background: '#ff4757',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      cursor: 'pointer',
                      boxShadow: '0 5px 15px rgba(255,71,87,0.4)',
                    }}
                  >
                    ❤️
                  </button>

                  <button
                    onClick={() => alert(`Ты дизлайкнул ${p.name}`)}
                    style={{
                      padding: '15px 40px',
                      fontSize: '1.6rem',
                      background: '#57606f',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      cursor: 'pointer',
                      boxShadow: '0 5px 15px rgba(87,96,111,0.4)',
                    }}
                  >
                    👎
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {user && (
          <p style={{ marginTop: '40px', fontSize: '1.2rem', opacity: 0.8 }}>
            Привет, {user.first_name}! Твоя анкета уже в поиске
          </p>
        )}
      </div>
    );
  }

  return null;
}

export default App;