// 🎯 ANIMAÇÃO DE TEXTO
const elemento = document.getElementById('texto-animado');

if (elemento) {
  const frases = [
    "Veja Alguns Depoimentos Dos Nossos Adotantes",
    "Salve uma Vida",
    "Alegre o coração de um pet"
  ];

  let fraseIndex = 0;
  let caractereIndex = 0;
  let deletando = false;

  function animarTexto() {
    const fraseAtual = frases[fraseIndex];

    if (deletando) {
      elemento.textContent = fraseAtual.substring(0, caractereIndex - 1);
      caractereIndex--;
    } else {
      elemento.textContent = fraseAtual.substring(0, caractereIndex + 1);
      caractereIndex++;
    }

    let velocidade = deletando ? 50 : 100;

    if (!deletando && caractereIndex === fraseAtual.length) {
      velocidade = 2000;
      deletando = true;
    } else if (deletando && caractereIndex === 0) {
      deletando = false;
      fraseIndex = (fraseIndex + 1) % frases.length;
      velocidade = 500;
    }

    setTimeout(animarTexto, velocidade);
  }

  animarTexto();
}

// 🎠 CARROSSEL
function iniciarCarrossel() {
  const btnNext = document.getElementById("nextSlide");
  const btnPrevious = document.getElementById("previousSlide");
  const slider = document.querySelector(".slider");
  const content = document.querySelector(".content");

  if (!btnNext || !btnPrevious || !slider || !content) return;

  const slideWidth = slider.offsetWidth;
  const contentWidth = content.scrollWidth;
  const contentLength = content.children.length;

  let currentSlide = 0;
  let scroll = 0;
  let autoplay;

  function setCurrentDot() {
    const dots = document.querySelectorAll(".dot");
    dots.forEach(dot => dot.classList.remove("current"));
    dots[currentSlide]?.classList.add("current");
  }

  function controlSlide(e) {
    if (e.target.id === "nextSlide") {
      if (scroll + slideWidth < contentWidth) {
        scroll += slideWidth;
        currentSlide++;
      } else {
        scroll = 0;
        currentSlide = 0;
      }
    } else {
      if (scroll > 0) {
        scroll -= slideWidth;
        currentSlide--;
      }
    }

    slider.scrollLeft = scroll;
    setCurrentDot();
  }

  btnNext.addEventListener("click", controlSlide);
  btnPrevious.addEventListener("click", controlSlide);

  function startAutoplay() {
    autoplay = setInterval(() => btnNext.click(), 5000);
  }

  function stopAutoplay() {
    clearInterval(autoplay);
  }

  slider.addEventListener("mouseenter", stopAutoplay);
  slider.addEventListener("mouseleave", startAutoplay);

  // Criar dots
  const dotsContainer = slider.parentElement.querySelector(".length-dots");
  const firstDot = dotsContainer?.querySelector(".dot");

  if (dotsContainer && firstDot) {
    for (let i = 1; i < contentLength; i++) {
      dotsContainer.appendChild(firstDot.cloneNode(true));
    }
  }

  setCurrentDot();
  startAutoplay();
}

// 🧾 PAINEL ADM
function initPainelADM() {
  const cards = document.querySelectorAll('.dashboard-grid .card');
  const secaoDetalhes = document.getElementById('secao-detalhes');
  const tituloSecao = document.getElementById('titulo-secao');
  const cabecalhoTabela = document.getElementById('cabecalho-tabela');
  const corpoTabela = document.getElementById('corpo-tabela');

  if (!cards.length || !secaoDetalhes) return;

  cards.forEach(card => {
    card.addEventListener('click', () => {
      const tipo = card.dataset.tipo;

      secaoDetalhes.style.display = 'block';
      corpoTabela.innerHTML = '<tr><td colspan="6">Carregando...</td></tr>';

      if (tipo === 'denuncias') {
        tituloSecao.innerText = 'Gerenciar Denúncias';
        carregarTabelaDenuncias(cabecalhoTabela, corpoTabela);
      } else if (tipo === 'pets') {
        tituloSecao.innerText = 'Gerenciar Pets';
        carregarTabelaPets(cabecalhoTabela, corpoTabela);
      }
    });
  });
}

