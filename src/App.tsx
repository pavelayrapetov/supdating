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

  // Для анимированного свайпа
  const [offsetX, setOffsetX] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const cardRef = useRef<HTMLDivElement>(null);

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
    setOffsetX(0);
    setRotation(0);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length !== 1) return;
    startX.current = e.touches[0].clientX;
    setIsDragging(true);
    e.preventDefault();
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging || e.touches.length !== 1) return;

    const currentX = e.touches[0].clientX;
    const diffX = currentX - startX.current;

    setOffsetX(diffX);
    // Поворот карточки в зависимости от сдвига (максимум ±15 градусов)
    setRotation(diffX * 0.08);
    e.preventDefault();
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const threshold = 120; // минимальное расстояние для пролистывания

    if (Math.abs(offsetX) > threshold) {
      // Пролистываем
      nextCard();
    } else {
      // Возвращаем карточку в центр с анимацией
      setOffsetX(0);
      setRotation(0);
    }
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
        padding: '20px',
        boxSizing: 'border-box',
      }}>
        <h1 style={{
          fontSize: '2.6rem',
          marginBottom: '30px',
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
            padding: '18px',
            margin: '12px 0',
            width: '88%',
            maxWidth: '380px',
            borderRadius: '16px',
            border: 'none',
            fontSize: '1.3rem',
            background: 'rgba(255,255,255,0.18)',
            color: 'white',
          }}
        />

        <select
          value={gender}
          onChange={(e) => setGender(e.target.value as 'male' | 'female' | 'other' | '')}
          style={{
            padding: '18px',
            margin: '12px 0',
            width: '88%',
            maxWidth: '380px',
            borderRadius: '16px',
            border: 'none',
            fontSize: '1.3rem',
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
            padding: '18px',
            margin: '12px 0',
            width: '88%',
            maxWidth: '380px',
            height: '130px',
            borderRadius: '16px',
            border: 'none',
            fontSize: '1.3rem',
            background: 'rgba(255,255,255,0.18)',
            color: 'white',
            resize: 'none',
          }}
        />

        <button
          onClick={handleSaveProfile}
          style={{
            marginTop: '35px',
            padding: '18px 70px',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            background: 'linear-gradient(90deg, #ff6b6b, #ff8e53)',
            color: 'white',
            border: 'none',
            borderRadius: '60px',
            cursor: 'pointer',
            boxShadow: '0 8px 25px rgba(255,107,107,0.5)',
          }}
        >
          Сохранить
        </button>

        {user && (
          <p style={{ marginTop: '30px', fontSize: '1.4rem' }}>
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
        touchAction: 'none',
      }}
    >
      <h1 style={{ fontSize: '2.4rem', margin: '15px 0 10px' }}>Поиск пары</h1>

      <p style={{
        fontSize: '1.2rem',
        marginBottom: '15px',
        opacity: 0.9,
        textAlign: 'center',
        padding: '0 20px',
      }}>
        Проводи пальцем по карточке вправо — лайк, влево — дизлайк 🔥
      </p>

      <div
        style={{
          position: 'relative',
          width: '90%',
          maxWidth: '360px',
          height: '480px',
          marginTop: 'auto',
        }}
      >
        <div
          ref={cardRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{
            width: '100%',
            height: '100%',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            backdropFilter: 'blur(10px)',
            transform: `translateX(${offsetX}px) rotate(${rotation}deg)`,
            transition: isDragging ? 'none' : 'transform 0.5s ease-out',
            touchAction: 'none',
            userSelect: 'none',
          }}
        >
          <img
            src={currentProfile.photo}
            alt={currentProfile.name}
            style={{
              width: '100%',
              height: '60%',
              objectFit: 'cover',
            }}
          />
          <div style={{ padding: '15px' }}>
            <h2 style={{ fontSize: '1.7rem', margin: '0 0 6px' }}>
              {currentProfile.name}, {currentProfile.age}
            </h2>
            <p style={{ fontSize: '1rem', margin: '0 0 15px', opacity: 0.9, lineHeight: '1.4' }}>
              {currentProfile.about}
            </p>
          </div>
        </div>

        {/* Надписи Лайк / Нет, появляются при свайпе */}
        <div style={{
          position: 'absolute',
          top: '40%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '3rem',
          fontWeight: 'bold',
          opacity: Math.abs(offsetX) / 200,
          color: offsetX > 0 ? '#00ff88' : '#ff4757',
          pointerEvents: 'none',
          textShadow: '0 0 10px rgba(0,0,0,0.8)',
        }}>
          {offsetX > 0 ? 'ЛАЙК' : 'НЕТ'}
        </div>
      </div>

      <button
        onClick={() => setScreen('profile')}
        style={{
          marginTop: '20px',
          marginBottom: '20px',
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
        <p style={{ fontSize: '1.1rem', opacity: 0.8 }}>
          Привет, {user.first_name}!
        </p>
      )}
    </div>
  );
}

export default App;