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
  carregarResumoDashboard();
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
  const tabelaAntiga = container.querySelector('.admin-table-wrapper');

  // Função interna para limpar e mostrar o loader
  const mostrarLoader = () => {
    container.innerHTML = '<div class="loader-suave">Buscando dados...</div>';
    mensagem.textContent = "";
    mensagem.className = "admin-mensagem";
  };

  // Se já houver uma tabela, fazemos a saída suave antes de mostrar o loader
  if (tabelaAntiga) {
    tabelaAntiga.classList.add('fadeOut');
    // Esperamos 300ms (tempo da animação no CSS) antes de trocar o conteúdo
    await new Promise(resolve => setTimeout(resolve, 300));
  }
  
  mostrarLoader();

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

function abrirModalPet(idPet) {
  const pet = dadosTabelaAtual.find(p => Number(p.id) === Number(idPet));
  
  if(pet) {
    document.getElementById("editPetId").value = pet.id;
    document.getElementById("editPetNome").value = pet.nome;
    document.getElementById("editPetStatus").value = pet.status;
    
    // Preenche o campo de consulta (cinza) e o de edição
    const desc = pet.descricao || "Sem descrição cadastrada.";
    document.getElementById("consultarPetDescricao").value = desc;
    document.getElementById("editPetDescricao").value = desc; 
    
    document.getElementById("modalPet").style.display = "block";
    document.body.classList.add("no-scroll");
  }
}

// ==========================================
// LÓGICA DA TABELA E DO MODAL DE DETALHES
// ==========================================

let dadosTabelaAtual = []; // Variável para armazenar os dados e o Modal poder ler

function renderizarTabela(secao, dados) {
  const container = document.getElementById("adminTabela");
  dadosTabelaAtual = dados; // Guarda os dados globalmente

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

  // Adicionando a coluna de Ações extra no cabeçalho
  html += `<th>Ações</th></tr></thead><tbody>`;

  dados.forEach((item) => {
    html += `<tr>`;

    colunas.forEach((coluna) => {
      const valor = item[coluna] ?? "";
      html += `<td>${escapeHtml(String(valor))}</td>`;
    });

// Renderiza botões de ação dinâmicos dependendo da aba
    if (secao === 'pets') {
      html += `<td><button class="btn-accent" style="padding: 6px 12px; font-size: 12px;" onclick="abrirModalPet(${item.id})">Detalhes</button></td>`;
    } else if (secao === 'eventos') { // <--- ADICIONADO AQUI
      html += `<td><button class="btn-accent" style="padding: 6px 12px; font-size: 12px; background-color: #9C27B0;" onclick="abrirModalEvento(${item.id})">Gerenciar</button></td>`;
    } else if (secao === 'agendamentos') {
      html += `<td><button class="btn-accent" style="padding: 6px 12px; font-size: 12px; background-color: #2196F3;" onclick="abrirModalAgendamento(${item.id})">Gerenciar</button></td>`;
    } else if (secao === 'inscricoes') {
      html += `<td><button class="btn-accent" style="padding: 6px 12px; font-size: 12px; background-color: #4CAF50;" onclick="abrirModalInscricao(${item.id})">Gerenciar</button></td>`;
    } else if (secao === 'denuncias') {
      html += `<td><button class="btn-accent" style="padding: 6px 12px; font-size: 12px; background-color: #e74c3c;" onclick="abrirModalDenuncia(${item.id})">Ver Caso</button></td>`;
    } else {
      html += `<td>-</td>`;
    }
  });

  html += `</tbody></table></div>`;
  container.innerHTML = html;
}

// FECHAR O MODAL
function fecharModalPet() {
  document.getElementById("modalPet").style.display = "none";
  document.body.classList.remove("no-scroll");
  document.getElementById("msgEditPet").textContent = "";
}

