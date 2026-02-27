import { useEffect, useState } from 'react';

function App() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();

      // Получаем пользователя
      const initUser = tg.initDataUnsafe?.user;
      if (initUser) {
        setUser(initUser);
      }

      // Главная кнопка Telegram внизу экрана
      tg.MainButton.setText('Запустить знакомства 🔥');
      tg.MainButton.setParams({
        color: '#00ff88',
        text_color: '#000000'
      });
      tg.MainButton.show();

      tg.MainButton.onClick(() => {
        alert(`Привет, ${user?.first_name || 'путешественник'}!\n\nПоиск пары запущен! 💘`);
      });
    } else {
      console.warn('Это не Telegram Mini App');
    }
  }, [user]);

  return (
    <div
      style={{
        minHeight: '100vh',
        padding: '40px 20px',
        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
        color: 'white',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      <h1
        style={{
          fontSize: '3.5rem',
          margin: '0 0 20px 0',
          textShadow: '0 4px 12px rgba(0,0,0,0.4)',
        }}
      >
        SUP dating
      </h1>

      <p style={{ fontSize: '1.6rem', margin: '0 0 40px 0', opacity: 0.9 }}>
        Найди свою вторую половинку прямо в Telegram
      </p>

      {user ? (
        <div
          style={{
            background: 'rgba(255,255,255,0.15)',
            padding: '25px',
            borderRadius: '20px',
            marginBottom: '40px',
            width: '90%',
            maxWidth: '400px',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          }}
        >
          <p style={{ fontSize: '2.2rem', margin: '0 0 10px 0' }}>
            Привет, <strong>{user.first_name} {user.last_name || ''}!</strong> 👋
          </p>
          {user.username && (
            <p style={{ fontSize: '1.5rem', opacity: 0.9 }}>
              @{user.username}
            </p>
          )}
        </div>
      ) : (
        <div
          style={{
            background: 'rgba(255,255,255,0.1)',
            padding: '25px',
            borderRadius: '20px',
            marginBottom: '40px',
            width: '90%',
            maxWidth: '400px',
          }}
        >
          <p style={{ fontSize: '1.8rem', margin: '0 0 15px 0' }}>
            Привет!
          </p>
          <p style={{ fontSize: '1.3rem', opacity: 0.85 }}>
            Нажми кнопку ниже, чтобы начать
          </p>
        </div>
      )}

      <button
        onClick={() => {
          alert(
            `Запускаем знакомства!\n\nПривет, ${user?.first_name || 'путешественник'}! 💘`
          );
        }}
        style={{
          padding: '18px 60px',
          fontSize: '1.5rem',
          fontWeight: 'bold',
          background: 'linear-gradient(90deg, #ff6b6b, #ff8e53)',
          color: 'white',
          border: 'none',
          borderRadius: '50px',
          cursor: 'pointer',
          boxShadow: '0 10px 30px rgba(255, 107, 107, 0.4)',
          transition: 'all 0.3s ease',
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'scale(1.08)';
          e.currentTarget.style.boxShadow = '0 15px 40px rgba(255, 107, 107, 0.6)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 10px 30px rgba(255, 107, 107, 0.4)';
        }}
      >
        Запустить знакомства!
      </button>

      <p style={{ marginTop: '80px', fontSize: '1rem', opacity: 0.6 }}>
        Сделано с ❤️ в Telegram Mini App
      </p>
    </div>
  );
}

export default App;