(() => {
  const accessKey = 'slutwalk-access';
  const hasAccess = window.localStorage.getItem(accessKey) === 'true';

  if (!hasAccess) {
    window.location.replace('index.html#login');
  }
})();