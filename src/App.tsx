import { useEffect } from 'react';

function App() {
  useEffect(() => {
    window.Telegram.WebApp.ready();
    window.Telegram.WebApp.expand();
  }, []);

  const user = window.Telegram.WebApp.initDataUnsafe.user;

  return (
    <div style={{
      padding: '30px',
      textAlign: 'center',
      fontFamily: 'system-ui, sans-serif',
      background: '#f0f2f5',
      minHeight: '100vh',
      color: '#333'
    }}>
      <h1 style={{ color: 'red' }}>Тест 27 февраля - новая версия</h1>

      {user ? (
        <>
          <p>Тебя зовут: <strong>{user.first_name} {user.last_name || ''}</strong></p>
          <p>Твой username: @{user.username || 'не указан'}</p>
        </>
      ) : (
        <p>Открой это внутри Telegram, чтобы увидеть твои данные 😊</p>
      )}

      <button
        onClick={() => alert('Кнопка работает! Ты — ' + (user?.first_name || 'гость'))}
        style={{
          padding: '15px 30px',
          fontSize: '18px',
          background: '#0088cc',
          color: 'white',
          border: 'none',
          borderRadius: '10px',
          cursor: 'pointer',
          marginTop: '20px'
        }}
      >
        Нажми меня!
      </button>
    </div>
  );
}

export default App;