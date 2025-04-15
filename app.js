// ===== CONFIGURAÇÃO DO FIREBASE =====
const firebaseConfig = {
  apiKey: "AIzaSyC0G3P-cpeUXHfqLiiTuvKz7YLTXIeBVfQ",
  authDomain: "mindtranslate-41310.firebaseapp.com",
  projectId: "mindtranslate-41310",
  storageBucket: "mindtranslate-41310.firebasestorage.app",
  messagingSenderId: "57544648857",
  appId: "1:57544648857:web:e80241caff1cf3ba2bf008"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// ===== LOGIN COM EMAIL E SENHA =====
function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  auth.signInWithEmailAndPassword(email, password)
    .then(userCredential => {
      const user = userCredential.user;
      document.getElementById("status").innerText = `Bem-vindo, ${user.email}`;
    })
    .catch(error => {
      console.error(error);
      alert("Erro no login: " + error.message);
    });
    auth.signInWithEmailAndPassword(email, password)
  .then(userCredential => {
    const user = userCredential.user;
    window.location.href = "painel.html"; // 🔄 redireciona após login
  })
  .catch(error => {
    console.error(error);
    alert("Erro no login: " + error.message);
  });

}

// ===== CADASTRO DE USUÁRIO =====
function signup() {
  const email = document.getElementById("new-email").value;
  const password = document.getElementById("new-password").value;
  const confirmPassword = document.getElementById("confirm-password").value;

  const isStrongEnough =
    password.length >= 6 &&
    /[A-Z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[\W_]/.test(password);

  if (!isStrongEnough) {
    alert("A senha está muito fraca. Use uma senha mais forte com número, símbolo e letra maiúscula.");
    return;
  }

  if (password !== confirmPassword) {
    alert("As senhas não coincidem.");
    return;
  }

  auth.createUserWithEmailAndPassword(email, password)
    .then(userCredential => {
      const user = userCredential.user;
      window.location.href = "painel.html"; // 🔄 vai direto para o painel
    })
    .catch(error => {
      console.error(error);
      alert("Erro no cadastro: " + error.message);
    });
}

// ===== LOGIN COM GOOGLE =====
function loginWithGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();

  auth.signInWithPopup(provider)
  .then(result => {
    const user = result.user;
    window.location.href = "painel.html"; // 🔄 redireciona após login com Google
  })
  .catch(error => {
    console.error(error);
    alert("Erro no login com Google: " + error.message);
  });

}

// ===== LOGOUT =====
function logout() {
  auth.signOut()
    .then(() => {
      document.getElementById("status").innerText = "Você saiu da conta.";
    })
    .catch(error => {
      console.error(error);
      alert("Erro ao sair: " + error.message);
    });
}

// ===== DETECTA MUDANÇA DE LOGIN =====
auth.onAuthStateChanged(user => {
  const guestButtons = document.getElementById("guest-buttons");
  const userButtons = document.getElementById("user-buttons");

  if (user) {
    document.getElementById("status").innerText = `Usuário logado: ${user.email || user.displayName}`;
    guestButtons.style.display = "none";
    userButtons.style.display = "block";
  } else {
    document.getElementById("status").innerText = "Nenhum usuário logado.";
    guestButtons.style.display = "block";
    userButtons.style.display = "none";
  }
});

// ===== TROCA ENTRE FORMULÁRIOS =====
function showSignup() {
  document.getElementById("form-login").classList.remove("active");
  document.getElementById("form-signup").classList.add("active");
}

function showLogin() {
  document.getElementById("form-signup").classList.remove("active");
  document.getElementById("form-login").classList.add("active");
}

// ===== TOGGLE VISIBILIDADE DE SENHA =====
function togglePassword() {
  const input = document.getElementById("password");
  const icon = document.getElementById("icon-eye");

  const openEye = `<path d="M12 4.5c-5 0-9.27 3.11-11 7.5..."/>`;
  const closedEye = `<path d="M12 4.5C7 4.5 2.73 7.61 1 12..."/>`;

  if (input.type === "password") {
    input.type = "text";
    icon.innerHTML = openEye;
  } else {
    input.type = "password";
    icon.innerHTML = closedEye;
  }
}

function toggleSignupPassword() {
  const input = document.getElementById("new-password");
  const icon = document.getElementById("icon-signup-eye");

  const openEye = `<path d="M12 4.5c-5 0-9.27 3.11-11 7.5..."/>`;
  const closedEye = `<path d="M12 4.5C7 4.5 2.73 7.61 1 12..."/>`;

  if (input.type === "password") {
    input.type = "text";
    icon.innerHTML = openEye;
  } else {
    input.type = "password";
    icon.innerHTML = closedEye;
  }
}

// ===== FORÇA DA SENHA EM TEMPO REAL =====
function checkPasswordStrength() {
  const password = document.getElementById("new-password").value;
  const bars = document.querySelectorAll(".bar");
  const label = document.getElementById("strength-label");
  const hints = document.getElementById("password-hints");

  let strength = 0;
  let hintsList = [];

  const rules = [
    { test: password.length >= 6, label: "Mínimo 6 caracteres" },
    { test: /[A-Z]/.test(password), label: "Letra maiúscula" },
    { test: /[0-9]/.test(password), label: "Número" },
    { test: /[\W_]/.test(password), label: "Símbolo especial (!@#...)" }
  ];

  bars.forEach(bar => bar.className = "bar");

  rules.forEach(rule => {
    if (rule.test) strength++;
    hintsList.push(`<li class="${rule.test ? "ok" : "missing"}">${rule.label}</li>`);
  });

  let colorClass = "", strengthText = "";

  if (strength <= 1) {
    colorClass = "weak";
    strengthText = "Fraca";
  } else if (strength <= 3) {
    colorClass = "medium";
    strengthText = "Média";
  } else {
    colorClass = "strong";
    strengthText = "Forte";
  }

  for (let i = 0; i < strength; i++) {
    bars[i].classList.add("active", colorClass);
  }

  label.textContent = `Senha ${strengthText}`;
  label.style.color = getComputedStyle(document.querySelector(`.bar.active.${colorClass}`)).backgroundColor;

  hints.innerHTML = hintsList.join("");
}