// SALVAR O PET NO BANCO (Enviando pro PHP)
document.getElementById("formEditarPet")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const msg = document.getElementById("msgEditPet");
  msg.textContent = "Salvando...";
  msg.className = "admin-mensagem";

  const payload = {
    id: document.getElementById("editPetId").value,
    nome: document.getElementById("editPetNome").value,
    status: document.getElementById("editPetStatus").value,
    descricao: document.getElementById("editPetDescricao").value
  };

  try {
    const response = await fetch(`${BASE_URL}/admin/atualizar_pet.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const resultado = await response.json();

    if (resultado.success) {
      msg.textContent = "Pet atualizado com sucesso!";
      msg.classList.add("sucesso");
      msg.style.color = "green";
      
      setTimeout(() => {
        fecharModalPet();
        carregarSecao("pets"); 
      }, 1000);
    } else {
      msg.textContent = resultado.message;
      msg.classList.add("erro");
    }
  } catch (error) {
    msg.textContent = "Erro ao conectar com o servidor.";
    msg.classList.add("erro");
  }
});

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

//carregar dashboard para carregar quantidade de itens do bd
async function carregarResumoDashboard() {
  try {
    const response = await fetch(`${BASE_URL}/admin/dashboard.php`);
    const resultado = await response.json();

    if (resultado.success) {
      const totais = resultado.data;
      
      // Busca o card pela data-section e atualiza o span.numero dentro dele
      document.querySelector('.card[data-section="pets"] .numero').textContent = totais.total_pets;
      document.querySelector('.card[data-section="eventos"] .numero').textContent = totais.total_eventos;
      document.querySelector('.card[data-section="denuncias"] .numero').textContent = totais.total_denuncias;
      document.querySelector('.card[data-section="inscricoes"] .numero').textContent = totais.total_inscricoes;
      document.querySelector('.card[data-section="agendamentos"] .numero').textContent = totais.total_agendamentos;
    }
  } catch (error) {
    console.error("Erro ao carregar o resumo do dashboard:", error);
  }
}

// ==========================================
// MODAL DE AGENDAMENTOS
// ==========================================

function abrirModalAgendamento(idAgendamento) {
  const agendamento = dadosTabelaAtual.find(a => Number(a.id) === Number(idAgendamento));
  
  if(agendamento) {
    document.getElementById("editAgendId").value = agendamento.id;
    document.getElementById("infoAgendNome").textContent = agendamento.nome_interessado;
    document.getElementById("infoAgendPet").textContent = agendamento.nome_pet || "Pet Excluído/Não encontrado";
    
    // Formata a data para visualização
    const dataObj = new Date(agendamento.data_visita);
    const dataFormatada = dataObj.toLocaleDateString('pt-BR');
    document.getElementById("infoAgendData").textContent = `${dataFormatada} às ${agendamento.horario_visita}`;
    
    document.getElementById("editAgendStatus").value = agendamento.status;
    
    document.getElementById("modalAgendamento").style.display = "block";
    document.body.classList.add("no-scroll");
  }
}

function fecharModalAgendamento() {
  document.getElementById("modalAgendamento").style.display = "none";
  document.body.classList.remove("no-scroll");
  document.getElementById("msgEditAgendamento").textContent = "";
}

document.getElementById("formEditarAgendamento")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const msg = document.getElementById("msgEditAgendamento");
  msg.textContent = "Atualizando...";
  msg.className = "admin-mensagem";

  const payload = {
    id: document.getElementById("editAgendId").value,
    status: document.getElementById("editAgendStatus").value
  };

  try {
    const response = await fetch(`${BASE_URL}/admin/atualizar_agendamento.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const resultado = await response.json();

    if (resultado.success) {
      msg.textContent = "Status atualizado!";
      msg.classList.add("sucesso");
      msg.style.color = "green";
      
      setTimeout(() => {
        fecharModalAgendamento();
        carregarSecao("agendamentos"); 
      }, 1000);
    } else {
      msg.textContent = resultado.message;
      msg.classList.add("erro");
    }
  } catch (error) {
    msg.textContent = "Erro ao conectar com o servidor.";
    msg.classList.add("erro");
  }
});

