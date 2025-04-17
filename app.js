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

      // ✅ Verifica se o email foi confirmado antes de continuar
      if (!user.emailVerified) {
        Swal.fire({
          title: "Email não verificado",
          text: "Deseja reenviar o link de verificação?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Reenviar",
          cancelButtonText: "Cancelar"
        }).then(result => {
          if (result.isConfirmed) {
            user.sendEmailVerification()
              .then(() => {
                Swal.fire("Enviado!", "Verifique sua caixa de entrada.", "success");
                auth.signOut();
              })
              .catch(error => {
                Swal.fire("Erro", "Não foi possível reenviar o email: " + error.message, "error");
              });
          } else {
            auth.signOut();
          }
        });

        return; // Impede login até verificação
      }

      // Se verificado, redireciona para o painel
      window.location.href = "painel.html";
    })
    .catch(error => {
      Swal.fire("Erro no login", error.message, "error");
    });
}

// ===== CADASTRO DE USUÁRIO =====
function signup() {
  const email = document.getElementById("new-email").value;
  const password = document.getElementById("new-password").value;
  const confirmPassword = document.getElementById("confirm-password").value;
  const nome = document.getElementById("new-name").value;

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

      // Salva o nome no perfil do usuário
      return user.updateProfile({
        displayName: nome
      }).then(() => {
        // Envia email de verificação e sai da conta
        return user.sendEmailVerification().then(() => {
          alert("Conta criada com sucesso! Verifique seu email antes de continuar.");
          auth.signOut();
          window.location.href = "index.html";
        });
      });
    })
    .catch(error => {
      if (error.code === "auth/email-already-in-use") {
        alert("Este email já está em uso. Tente fazer login ou use outro email.");
      } else {
        alert("Erro no cadastro: " + error.message);
      }
    });
}

// ===== LOGIN COM GOOGLE =====
function loginWithGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });

  auth.signInWithPopup(provider)
    .then(result => {
      const user = result.user;
      window.location.href = "painel.html";
    })
    .catch(error => {
      console.error(error);
      alert("Erro no login com Google: " + error.message);
    });
}

// ===== LOGOUT =====
function uploadPhoto() {
  const fileInput = document.getElementById("photo-upload");
  const file = fileInput.files[0];

  if (!file) {
    return Swal.fire("Erro", "Selecione uma imagem primeiro!", "warning");
  }

  const storageRef = firebase.storage().ref();
  const user = firebase.auth().currentUser;

  const photoRef = storageRef.child(`profile_photos/${user.uid}/${file.name}`);

  photoRef.put(file)
    .then(snapshot => snapshot.ref.getDownloadURL())
    .then(url => {
      return user.updateProfile({ photoURL: url });
    })
    .then(() => {
      document.getElementById("user-photo").src = user.photoURL;
      Swal.fire("Foto atualizada!", "Sua foto de perfil foi alterada.", "success");
    })
    .catch(error => {
      console.error(error);
      Swal.fire("Erro ao enviar foto", error.message, "error");
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
function uploadPhoto() {
  const fileInput = document.getElementById("photo-upload");
  const file = fileInput.files[0];

  if (!file) {
    return Swal.fire("Erro", "Selecione uma imagem primeiro!", "warning");
  }

  const storageRef = firebase.storage().ref();
  const user = firebase.auth().currentUser;

  const photoRef = storageRef.child(`profile_photos/${user.uid}/${file.name}`);

  photoRef.put(file)
    .then(snapshot => snapshot.ref.getDownloadURL())
    .then(url => {
      return user.updateProfile({ photoURL: url });
    })
    .then(() => {
      document.getElementById("user-photo").src = user.photoURL;
      Swal.fire("Foto atualizada!", "Sua foto de perfil foi alterada.", "success");
    })
    .catch(error => {
      console.error(error);
      Swal.fire("Erro ao enviar foto", error.message, "error");
    });
}