// 📡 API DENÚNCIAS
async function carregarTabelaDenuncias(cabecalho, corpo) {
  cabecalho.innerHTML = `
    <th>ID</th><th>Tipo</th><th>Descrição</th>
    <th>Local</th><th>Contato</th><th>Data</th>
  `;

  try {
    const res = await fetch('http://localhost/Toca-dos-Peludos/api/denuncias.php');
    const dados = await res.json();

    let html = "";

    dados.forEach(d => {
      const contato = d.anonimo == 1 ? "Anônimo" : (d.contato || "-");
      const data = new Date(d.data_denuncia).toLocaleDateString('pt-BR');

      html += `
        <tr>
          <td>#${d.id}</td>
          <td>${d.tipo}</td>
          <td>${d.descricao}</td>
          <td>${d.localizacao || '-'}</td>
          <td>${contato}</td>
          <td>${data}</td>
        </tr>
      `;
    });

    corpo.innerHTML = html;

  } catch (e) {
    console.error(e);
    corpo.innerHTML = '<tr><td colspan="6">Erro ao carregar</td></tr>';
  }
}

// 🐶 API PETS
async function carregarTabelaPets(cabecalho, corpo) {
  cabecalho.innerHTML = `
    <th>ID</th><th>Foto</th><th>Nome</th>
    <th>Tipo</th><th>Porte</th><th>Status</th>
  `;

  try {
    const res = await fetch('http://localhost/Toca-dos-Peludos/api/pets.php');
    const pets = await res.json();

    let html = "";

    pets.forEach(p => {
      const cor = p.status === 'DISPONÍVEL' ? 'green' : 'orange';

      html += `
        <tr>
          <td>#${p.id}</td>
          <td><img src="${p.imagemUrl}" width="40"></td>
          <td>${p.nome}</td>
          <td>${p.tipo}</td>
          <td>${p.porte}</td>
          <td style="color:${cor}">${p.status}</td>
        </tr>
      `;
    });

    corpo.innerHTML = html;

  } catch (e) {
    console.error(e);
    corpo.innerHTML = '<tr><td colspan="6">Erro ao carregar</td></tr>';
  }
}

// =========================================
// 💰 PIX COMPLETO
// =========================================