// CONTROLO INSCRIÇÕES
function abrirModalInscricao(id) {
  const item = dadosTabelaAtual.find(i => Number(i.id) === Number(id));
  if(item) {
    document.getElementById("editInscId").value = item.id;
    document.getElementById("inscEvento").textContent = item.evento;
    document.getElementById("inscNome").textContent = item.nome;
    document.getElementById("editInscStatus").value = item.status;
    document.getElementById("modalInscricao").style.display = "block";
    document.body.classList.add("no-scroll");
  }
}
function fecharModalInscricao() { document.getElementById("modalInscricao").style.display = "none"; document.body.classList.remove("no-scroll"); }

document.getElementById("formEditarInscricao")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const payload = { id: document.getElementById("editInscId").value, status: document.getElementById("editInscStatus").value };
  const response = await fetch(`${BASE_URL}/admin/atualizar_inscricao.php`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
  const res = await response.json();
  if(res.success) { carregarSecao("inscricoes"); fecharModalInscricao(); }
});

// CONTROLO DENÚNCIAS
function abrirModalDenuncia(id) {
  const item = dadosTabelaAtual.find(i => Number(i.id) === Number(id));
  if(item) {
    document.getElementById("editDenId").value = item.id;
    document.getElementById("denTipo").textContent = item.tipo;
    document.getElementById("denLocal").textContent = item.localizacao;
    document.getElementById("denRelato").textContent = item.descricao;
    document.getElementById("editDenStatus").value = item.status;
    document.getElementById("modalDenuncia").style.display = "block";
    document.body.classList.add("no-scroll");
  }
}
function fecharModalDenuncia() { document.getElementById("modalDenuncia").style.display = "none"; document.body.classList.remove("no-scroll"); }

document.getElementById("formEditarDenuncia")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const payload = { id: document.getElementById("editDenId").value, status: document.getElementById("editDenStatus").value };
  const response = await fetch(`${BASE_URL}/admin/atualizar_denuncia.php`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
  const res = await response.json();
  if(res.success) { carregarSecao("denuncias"); fecharModalDenuncia(); }
});

// ==========================================
// MODAL DE EVENTOS
// ==========================================

function abrirModalEvento(id) {
  const evento = dadosTabelaAtual.find(e => Number(e.id) === Number(id));
  
  if(evento) {
    document.getElementById("editEventoId").value = evento.id;
    document.getElementById("infoEventoTitulo").textContent = evento.titulo;
    
    // Formatar a data
    const dataObj = new Date(evento.data_evento);
    // Para evitar fuso horário puxando 1 dia para trás, usamos getUTC
    const dataFormatada = `${String(dataObj.getUTCDate()).padStart(2, '0')}/${String(dataObj.getUTCMonth() + 1).padStart(2, '0')}/${dataObj.getUTCFullYear()}`;
    
    document.getElementById("infoEventoData").textContent = dataFormatada;
    document.getElementById("infoEventoLocal").textContent = `${evento.local} (${evento.cidade})`;
    
    document.getElementById("editEventoStatus").value = evento.status;
    
    document.getElementById("modalEvento").style.display = "block";
    document.body.classList.add("no-scroll");
  }
}

function fecharModalEvento() {
  document.getElementById("modalEvento").style.display = "none";
  document.body.classList.remove("no-scroll");
  document.getElementById("msgEditEvento").textContent = "";
}

document.getElementById("formEditarEvento")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const msg = document.getElementById("msgEditEvento");
  msg.textContent = "Atualizando...";
  msg.className = "admin-mensagem";

  const payload = {
    id: document.getElementById("editEventoId").value,
    status: document.getElementById("editEventoStatus").value
  };

  try {
    const response = await fetch(`${BASE_URL}/admin/atualizar_evento.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const resultado = await response.json();

    if (resultado.success) {
      msg.textContent = "Evento atualizado!";
      msg.classList.add("sucesso");
      msg.style.color = "green";
      
      setTimeout(() => {
        fecharModalEvento();
        carregarSecao("eventos"); 
      }, 1000);
    } else {
      msg.textContent = resultado.message;
      msg.classList.add("erro");
    }
  } catch (error) {
    msg.textContent = "Erro ao conectar com o servidor.";
    msg.classList.add("erro");
  }
});
  