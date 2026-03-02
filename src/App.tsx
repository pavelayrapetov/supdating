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
  gender: 'male' | 'female';
  about: string;
  photo?: string;
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
  const [gender, setGender] = useState<'male' | 'female' | ''>('');
  const [about, setAbout] = useState('');
  const [profilePhoto, setProfilePhoto] = useState<string>('');

  const [currentIndex, setCurrentIndex] = useState(0);

  // Анимация "свайпа" при нажатии кнопки
  const [offsetX, setOffsetX] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [animating, setAnimating] = useState(false);

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
          setProfilePhoto(parsed.photo || '');
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
      setProfilePhoto(profile.photo || '');
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
      photo: profilePhoto,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem('sup_dating_profile', JSON.stringify(newProfile));
    setProfile(newProfile);
    setScreen('search');
    alert('Анкета сохранена! Ищем пару 💘');
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const animateSwipe = (direction: 'left' | 'right') => {
    setAnimating(true);
    setOffsetX(direction === 'right' ? 400 : -400);
    setRotation(direction === 'right' ? 15 : -15);

    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
      setOffsetX(0);
      setRotation(0);
      setAnimating(false);
    }, 400); // время анимации улёта
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
        background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 100%)',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px 24px',
        boxSizing: 'border-box',
      }}>
        <h1 style={{
          fontSize: '2.4rem',
          marginBottom: '30px',
          textAlign: 'center',
          fontWeight: '700',
        }}>
          Создай анкету
        </h1>

        <input
          type="number"
          placeholder="Возраст"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          style={{
            padding: '16px 20px',
            margin: '10px 0',
            width: '100%',
            maxWidth: '360px',
            borderRadius: '16px',
            border: 'none',
            fontSize: '1.3rem',
            background: 'rgba(255,255,255,0.08)',
            color: 'white',
            outline: 'none',
          }}
        />

        <select
          value={gender}
          onChange={(e) => setGender(e.target.value as 'male' | 'female' | '')}
          style={{
            padding: '16px 20px',
            margin: '10px 0',
            width: '100%',
            maxWidth: '360px',
            borderRadius: '16px',
            border: 'none',
            fontSize: '1.3rem',
            background: 'rgba(255,255,255,0.08)',
            color: gender ? 'white' : '#aaa',
            outline: 'none',
            appearance: 'none',
          }}
        >
          <option value="" disabled style={{ color: '#aaa' }}>
            Пол
          </option>
          <option value="male">Мужчина</option>
          <option value="female">Женщина</option>
        </select>

        <textarea
          placeholder="Расскажи о себе..."
          value={about}
          onChange={(e) => setAbout(e.target.value)}
          style={{
            padding: '16px 20px',
            margin: '10px 0',
            width: '100%',
            maxWidth: '360px',
            height: '120px',
            borderRadius: '16px',
            border: 'none',
            fontSize: '1.3rem',
            background: 'rgba(255,255,255,0.08)',
            color: 'white',
            outline: 'none',
            resize: 'none',
          }}
        />

        <div style={{ width: '100%', maxWidth: '360px', margin: '15px 0' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '1.2rem' }}>
            Фото профиля
          </label>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px',
            background: 'rgba(255,255,255,0.08)',
            borderRadius: '16px',
          }}>
            <label style={{
              padding: '12px 20px',
              background: 'rgba(255,255,255,0.12)',
              borderRadius: '12px',
              cursor: 'pointer',
              fontSize: '1.1rem',
            }}>
              Выбрать фото
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                style={{ display: 'none' }}
              />
            </label>
            {profilePhoto && (
              <img
                src={profilePhoto}
                alt="Предпросмотр"
                style={{
                  width: '48px',
                  height: '48px',
                  objectFit: 'cover',
                  borderRadius: '12px',
                  border: '2px solid rgba(255,255,255,0.3)',
                }}
              />
            )}
          </div>
        </div>

        <button
          onClick={handleSaveProfile}
          style={{
            marginTop: '30px',
            padding: '18px 90px',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            background: 'linear-gradient(90deg, #ff6b6b, #ff8e53)',
            color: 'white',
            border: 'none',
            borderRadius: '60px',
            cursor: 'pointer',
            boxShadow: '0 10px 30px rgba(255,107,107,0.5)',
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

  // Поиск с кнопками и анимацией
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
        overscrollBehaviorY: 'none',
      }}
    >
      <div style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        padding: '15px 20px',
        boxSizing: 'border-box',
      }}>
        <h1 style={{ fontSize: '2.2rem', margin: 0 }}>Поиск пары</h1>

        <button
          onClick={() => setScreen('profile')}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '2rem',
            color: 'white',
            cursor: 'pointer',
            padding: '0 10px',
          }}
        >
          ⚙️
        </button>
      </div>

      <p style={{
        fontSize: '1.1rem',
        margin: '5px 0 15px',
        opacity: 0.8,
        textAlign: 'center',
        padding: '0 20px',
      }}>
        Нажимай «Нравится» или «Не нравится»
      </p>

      <div
        style={{
          position: 'relative',
          width: '90%',
          maxWidth: '360px',
          height: '480px',
          marginTop: 'auto',
          marginBottom: '120px',
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            backdropFilter: 'blur(10px)',
            transform: `translateX(${offsetX}px) rotate(${rotation}deg)`,
            transition: animating ? 'transform 0.5s ease-out' : 'none',
            touchAction: 'none',
          }}
        >
          <img
            src={currentProfile.photo}
            alt={currentProfile.name}
            style={{
              width: '100%',
              height: '62%',
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

        {/* Надпись ЛАЙК / НЕТ во время анимации */}
        <div style={{
          position: 'absolute',
          top: '40%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '3.5rem',
          fontWeight: 'bold',
          opacity: animating ? 1 : 0,
          color: offsetX > 0 ? '#00ff88' : '#ff4757',
          pointerEvents: 'none',
          textShadow: '0 0 12px rgba(0,0,0,0.8)',
          transition: 'opacity 0.3s',
        }}>
          {offsetX > 0 ? 'ЛАЙК' : 'НЕТ'}
        </div>
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '60px',
        marginBottom: '40px',
      }}>
        <button
          onClick={() => animateSwipe('left')}
          style={{
            padding: '20px 40px',
            fontSize: '2rem',
            background: '#ff4757',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            cursor: 'pointer',
            boxShadow: '0 8px 25px rgba(255,71,87,0.5)',
          }}
        >
          👎
        </button>

        <button
          onClick={() => animateSwipe('right')}
          style={{
            padding: '20px 40px',
            fontSize: '2rem',
            background: '#00ff88',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            cursor: 'pointer',
            boxShadow: '0 8px 25px rgba(0,255,136,0.5)',
          }}
        >
          ❤️
        </button>
      </div>

      {user && (
        <p style={{ fontSize: '1.2rem', opacity: 0.8, marginBottom: '20px' }}>
          Привет, {user.first_name}!
        </p>
      )}
    </div>
  );
}

export default App;