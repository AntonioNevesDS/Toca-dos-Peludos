document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formDenuncia");
  const mensagem = document.getElementById("mensagemDenuncia");
  const checkbox = document.getElementById("anonimoCheckbox");
  const campoContato = document.getElementById("contatoDenuncia");

  if (!form || !mensagem || !checkbox || !campoContato) {
    console.error("Erro: elementos do formulário não encontrados.");
    return;
  }

  // comportamento do checkbox
  checkbox.addEventListener("change", () => {
    if (checkbox.checked) {
      campoContato.value = "";
      campoContato.disabled = true;
    } else {
      campoContato.disabled = false;
    }
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    mensagem.textContent = "";
    mensagem.className = "";

    const payload = {
      tipo: document.getElementById("tipoDenuncia").value,
      descricao: document.getElementById("descricaoDenuncia").value.trim(),
      localizacao: document.getElementById("localDenuncia").value.trim(),
      contato: campoContato.value.trim(),
      anonimo: checkbox.checked ? 1 : 0
    };

    try {
      const response = await fetch(API_DENUNCIAS_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const resultado = await response.json();

      if (!resultado.success) {
        mensagem.textContent = resultado.message;
        mensagem.classList.add("erro");
        return;
      }

      mensagem.textContent = "Denúncia enviada com sucesso!";
      mensagem.classList.add("sucesso");
      form.reset();
      campoContato.disabled = false;

    } catch (error) {
      console.error("Erro:", error);
      mensagem.textContent = "Erro ao enviar denúncia.";
      mensagem.classList.add("erro");
    }
  });
});