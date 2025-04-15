// Configurações reais do seu projeto Firebase
const firebaseConfig = {
    apiKey: "AIzaSyC0G3P-cpeUXHfqLiiTuvKz7YLTXIeBVfQ",
    authDomain: "mindtranslate-41310.firebaseapp.com",
    projectId: "mindtranslate-41310",
    storageBucket: "mindtranslate-41310.firebasestorage.app",
    messagingSenderId: "57544648857",
    appId: "1:57544648857:web:e80241caff1cf3ba2bf008"
  };
  
  // Inicializa o Firebase (modo compatível com navegadores simples)
  firebase.initializeApp(firebaseConfig);
  
  // Referência ao serviço de autenticação
  const auth = firebase.auth();
  
  // Função de login com email e senha
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
  }
  
  // Função de cadastro (criação de conta)
  function signup() {
    const email = document.getElementById("new-email").value;
    const password = document.getElementById("new-password").value;
    const confirmPassword = document.getElementById("confirm-password").value;
  
    // Regras mínimas
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
        document.getElementById("status").innerText = `Usuário criado: ${user.email}`;
        showLogin();
      })
      .catch(error => {
        console.error(error);
        alert("Erro no cadastro: " + error.message);
      });
  }
  
  
  // Função de login com Google
  function loginWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
  
    auth.signInWithPopup(provider)
      .then(result => {
        const user = result.user;
        document.getElementById("status").innerText = `Logado com Google: ${user.displayName}`;
      })
      .catch(error => {
        console.error(error);
        alert("Erro no login com Google: " + error.message);
      });
  }
  // Função para logout
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
// Detecta se o usuário já está logado (ex: ao recarregar a página)
auth.onAuthStateChanged(user => {
    const guestButtons = document.getElementById("guest-buttons");
    const userButtons = document.getElementById("user-buttons");
  
    if (user) {
      // Se estiver logado
      document.getElementById("status").innerText = `Usuário logado: ${user.email || user.displayName}`;
      guestButtons.style.display = "none"; // esconde botões de login/cadastro
      userButtons.style.display = "block"; // mostra botão de sair
  
      // Redireciona para painel (opcional, se ainda quiser)
      // window.location.href = "painel.html";
  
    } else {
      // Se não estiver logado
      document.getElementById("status").innerText = "Nenhum usuário logado.";
      guestButtons.style.display = "block"; // mostra login/cadastro
      userButtons.style.display = "none";  // esconde botão de sair
    }
  });
  function showSignup() {
    document.getElementById("form-login").classList.remove("active");
    document.getElementById("form-signup").classList.add("active");
  }
  
  function showLogin() {
    document.getElementById("form-signup").classList.remove("active");
    document.getElementById("form-login").classList.add("active");
  }
  function togglePassword() {
    const input = document.getElementById("password");
    const icon = document.getElementById("icon-eye");
  
    const openEye = `
      <path d="M12 4.5c-5 0-9.27 3.11-11 7.5 1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zm0 13c-2.5 0-4.5-2-4.5-4.5S9.5 8.5 12 8.5s4.5 2 4.5 4.5-2 4.5-4.5 4.5zm0-6.5c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
    `;
  
    const closedEye = `
      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c.76 1.91 2.12 3.56 3.85 4.74L3 21l1.5 1.5 3.29-3.29C9.22 19 10.6 19.5 12 19.5c5 0 9.27-3.11 11-7.5-1.73-4.39-6-7.5-11-7.5zm0 13c-1.1 0-2.1-.3-3-.84l1.44-1.44A2.5 2.5 0 0012 15a2.5 2.5 0 002.5-2.5c0-.62-.22-1.2-.59-1.65l1.44-1.44c.54.89.84 1.9.84 3 0 2.5-2 4.5-4.5 4.5zm-8.24-3.24C4.31 13.27 3.45 12 3 12c.45-.99 1.31-2.26 2.76-3.26l1.44 1.44A4.45 4.45 0 007.5 12c0 .62.22 1.2.59 1.65L4.76 14.76zM20.49 3.51 3.51 20.49 2.1 19.07l17-17L20.49 3.51z"/>
    `;
  
    if (input.type === "password") {
      input.type = "text";
      icon.innerHTML = openEye;  // olho aberto
    } else {
      input.type = "password";
      icon.innerHTML = closedEye;  // olho com risco
    }
  }
  //oggle para senha do cadastro
  function toggleSignupPassword() {
    const input = document.getElementById("new-password");
    const icon = document.getElementById("icon-signup-eye");
  
    const openEye = `<path d="M12 4.5c-5 0-9.27 3.11-11 7.5 1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zm0 13c-2.5 0-4.5-2-4.5-4.5S9.5 8.5 12 8.5s4.5 2 4.5 4.5-2 4.5-4.5 4.5zm0-6.5c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>`;
    const closedEye = `<path d="M12 4.5C7 4.5 2.73 7.61 1 12c.76 1.91 2.12 3.56 3.85 4.74L3 21l1.5 1.5 3.29-3.29C9.22 19 10.6 19.5 12 19.5c5 0 9.27-3.11 11-7.5-1.73-4.39-6-7.5-11-7.5z"/>`;
  
    if (input.type === "password") {
      input.type = "text";
      icon.innerHTML = openEye;
    } else {
      input.type = "password";
      icon.innerHTML = closedEye;
    }
  }

  //função para verificar força da senha
  function checkPasswordStrength() {
    const password = document.getElementById("new-password").value;
    const bars = document.querySelectorAll(".bar");
    const label = document.getElementById("strength-label");
    const hints = document.getElementById("password-hints");
  
    let strength = 0;
    let hintsList = [];
  
    // Regras de senha
    const rules = [
      {
        test: password.length >= 6,
        label: "Mínimo 6 caracteres"
      },
      {
        test: /[A-Z]/.test(password),
        label: "Letra maiúscula"
      },
      {
        test: /[0-9]/.test(password),
        label: "Número"
      },
      {
        test: /[\W_]/.test(password),
        label: "Símbolo especial (!@#...)"
      }
    ];
  
    // Limpa classes antigas
    bars.forEach(bar => bar.className = "bar");
  
    // Define cor e texto
    rules.forEach(rule => {
      if (rule.test) strength++;
      hintsList.push(`<li class="${rule.test ? "ok" : "missing"}">${rule.label}</li>`);
    });
  
    let colorClass = "", strengthText = "";
  
    if (strength <= 1) {
      colorClass = "weak";
      strengthText = "Fraca";
    } else if (strength === 2 || strength === 3) {
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
  
    hints.innerHTML = hintsList.join('');
  }
   