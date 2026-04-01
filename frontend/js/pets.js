// Aguarda o carregamento completo do HTML para rodar o script
document.addEventListener("DOMContentLoaded", function() {
    const menuSanduiche = document.querySelector('.menu-sanduiche');
    const navLinks = document.querySelector('.links');
  
  
    if (menuSanduiche && navLinks) {
      menuSanduiche.addEventListener('click', () => {
        // Liga e desliga a classe 'ativo' nos links
        navLinks.classList.toggle('ativo');
      });
    } else {
      console.error("Erro: Não encontrei o menu ou os links no HTML.");
    }
  });
  
  
document.addEventListener("DOMContentLoaded", () => {
  carregarPets();

  const btnFiltrar = document.getElementById("btnFiltrar");
  if (btnFiltrar) {
    btnFiltrar.addEventListener("click", aplicarFiltros);
  }

  const inputBusca = document.getElementById("inputBusca");
  if (inputBusca) {
    inputBusca.addEventListener("input", aplicarFiltros);
  }
});

let listaCompletaPets = [];

async function carregarPets() {
  const container = document.getElementById("listaPets");
  if (!container) return;

  try {
    const response = await fetch(`${API_PETS_URL}?status=disponivel`);
    const resultado = await response.json();

    if (!resultado.success) {
      container.innerHTML = `<p>${resultado.message}</p>`;
      return;
    }

    listaCompletaPets = resultado.data;
    renderizarPets(listaCompletaPets);
  } catch (error) {
    console.error("Erro ao carregar pets:", error);
    container.innerHTML = `<p>Erro ao carregar pets.</p>`;
  }
}

function renderizarPets(pets) {
  const container = document.getElementById("listaPets");
  container.innerHTML = "";

  if (!pets.length) {
    container.innerHTML = `<p class="mensagem-vazia">Nenhum pet encontrado.</p>`;
    return;
  }

  pets.forEach((pet) => {
    const card = document.createElement("div");
    card.className = "card-pet";

    const nome = valorSeguro(pet.nome, "Pet sem nome");
    const tipo = valorSeguro(pet.tipo, "tipo não informado");
    const porte = valorSeguro(pet.porte, "porte não informado");
    const raca = valorSeguro(pet.raca, "Não informada");
    const descricao = valorSeguro(
      pet.descricao,
      "Esse pet está esperando por um novo lar cheio de amor."
    );
    const statusTexto = valorSeguro(pet.status, "disponivel");
    const statusClasse = `status-${statusTexto.toLowerCase()}`;

    const imagem =
      pet.imagem_url && pet.imagem_url.trim() !== ""
        ? pet.imagem_url
        : "https://placehold.co/400x260?text=Sem+Foto";

    const local = montarLocalizacao(pet.bairro, pet.cidade);

    card.innerHTML = `
      <div class="card-pet-image-wrapper">
        <img 
          src="${imagem}" 
          alt="${nome}"
          onerror="this.src='https://placehold.co/400x260?text=Sem+Foto'"
        >
        <span class="badge-status ${statusClasse}">
          ${statusTexto}
        </span>
      </div>

      <div class="card-pet-content">
        <h3>${nome}</h3>

        <div class="pet-meta">
          <span>${tipo}</span>
          <span>${porte}</span>
        </div>

        <p class="pet-raca">
          <strong>Raça:</strong> ${raca}
        </p>

        <p class="pet-local">
          <strong>Local:</strong> ${local}
        </p>

        <p class="pet-descricao">
          ${limitarTexto(descricao, 95)}
        </p>

        <a href="detalhes.html?id=${pet.id}" class="btn-ver-mais">
          Ver detalhes
        </a>
      </div>
    `;

    container.appendChild(card);
  });
}

function limitarTexto(texto, limite) {
  if (texto.length <= limite) return texto;
  return texto.slice(0, limite).trim() + "...";
}

function valorSeguro(valor, fallback) {
  if (valor === null || valor === undefined) return fallback;

  const texto = String(valor).trim();
  return texto !== "" ? texto : fallback;
}

function montarLocalizacao(bairro, cidade) {
  const bairroSeguro = bairro ? String(bairro).trim() : "";
  const cidadeSegura = cidade ? String(cidade).trim() : "";

  if (bairroSeguro && cidadeSegura) {
    return `${bairroSeguro}, ${cidadeSegura}`;
  }

  if (bairroSeguro) {
    return bairroSeguro;
  }

  if (cidadeSegura) {
    return cidadeSegura;
  }

  return "Local não informado";
}

function limitarTexto(texto, limite) {
  if (texto.length <= limite) return texto;
  return texto.slice(0, limite).trim() + "...";
}

function aplicarFiltros() {
  const tipoSelecionado = document.getElementById("filtroTipo").value.toLowerCase();
  const termoBusca = document.getElementById("inputBusca").value.toLowerCase();

  let petsFiltrados = [...listaCompletaPets];

  if (tipoSelecionado !== "todos") {
    petsFiltrados = petsFiltrados.filter(
      (pet) => (pet.tipo || "").toLowerCase() === tipoSelecionado
    );
  }

  if (termoBusca) {
    petsFiltrados = petsFiltrados.filter(
      (pet) => (pet.nome || "").toLowerCase().includes(termoBusca)
    );
  }

  renderizarPets(petsFiltrados);
}
