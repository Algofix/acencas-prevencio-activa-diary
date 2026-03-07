// 1. Import Firebase tools directly from the web CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// 2. Your exact Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAU6BikZJWUOAxG08IeDY7elaMUZsomHvs",
  authDomain: "acencas-prevencio-activa-1b95f.firebaseapp.com",
  projectId: "acencas-prevencio-activa-1b95f",
  storageBucket: "acencas-prevencio-activa-1b95f.firebasestorage.app",
  messagingSenderId: "252970482822",
  appId: "1:252970482822:web:ce8cafd88c68a5231a2507",
  measurementId: "G-PQPCYYS49X"
};

// 3. Initialize Firebase and Authentication
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// 4. Connect to your HTML Form Elements
const loginPage = document.getElementById('login-page');
const authForm = document.getElementById('auth-form');
const emailInput = document.getElementById('auth-email');
const passwordInput = document.getElementById('auth-password');
const submitBtn = document.getElementById('auth-submit-button');
const toggleLink = document.getElementById('auth-toggle-link');
const toggleText = document.getElementById('auth-toggle-text');
const errorMessage = document.getElementById('auth-error');

// 5. Track if we are Logging In or Registering
let isLoginMode = true; 

if (toggleLink) {
  toggleLink.addEventListener('click', (e) => {
    e.preventDefault();
    isLoginMode = !isLoginMode; // Flip the mode
    
    if (isLoginMode) {
      submitBtn.textContent = "Entrar";
      toggleLink.textContent = "Crear un compte nou";
      if (toggleText) toggleText.textContent = "No tens un compte?";
    } else {
      submitBtn.textContent = "Registrar-se";
      toggleLink.textContent = "Ja tens un compte? Inicia sessió";
      if (toggleText) toggleText.textContent = "Ja tens compte?";
    }
  });
}

// 6. Handle the Submit Button
if (authForm) {
  authForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Stop the page from reloading
    
    const email = emailInput.value;
    const password = passwordInput.value;
    
    if (isLoginMode) {
      // -- LOGIN CODE --
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          console.log("Success! Logged in as:", userCredential.user.email);
          if (errorMessage) errorMessage.classList.add('hidden');
          loginPage.style.display = 'none'; // Hide login form
          alert("Sessió iniciada correctament!"); // Temporary success message
        })
        .catch((error) => {
          console.error("Login Error:", error.code);
          if (errorMessage) {
            errorMessage.textContent = "Error: Correu o contrasenya incorrectes.";
            errorMessage.classList.remove('hidden');
          }
        });
    } else {
      // -- REGISTER CODE --
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          console.log("Success! Registered as:", userCredential.user.email);
          if (errorMessage) errorMessage.classList.add('hidden');
          loginPage.style.display = 'none'; // Hide login form
          alert("Compte creat correctament!"); // Temporary success message
        })
        .catch((error) => {
          console.error("Register Error:", error.code);
          if (errorMessage) {
            errorMessage.textContent = "Error en crear el compte: " + error.message;
            errorMessage.classList.remove('hidden');
          }
        });
    }
  });
}

// 7. Security Guard (Checks if already logged in)
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("Welcome back:", user.email);
    
    // 1. Hide the login page
    if (loginPage) loginPage.style.display = 'none'; 
    
    // 2. Smart auto-click: Tries 'manual_intro', then 'manual', then defaults to the first available button
    const defaultButton = document.querySelector('[data-page="manual_intro"]') || 
                          document.querySelector('[data-page="manual"]') || 
                          document.querySelector('[data-page]'); 
                          
    if (defaultButton) {
        defaultButton.click();
    }

  } else {
    console.log("No user logged in currently.");
    // Make sure login page is visible if they aren't logged in
    if (loginPage) loginPage.style.display = 'flex'; 
  }
});