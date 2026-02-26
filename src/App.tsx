import { useEffect } from 'react';

function App() {
  useEffect(() => {
    // Инициализируем Telegram Web App
    window.Telegram.WebApp.ready();
    // Растягиваем на весь экран
    window.Telegram.WebApp.expand();
  }, []);

  // Получаем данные пользователя из Telegram
  const user = window.Telegram.WebApp.initDataUnsafe.user;

  return (
    <div
      style={{
        padding: '30px',
        textAlign: 'center',
        fontFamily: 'system-ui, sans-serif',
        background: '#f0f2f5',
        minHeight: '100vh',
        color: '#333',
      }}
    >
      <h1 style={{ color: '#0088cc', marginBottom: '20px' }}>
        Привет из Mini App! 🚀
      </h1>

      {user ? (
        <div>
          <p style={{ fontSize: '1.3rem', marginBottom: '10px' }}>
            Тебя зовут: <strong>{user.first_name} {user.last_name || ''}</strong>
          </p>
          <p style={{ fontSize: '1.2rem', marginBottom: '30px' }}>
            Твой username: @{user.username || 'не указан'}
          </p>
        </div>
      ) : (
        <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '30px' }}>
          Открой это приложение внутри Telegram, чтобы увидеть твои данные 😊
        </p>
      )}

      <button
        onClick={() =>
          alert(
            'Кнопка работает!\n\nТы — ' +
              (user?.first_name || 'гость') +
              (user?.username ? ' (@' + user.username + ')' : '')
          )
        }
        style={{
          padding: '15px 40px',
          fontSize: '1.1rem',
          background: '#0088cc',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0, 136, 204, 0.3)',
          transition: 'all 0.2s',
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 136, 204, 0.4)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 136, 204, 0.3)';
        }}
      >
        Нажми меня!
      </button>
    </div>
  );
}

export default App;