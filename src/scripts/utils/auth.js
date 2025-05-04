const checkAuth = () => {
    const token = localStorage.getItem('token');
    return !!token;
  };
  
  const updateNavigation = () => {
    const isAuthenticated = checkAuth();
    
    const loginLink = document.getElementById('login-link');
    const registerLink = document.getElementById('register-link');
    const logoutButton = document.getElementById('logout-button');
    const addStoryLink = document.getElementById('add-story-link');
    
    if (isAuthenticated) {
      loginLink.classList.add('hidden');
      registerLink.classList.add('hidden');
      logoutButton.classList.remove('hidden');
      addStoryLink.classList.remove('hidden');
      
      logoutButton.addEventListener('click', logout);
    } else {
      loginLink.classList.remove('hidden');
      registerLink.classList.remove('hidden');
      logoutButton.classList.add('hidden');
      addStoryLink.classList.add('hidden');
    }
  };
  
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    window.dispatchEvent(new Event('auth-change'));
    window.location.hash = '/';
  };
  
  export { checkAuth, updateNavigation, logout };