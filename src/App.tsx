import { useEffect } from 'react';

function App() {
  useEffect(() => {
    // Инициализация Telegram Mini App
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
      // Опционально: показываем MainButton, если нужно
      window.Telegram.WebApp.MainButton.setText('Готово!');
      window.Telegram.WebApp.MainButton.show();
    } else {
      console.warn('Telegram WebApp не найден — это не Telegram Mini App');
    }
  }, []);

  // Получаем данные пользователя безопасно
  const user = window.Telegram?.WebApp?.initDataUnsafe?.user;

  return (
    <div
      style={{
        height: '100vh',
        padding: '30px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
      }}
    >
      <h1 style={{ fontSize: '3.5rem', margin: '0 0 20px 0', textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
        SUP dating
      </h1>

      <p style={{ fontSize: '1.6rem', margin: '0 0 40px 0', opacity: 0.9 }}>
        Твоё первое Telegram Mini App
      </p>

      {user ? (
        <div style={{ marginBottom: '40px', background: 'rgba(255,255,255,0.15)', padding: '20px', borderRadius: '16px', backdropFilter: 'blur(10px)' }}>
          <p style={{ fontSize: '1.4rem', margin: '10px 0' }}>
            Привет, <strong>{user.first_name} {user.last_name || ''}</strong>!
          </p>
          {user.username && (
            <p style={{ fontSize: '1.3rem', margin: '10px 0' }}>
              @{user.username}
            </p>
          )}
        </div>
      ) : (
        <p style={{ fontSize: '1.4rem', marginBottom: '40px', opacity: 0.8 }}>
          Открой через кнопку в боте, чтобы увидеть свои данные
        </p>
      )}

      <button
        onClick={() => {
          alert(`Привет, ${user?.first_name || 'путешественник'}! 👋\n\nSUP dating уже работает!`);
        }}
        style={{
          padding: '18px 50px',
          fontSize: '1.4rem',
          fontWeight: 'bold',
          background: 'white',
          color: '#667eea',
          border: 'none',
          borderRadius: '50px',
          cursor: 'pointer',
          boxShadow: '0 8px 25px rgba(0,0,0,0.25)',
          transition: 'all 0.3s ease',
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 12px 35px rgba(0,0,0,0.35)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.25)';
        }}
      >
        Запустить знакомства!
      </button>

      <p style={{ marginTop: '60px', fontSize: '1rem', opacity: 0.7 }}>
        Сделано с ❤️ в Telegram Mini App
      </p>
    </div>
  );
}

export default App;