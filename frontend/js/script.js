//carrossel - home
let currentIndex = 0;

function moveSlide(direction){
  const track = document.querySelector('.carrossel-track');
  const slides = document.querySelector('.item-carrossel');
  const totalSlides = slides.lenght;

currentIndex += direction;

if(currentIndex >= totalSlides) {
  currentIndex = 0;
}else if (currentIndex < 0){
  currentIndex = totalSlides -1;
}

const offset = currentIndex * -100;
track.style.transform = 'translateX(${offset}%)';
}

setInterval(() => moveSlide(1), 5000);


//animação depoimentos

const elemento = document.getElementById('texto-animado');
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