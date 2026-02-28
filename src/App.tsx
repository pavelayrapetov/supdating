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

  // Форма анкеты
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'other' | ''>('');
  const [about, setAbout] = useState('');

  // Поиск: индекс текущей карточки
  const [currentIndex, setCurrentIndex] = useState(0);

  // Для touch-свайпа
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Моковые анкеты (потом заменишь на базу)
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

  // Автозагрузка формы при открытии анкеты
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

  // Переход к следующей карточке
  const nextCard = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, mockProfiles.length));
  };

  // Обработка touch-свайпа
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;

    if (Math.abs(diff) > 80) { // минимальная дистанция свайпа
      if (diff > 0) {
        // свайп влево → дизлайк
        console.log('Свайп влево');
        nextCard();
      } else {
        // свайп вправо → лайк
        console.log('Свайп вправо');
        nextCard();
      }
    }
  };

  // Если карточки закончились
  if (screen === 'search' && currentIndex >= mockProfiles.length) {
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
          justifyContent: 'center',
          textAlign: 'center',
        }}
      >
        <h1 style={{ fontSize: '3rem', marginBottom: '30px' }}>Поиск пары</h1>
        <p style={{ fontSize: '1.8rem' }}>Карточки закончились 😔</p>
        <p style={{ fontSize: '1.3rem', marginTop: '20px', opacity: 0.8 }}>
          Пока нет новых анкет. Проверь позже!
        </p>
        <button
          onClick={() => setScreen('profile')}
          style={{
            marginTop: '30px',
            padding: '15px 40px',
            fontSize: '1.3rem',
            background: '#00ff88',
            color: '#000',
            border: 'none',
            borderRadius: '50px',
            cursor: 'pointer',
          }}
        >
          Редактировать анкету
        </button>
      </div>
    );
  }

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
        <h1 style={{ fontSize: '2.8rem', marginBottom: '30px' }}>
          {profile ? 'Редактировать анкету' : 'Создай анкету'}
        </h1>

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
          Сохранить
        </button>

        {user && (
          <p style={{ marginTop: '25px', fontSize: '1.3rem' }}>
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
        Проводи пальцем вправо — лайк, влево — дизлайк 🔥
      </p>

      <div
        style={{
          width: '100%',
          maxWidth: '380px',
          height: '520px',
          position: 'relative',
        }}
      >
        <div
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
            touchAction: 'pan-y', // чтобы не мешал скролл
          }}
        >
          <img
            src={currentProfile.photo}
            alt={currentProfile.name}
            style={{
              width: '100%',
              height: '65%',
              objectFit: 'cover',
            }}
          />
          <div style={{ padding: '20px' }}>
            <h2 style={{ fontSize: '1.8rem', margin: '0 0 8px' }}>
              {currentProfile.name}, {currentProfile.age}
            </h2>
            <p style={{ fontSize: '1.1rem', margin: '0 0 15px', opacity: 0.9 }}>
              {currentProfile.about}
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={() => setScreen('profile')}
        style={{
          marginTop: '40px',
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
        <p style={{ marginTop: '30px', fontSize: '1.2rem', opacity: 0.8 }}>
          Привет, {user.first_name}!
        </p>
      )}
    </div>
  );
}

export default App;