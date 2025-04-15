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
  
    auth.createUserWithEmailAndPassword(email, password)
      .then(userCredential => {
        const user = userCredential.user;
        document.getElementById("status").innerText = `Usuário criado: ${user.email}`;
        showLogin(); // volta pro formulário de login
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
  