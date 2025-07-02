export function login(username, role) {
    localStorage.setItem('user', JSON.stringify({ username, role }));
  }
  
  export function logout() {
    localStorage.removeItem('user');
  }
  
  export function getUser() {
    return JSON.parse(localStorage.getItem('user'));
  }
  
  export function isAuthenticated() {
    return !!localStorage.getItem('user');
  }
  