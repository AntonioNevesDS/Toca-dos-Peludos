const API_URL = "http://localhost:8080/api/docaoes";

async function enviarDoacao(valor) {
    const doacao = {
        doador: "Doador Anônimo",
        valor: valor
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(doacao)
        });

        if (response.ok) {
            alert('Doação registrada com sucesso!');
            carregarDoacoes();
        }
    } catch (error) {
        console.error("Erro ao enviar doação:", error);
    }
}

async function carregarDoacoes() {
    const lista = document.getElementById('listaDoacoes');
    if (!lista) return;

    try {
        const response = await fetch(API_URL);
        const doacoes = await response.json();

        lista.innerHTML = "";
        doacoes.forEach(d => {
            const li = document.createElement('li');
            li.textContent = `🐾 R$ ${d.valor.toFixed(2)} recebidos`;
            lista.appendChild(li);
        });
    } catch (error) {
        console.error("Erro ao carregar lista:", error);
    }
}

document.addEventListener("DOMContentLoaded", carregarDoacoes);