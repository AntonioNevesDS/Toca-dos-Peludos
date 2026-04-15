document.addEventListener("DOMContentLoaded", () => {
  const menuSanduiche = document.querySelector(".menu-sanduiche");
  const navLinks = document.querySelector(".links");

  if (menuSanduiche && navLinks) {
    menuSanduiche.addEventListener("click", () => {
      navLinks.classList.toggle("ativo");
    });
  }

  const usuario = JSON.parse(localStorage.getItem("usuarioLogado") || "null");

  if (!usuario) {
    alert("Você precisa estar logado para acessar o painel.");
    window.location.href = "login.html";
    return;
  }

  if (usuario.tipo !== "admin") {
    alert("Acesso restrito ao administrador.");
    window.location.href = "index.html";
    return;
  }

  configurarTabs();
  carregarSecao("pets");
});

const ADMIN_ENDPOINTS = {
  pets: `${BASE_URL}/admin/pets.php`,
  eventos: `${BASE_URL}/admin/eventos.php`,
  denuncias: `${BASE_URL}/admin/denuncias.php`,
  agendamentos: `${BASE_URL}/admin/agendamentos.php`,
  inscricoes: `${BASE_URL}/admin/inscricoes.php`
};

function configurarTabs() {
  const tabs = document.querySelectorAll(".admin-tab");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      const secao = tab.dataset.section;
      carregarSecao(secao);
    });
  });
}

async function carregarSecao(secao) {
  const container = document.getElementById("adminTabela");
  const mensagem = document.getElementById("adminMensagem");

  container.innerHTML = "";
  mensagem.textContent = "";
  mensagem.className = "admin-mensagem";

  const endpoint = ADMIN_ENDPOINTS[secao];

  if (!endpoint) {
    mensagem.textContent = "Seção inválida.";
    mensagem.classList.add("erro");
    return;
  }

  try {
    const response = await fetch(endpoint);
    const resultado = await response.json();

    if (!resultado.success) {
      mensagem.textContent = resultado.message || "Erro ao carregar dados.";
      mensagem.classList.add("erro");
      return;
    }

    renderizarTabela(secao, resultado.data);
  } catch (error) {
    console.error(`Erro ao carregar ${secao}:`, error);
    mensagem.textContent = "Erro ao carregar dados do painel.";
    mensagem.classList.add("erro");
  }
}

function renderizarTabela(secao, dados) {
  const container = document.getElementById("adminTabela");

  if (!dados || !dados.length) {
    container.innerHTML = `<p class="admin-vazio">Nenhum registro encontrado em ${secao}.</p>`;
    return;
  }

  const colunas = Object.keys(dados[0]);

  let html = `
    <div class="admin-table-wrapper">
      <table class="admin-table">
        <thead>
          <tr>
  `;

  colunas.forEach((coluna) => {
    html += `<th>${formatarTitulo(coluna)}</th>`;
  });

  html += `
          </tr>
        </thead>
        <tbody>
  `;

  dados.forEach((item) => {
    html += `<tr>`;

    colunas.forEach((coluna) => {
      const valor = item[coluna] ?? "";
      html += `<td>${escapeHtml(String(valor))}</td>`;
    });

    html += `</tr>`;
  });

  html += `
        </tbody>
      </table>
    </div>
  `;

  container.innerHTML = html;
}

function formatarTitulo(texto) {
  return texto
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letra) => letra.toUpperCase());
}

function escapeHtml(texto) {
  const div = document.createElement("div");
  div.textContent = texto;
  return div.innerHTML;
}
  
  