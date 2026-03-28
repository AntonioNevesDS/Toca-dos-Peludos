// =========================
// CONFIG DA API
// =========================
const API_BASE_URL = "http://localhost/Toca-dos-Peludos/api/public";

// =========================
// LOGIN
// =========================
const formLogin = document.getElementById("formLogin");

if (formLogin) {
  formLogin.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("emailLogin").value.trim();
    const password = document.getElementById("senhaLogin").value;

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Erro ao fazer login.");
        return;
      }

      if (data.data && data.data.access_token) {
        localStorage.setItem("token", data.data.access_token);
      }

      alert("Login realizado com sucesso!");
      console.log("Resposta da API:", data);

      // opcional: redirecionar
      // window.location.href = "index.html";

    } catch (error) {
      console.error("Erro ao conectar com a API:", error);
      alert("Não foi possível conectar com a API.");
    }
  });
}

// =========================
// MODAL SENHA
// =========================
function abrirRecuperação() {
  document.getElementById("modalSenha").style.display = "block";
  document.getElementById("telaEmail").style.display = "block";
  document.getElementById("telaCodigo").style.display = "none";
  document.getElementById("telaRedefinirSenha").style.display = "none";
}

function fecharRecuperacao() {
  document.getElementById("modalSenha").style.display = "none";
}

function irCodigo() {
  let campo = document.getElementById("campoEmail");

  if (campo.checkValidity() === false) {
    campo.reportValidity();
    return;
  }

  document.getElementById("telaEmail").style.display = "none";
  document.getElementById("telaCodigo").style.display = "block";
}

function irRedefinirSenha() {
  document.getElementById("telaCodigo").style.display = "none";
  document.getElementById("telaRedefinirSenha").style.display = "block";
}

// =========================
// MODAL EMAIL
// =========================
function abrirTelefone() {
  document.getElementById("modalEmail").style.display = "block";
  document.getElementById("telaTelefoneCadastrado").style.display = "block";
  document.getElementById("telaCodigoSms").style.display = "none";
  document.getElementById("telaRedefinirEmail").style.display = "none";
}

function fecharTelefone() {
  document.getElementById("modalEmail").style.display = "none";
}

function irCodigoSms() {
  let campo = document.getElementById("campoTelefone");

  if (campo.checkValidity() === false) {
    campo.reportValidity();
    return;
  }

  document.getElementById("telaTelefoneCadastrado").style.display = "none";
  document.getElementById("telaCodigoSms").style.display = "block";
}

function irRedefinirEmail() {
  document.getElementById("telaCodigoSms").style.display = "none";
  document.getElementById("telaRedefinirEmail").style.display = "block";
}