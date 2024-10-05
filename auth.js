
  // Firebase configuration - Replace with your Firebase project config
  const firebaseConfig = {
    apiKey: "AIzaSyDtNkrY9ei1QaBB8Gr-sUyJ7LfgHV89uvs",
    authDomain: "alt1-b9786.firebaseapp.com",
    databaseURL: "https://alt1-b9786-default-rtdb.firebaseio.com",
    projectId: "alt1-b9786",
    storageBucket: "alt1-b9786.appspot.com",
    messagingSenderId: "174400734353",
    appId: "1:174400734353:web:25a956c82fd96b8b426b30",
    measurementId: "G-G31YX41GST"
  };// Firebase configuration - Replace with your Firebase project config
  
  
  // Initialize Firebase only if it hasn't been initialized already
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  } else {
    firebase.app(); // if already initialized, use that one
  }
  
  const auth = firebase.auth();
  const db = firebase.firestore();
    
  document.getElementById('signup-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('signup-email').value;
      const password = document.getElementById('signup-password').value;
    
      auth.createUserWithEmailAndPassword(email, password)
        .then(() => {
          window.location.href = 'dashboard.html';
        })
        .catch((error) => {
          alert('Error: ' + error.message);
        });
  });
    
    // Login Function
  document.getElementById('login-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
    
      auth.signInWithEmailAndPassword(email, password)
        .then(() => {
          window.location.href = 'dashboard.html';
        })
        .catch((error) => {
          alert('Error: ' + error.message);
        });
  });
    
    // Logout Function
  const logoutButton = document.getElementById('logout-button');
  if (logoutButton) {
      logoutButton.addEventListener('click', () => {
          auth.signOut().then(() => {
              window.location.href = 'login.html';
          });
      });
  };