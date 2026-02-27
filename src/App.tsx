import { useEffect, useState } from 'react';

function App() {
  const [screen, setScreen] = useState('home');

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();

      tg.MainButton.setText('Перейти к анкете');
      tg.MainButton.setParams({ color: '#00ff88', text_color: '#000' });
      tg.MainButton.show();

      tg.MainButton.onClick(() => {
        setScreen('profile');
      });
    }
  }, []);

  if (screen === 'home') {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #1e3c72, #2a5298)', 
        color: 'white', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        textAlign: 'center',
        padding: '20px'
      }}>
        <h1 style={{ fontSize: '3rem' }}>SUP dating</h1>
        <p style={{ fontSize: '1.5rem', margin: '20px 0' }}>Главный экран</p>
        <p style={{ fontSize: '1.2rem', opacity: 0.8 }}>
          Нажми нижнюю кнопку Telegram, чтобы перейти к анкете
        </p>
      </div>
    );
  }

  if (screen === 'profile') {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #ff6b6b, #ff8e53)', 
        color: 'white', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        textAlign: 'center',
        padding: '20px'
      }}>
        <h1 style={{ fontSize: '3rem' }}>Анкета</h1>
        <p style={{ fontSize: '1.5rem', margin: '20px 0' }}>Это второй экран!</p>
        <button 
          onClick={() => alert('Анкета сохранена!')}
          style={{ padding: '15px 40px', fontSize: '1.3rem', background: 'white', color: '#ff6b6b', borderRadius: '50px', border: 'none', cursor: 'pointer' }}
        >
          Сохранить
        </button>
      </div>
    );
  }

  return null;
}

export default App;