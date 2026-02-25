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
