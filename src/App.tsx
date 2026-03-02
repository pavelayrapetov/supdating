import { useEffect, useState, useRef } from 'react';

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

interface CardProfile {
  id: number;
  name: string;
  age: number;
  gender: string;
  about: string;
  photo: string;
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [screen, setScreen] = useState<'loading' | 'profile' | 'search'>('loading');

  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'other' | ''>('');
  const [about, setAbout] = useState('');

  const [currentIndex, setCurrentIndex] = useState(0);

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const mockProfiles: CardProfile[] = [
    {
      id: 1,
      name: 'Анастасия',
      age: 24,
      gender: 'female',
      about: 'Люблю путешествия, кофе и хорошие разговоры до утра ☕✈️ Ищу того, с кем не захочется заканчивать вечер',
      photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800',
    },
    {
      id: 2,
      name: 'Максим',
      age: 27,
      gender: 'male',
      about: 'Спорт, книги, кино и котики. Ищу девушку, с которой можно вместе смотреть сериалы и гулять по ночному городу 🌃',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
    },
    {
      id: 3,
      name: 'Екатерина',
      age: 22,
      gender: 'female',
      about: 'Танцы, музыка, природа. Обожаю спонтанные поездки и новых людей. Давай создадим историю? 🎶🌲',
      photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800',
    },
    {
      id: 4,
      name: 'Дмитрий',
      age: 29,
      gender: 'male',
      about: 'Работаю в IT, люблю готовить, путешествовать и смотреть на звёзды. Ищу ту, с кем можно молчать и всё равно быть счастливыми ⭐',
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800',
    },
  ];

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();

      const initUser = tg.initDataUnsafe?.user as User | undefined;
      if (initUser) {
        setUser(initUser);
      }

      const saved = localStorage.getItem('sup_dating_profile');
      if (saved) {
        try {
          const parsed = JSON.parse(saved) as Profile;
          setProfile(parsed);
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

  useEffect(() => {
    if (screen === 'profile' && profile) {
      setAge(profile.age.toString());
      setGender(profile.gender);
      setAbout(profile.about);
    }
  }, [screen, profile]);

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

  const nextCard = () => {
    setCurrentIndex((prev) => prev + 1);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = e.touches[0].clientX;
    e.preventDefault();
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    touchEndX.current = e.touches[0].clientX;
    e.preventDefault();
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;

    if (Math.abs(diff) > 80) {
      if (diff > 0) {
        nextCard();
      } else {
        nextCard();
      }
    }

    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  if (screen === 'loading') {
    return (
      <div style={{
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
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

  if (screen === 'profile') {
    return (
      <div style={{
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px 20px 40px',
        boxSizing: 'border-box',
      }}>
        <h1 style={{
          fontSize: '2.4rem',
          marginBottom: '25px',
          textAlign: 'center',
          fontWeight: 'bold',
        }}>
          {profile ? 'Редактировать анкету' : 'Создай анкету'}
        </h1>

        <input
          type="number"
          placeholder="Возраст"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          style={{
            padding: '16px',
            margin: '10px 0',
            width: '88%',
            maxWidth: '380px',
            borderRadius: '14px',
            border: 'none',
            fontSize: '1.25rem',
            background: 'rgba(255,255,255,0.18)',
            color: 'white',
          }}
        />

        <select
          value={gender}
          onChange={(e) => setGender(e.target.value as 'male' | 'female' | 'other' | '')}
          style={{
            padding: '16px',
            margin: '10px 0',
            width: '88%',
            maxWidth: '380px',
            borderRadius: '14px',
            border: 'none',
            fontSize: '1.25rem',
            background: 'rgba(255,255,255,0.18)',
            color: 'white',
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
            padding: '16px',
            margin: '10px 0',
            width: '88%',
            maxWidth: '380px',
            height: '110px',
            borderRadius: '14px',
            border: 'none',
            fontSize: '1.25rem',
            background: 'rgba(255,255,255,0.18)',
            color: 'white',
            resize: 'none',
          }}
        />

        <button
          onClick={handleSaveProfile}
          style={{
            marginTop: '25px',
            padding: '16px 70px',
            fontSize: '1.4rem',
            fontWeight: 'bold',
            background: 'linear-gradient(90deg, #ff6b6b, #ff8e53)',
            color: 'white',
            border: 'none',
            borderRadius: '50px',
            cursor: 'pointer',
            boxShadow: '0 6px 20px rgba(255,107,107,0.4)',
          }}
        >
          Сохранить
        </button>

        {user && (
          <p style={{ marginTop: '20px', fontSize: '1.3rem' }}>
            Привет, {user.first_name}!
          </p>
        )}
      </div>
    );
  }

  // Поиск
  const currentProfile = mockProfiles[currentIndex];

  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <h1 style={{ fontSize: '2.4rem', margin: '15px 0 10px' }}>Поиск пары</h1>

      <p style={{
        fontSize: '1.1rem',
        marginBottom: '10px',
        opacity: 0.9,
        textAlign: 'center',
        padding: '0 20px',
      }}>
        Проводи пальцем по карточке вправо — лайк, влево — дизлайк 🔥
      </p>

      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          width: '90%',
          maxWidth: '360px',
          height: '440px', // уменьшил, чтобы кнопка не уезжала
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          backdropFilter: 'blur(10px)',
          touchAction: 'pan-y pinch-zoom',
          marginTop: 'auto',
          marginBottom: '20px', // фиксированный отступ снизу
        }}
      >
        <img
          src={currentProfile.photo}
          alt={currentProfile.name}
          style={{
            width: '100%',
            height: '58%',
            objectFit: 'cover',
          }}
        />
        <div style={{ padding: '15px' }}>
          <h2 style={{ fontSize: '1.6rem', margin: '0 0 6px' }}>
            {currentProfile.name}, {currentProfile.age}
          </h2>
          <p style={{ fontSize: '0.95rem', margin: '0 0 12px', opacity: 0.9, lineHeight: '1.35' }}>
            {currentProfile.about}
          </p>
        </div>
      </div>

      <button
        onClick={() => setScreen('profile')}
        style={{
          padding: '12px 40px',
          fontSize: '1.2rem',
          background: '#00ff88',
          color: '#000',
          border: 'none',
          borderRadius: '50px',
          cursor: 'pointer',
          boxShadow: '0 4px 15px rgba(0,255,136,0.3)',
        }}
      >
        Редактировать анкету
      </button>

      {user && (
        <p style={{ marginTop: '15px', fontSize: '1.1rem', opacity: 0.8 }}>
          Привет, {user.first_name}!
        </p>
      )}
    </div>
  );
}

export default App;