document.addEventListener("DOMContentLoaded", () => {

  iniciarCarrossel();

  initPainelADM();

  const modal =
    document.getElementById("popupPix");

  const fecharModal =
    document.getElementById("fecharModal");

  const botoesDoar =
    document.querySelectorAll(".btn-doar");

  const btnOutroValor =
    document.getElementById("btnOutroValor");

  const inputValor =
    document.getElementById("valorDoacao");

  const tituloModal =
    document.getElementById("tituloModal");

  const btnGerarPix =
    document.getElementById("btnGerarPix");

  const btnCopiarPix =
    document.getElementById("btnCopiarPix");

  const qrCodeDiv =
    document.getElementById("qrcode");

  const codigoPixInput =
    document.getElementById("codigoPix");

  let valorSelecionado = null;

  // =========================
  // ABRIR MODAL
  // =========================

  function abrirModal() {

    modal.style.display = "block";

    document.body.classList.add("no-scroll");

    qrCodeDiv.innerHTML = "";

    codigoPixInput.value = "";

    btnCopiarPix.disabled = true;

    btnCopiarPix.innerText = "Copiar";
  }

  // =========================
  // FECHAR MODAL
  // =========================

  function fecharModalPix() {

    modal.style.display = "none";

    document.body.classList.remove("no-scroll");
  }

  fecharModal?.addEventListener(
    "click",
    fecharModalPix
  );

  window.addEventListener("click", (e) => {

    if (e.target === modal) {

      fecharModalPix();
    }
  });

  // =========================
  // BOTÕES FIXOS
  // =========================

  botoesDoar.forEach(btn => {

    btn.addEventListener("click", () => {

      valorSelecionado =
        parseFloat(btn.dataset.valor);

      tituloModal.innerText =
        `Doe R$ ${valorSelecionado.toFixed(2)}`;

      inputValor.style.display = "none";

      abrirModal();
    });

  });

  // =========================
  // OUTRO VALOR
  // =========================

  btnOutroValor?.addEventListener("click", () => {

    valorSelecionado = null;

    tituloModal.innerText =
      "Digite o valor da doação";

    inputValor.style.display = "block";

    abrirModal();
  });

  // =========================
  // GERAR PIX
  // =========================

  btnGerarPix?.addEventListener("click", async () => {

    let valorFinal = valorSelecionado;

    if (!valorFinal) {

      valorFinal = parseFloat(
        inputValor.value.replace(",", ".")
      );
    }

    if (!valorFinal ||
        valorFinal <= 0 ||
        isNaN(valorFinal)) {

      alert("Digite um valor válido");

      return;
    }

    try {

      const payload =
        gerarPayloadPix(valorFinal);

      qrCodeDiv.innerHTML = "";

      const canvas =
        document.createElement("canvas");

      qrCodeDiv.appendChild(canvas);

      await QRCode.toCanvas(
        canvas,
        payload,
        {
          width: 220,
          margin: 2,
          color: {
            dark: "#000000",
            light: "#ffffff"
          }
        }
      );

      codigoPixInput.value = payload;

      btnCopiarPix.disabled = false;

    } catch (err) {

      console.error(err);

      alert("Erro ao gerar QR Code");
    }

  });

  // =========================
  // COPIAR PIX
  // =========================

  btnCopiarPix?.addEventListener(
    "click",
    async () => {

      try {

        await navigator.clipboard.writeText(
          codigoPixInput.value
        );

        btnCopiarPix.innerText = "Copiado!";

        setTimeout(() => {

          btnCopiarPix.innerText = "Copiar";

        }, 2000);

      } catch (err) {

        console.error(err);

        alert("Erro ao copiar código");
      }

    }
  );

});

// =========================================
// GERAR PAYLOAD PIX
// =========================================

function gerarPayloadPix(valor) {

  const chavePix = "48712800805";

  const nome = "TIAGO OLIVEIRA";

  const cidade = "SAO PAULO";

  const txid = "TOCADOSPELUDOS";

  function format(id, value) {

    const size =
      value.length
      .toString()
      .padStart(2, "0");

    return id + size + value;
  }

  const merchantAccount =
    format(
      "26",
      format("00", "br.gov.bcb.pix") +
      format("01", chavePix)
    );

  const additionalData =
    format(
      "62",
      format("05", txid)
    );

  let payload =
    format("00", "01") +
    format("01", "12") +
    merchantAccount +
    format("52", "0000") +
    format("53", "986") +
    format("54", valor.toFixed(2)) +
    format("58", "BR") +
    format("59", nome.substring(0, 25)) +
    format("60", cidade.substring(0, 15)) +
    additionalData +
    "6304";

  payload += crc16(payload);

  return payload;
}

// =========================================
// CRC16 OFICIAL PIX
// =========================================

function crc16(str) {

  let crc = 0xFFFF;

  for (let c = 0; c < str.length; c++) {

    crc ^= str.charCodeAt(c) << 8;

    for (let i = 0; i < 8; i++) {

      if (crc & 0x8000) {

        crc =
          (crc << 1) ^ 0x1021;

      } else {

        crc = crc << 1;
      }

      crc &= 0xFFFF;
    }
  }

  return crc
    .toString(16)
    .toUpperCase()
    .padStart(4, "0");
}