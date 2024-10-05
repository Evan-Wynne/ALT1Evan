function updateNavbar() {
    const authLinks = document.getElementById('auth-links');
    if (!authLinks) return;
  
    authLinks.innerHTML = '';
  
    auth.onAuthStateChanged((user) => {
      if (user) {
        // User is logged in, show "Log Out"
        const logoutLink = document.createElement('li');
        logoutLink.innerHTML = `<a href="#" id="logout-button">Log Out</a>`;
        authLinks.appendChild(logoutLink);
  
        // logout functionality
        logoutLink.addEventListener('click', () => {
          auth.signOut().then(() => {
            window.location.href = 'login.html'; // Redirect to login after logging out
          });
        });
      } else {
        // User is not logged in, show "Sign in/Sign up"
        const loginLink = document.createElement('li');
        loginLink.innerHTML = `<a href="login.html">Sign in/Sign up</a>`;
        authLinks.appendChild(loginLink);
      }
    });
  }
  
  // The following line was written by AI, after struggling to get it to work
  document.addEventListener('DOMContentLoaded', updateNavbar);