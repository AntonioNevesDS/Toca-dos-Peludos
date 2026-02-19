const API_BASE = 'http://localhost:8080/api/v1';

async function fetchPets(params = {}) {
  const url = new URL(API_BASE + '/pets');
  Object.entries(params).forEach(([k, v]) => {
    if (v) url.searchParams.set(k, v);
  });
  const res = await fetch(url);
  return res.json();
}

function renderPets(pets) {
  const list = document.getElementById('pets-list');
  list.innerHTML = '';
  pets.forEach(p => {
    const card = document.createElement('div');
    card.className = 'card';
    const img = document.createElement('img');
    img.src = p.urlFoto || 'https://placehold.co/600x400?text=Pet';
    img.alt = p.nome;
    const content = document.createElement('div');
    content.className = 'content';
    const title = document.createElement('h3');
    title.textContent = p.nome;
    const pill = document.createElement('span');
    pill.className = 'pill';
    pill.textContent = `${p.especie} • ${p.porte} • ${p.sexo}`;
    content.appendChild(title);
    content.appendChild(pill);
    card.appendChild(img);
    card.appendChild(content);
    list.appendChild(card);
  });
  const petSelect = document.getElementById('pet-id');
  petSelect.innerHTML = pets.map(p => `<option value="${p.id}">${p.nome}</option>`).join('');
}

async function load() {
  const pets = await fetchPets();
  renderPets(pets);
}

document.getElementById('btn-filtrar').addEventListener('click', async () => {
  const especie = document.getElementById('filter-especie').value;
  const porte = document.getElementById('filter-porte').value;
  const sexo = document.getElementById('filter-sexo').value;
  const pets = await fetchPets({ especie, porte, sexo });
  renderPets(pets);
});

document.getElementById('form-interesse').addEventListener('submit', async (e) => {
  e.preventDefault();
  const feedback = document.getElementById('feedback');
  feedback.textContent = '';
  const email = document.getElementById('email').value.trim();
  const consent = document.getElementById('consent').checked;
  const nome = document.getElementById('nome').value.trim();
  const petId = document.getElementById('pet-id').value;
  const whatsapp = document.getElementById('whatsapp').value.trim();
  const mensagem = document.getElementById('mensagem').value.trim();

  if (!email || !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) {
    feedback.textContent = 'Informe um e-mail válido.';
    feedback.style.color = 'red';
    return;
  }
  if (!consent) {
    feedback.textContent = 'É necessário aceitar os termos de privacidade.';
    feedback.style.color = 'red';
    return;
  }

  const body = { nomeInteressado: nome, email, whatsapp, mensagem };
  const res = await fetch(API_BASE + '/adocoes?pet_id=' + encodeURIComponent(petId), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (res.ok) {
    feedback.textContent = 'Interesse enviado! Entraremos em contato.';
    feedback.style.color = 'green';
    e.target.reset();
  } else {
    feedback.textContent = 'Erro ao enviar. Tente novamente.';
    feedback.style.color = 'red';
  }
});

load();
