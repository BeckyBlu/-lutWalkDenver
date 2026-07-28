(() => {
  const ACCESS_KEY = 'slutwalk-access';
  const authEndpoint = typeof window.SW_AUTH_ENDPOINT === 'string' ? window.SW_AUTH_ENDPOINT : '';
  const fallbackPassword = typeof window.SW_FALLBACK_PASSWORD === 'string' ? window.SW_FALLBACK_PASSWORD : '';

  function setUnlockedState(isUnlocked) {
    const content = document.querySelector('.content');
    const form = document.querySelector('.gate-form');
    const submitButton = form ? form.querySelector('button[type="submit"]') : null;
    const input = form ? form.querySelector('input[name="password"], input[type="password"]') : null;

    if (content) {
      content.classList.toggle('content--locked', !isUnlocked);
      content.classList.toggle('content--open', isUnlocked);
    }

    if (input) {
      input.disabled = isUnlocked;
    }

    if (submitButton) {
      submitButton.disabled = isUnlocked;
      submitButton.textContent = isUnlocked ? 'Unlocked' : 'Enter community';
    }
  }

  async function tryServerLogin(password) {
    if (!authEndpoint) {
      return null;
    }

    try {
      const response = await fetch(authEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ password }),
      });

      return response.ok;
    } catch (error) {
      console.error('gate login error', error);
      return false;
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const input = document.querySelector('.gate-form input[name="password"], .gate-form input[type="password"]');
    if (!input) {
      return;
    }

    const password = input.value || '';
    const serverResult = await tryServerLogin(password);

    if (serverResult === true) {
      window.localStorage.setItem(ACCESS_KEY, 'true');
      setUnlockedState(true);
      input.value = '';
      return;
    }

    if (fallbackPassword && password === fallbackPassword) {
      window.localStorage.setItem(ACCESS_KEY, 'true');
      setUnlockedState(true);
      input.value = '';
      return;
    }

    window.localStorage.removeItem(ACCESS_KEY);
    setUnlockedState(false);
  }

  function handleDecline() {
    window.localStorage.removeItem(ACCESS_KEY);
    window.location.href = 'https://example.com';
  }

  document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.gate-form');
    const declineBtn = document.getElementById('declineBtn');

    if (form) {
      form.addEventListener('submit', handleSubmit);
    }

    if (declineBtn) {
      declineBtn.addEventListener('click', handleDecline);
    }

    setUnlockedState(window.localStorage.getItem(ACCESS_KEY) === 'true');
  });
})();