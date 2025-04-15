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
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
  
    auth.createUserWithEmailAndPassword(email, password)
      .then(userCredential => {
        const user = userCredential.user;
        document.getElementById("status").innerText = `Usuário criado: ${user.email}`;
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
    if (user) {
      document.getElementById("status").innerText = `Usuário logado: ${user.email || user.displayName}`;
    } else {
      document.getElementById("status").innerText = "Nenhum usuário logado.";
    }
  });
  auth.onAuthStateChanged(user => {
    if (user) {
      // Se o usuário já estiver logado, redireciona pro painel
      window.location.href = "painel.html";
    } else {
      document.getElementById("status").innerText = "Nenhum usuário logado.";
    }
  });
  