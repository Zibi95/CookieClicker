const button = document.querySelector('.cake__button');
const progressBar = document.querySelector('.progress-bar-fill');
const doughCounter = document.querySelector('.cake__count');
const flourState = document.querySelector('.flour__info');

let proccessing = false;
let pause = true;
let animationId;

const bakery = {
  doughBalls: 0,
  flour: 100,
  isFlour: true,
  
  increaseDoughBall() {
    this.doughBalls++;
    doughCounter.textContent = this.doughBalls;
  },

  useFlour() {
    if (this.flour >= 10) {
      this.flour -= 10;
      flourState.textContent = this.flour;
    } else {
      this.isFlour = false;
    }
  }
}

const makeDoughBall = createProgressBar();

button.addEventListener('click', toggleProgess);

function createProgressBar() {
  width = 0;

  return function loading() {
    width += 100 / 240;

    if (width >= 100) {
      proccessing = false;
      pause = true;
      width = 0;
      changeButtonName();
      bakery.increaseDoughBall();
    }

    progressBar.style.width = `${width}%`;

    if (proccessing) {
      animationId = requestAnimationFrame(loading);
    }
  };
}

function toggleProgess() {
  if (!proccessing) {
    bakery.useFlour();
  }

  if (!bakery.isFlour) {
    flourLowInformation();
    return;
  }

  pause = !pause
  changeButtonName();

  if (!pause) {
    proccessing = true;
    makeDoughBall();
  } else {
    cancelAnimationFrame(animationId);
  }
}

function changeButtonName() {
  if (!pause) {
    button.classList.add('cake__button--pause')
    button.textContent = 'Zatrzymaj lepienie'
  } else {
    button.classList.remove('cake__button--pause')
    button.textContent = 'Ulep Ciasto'
  }
}

function flourLowInformation() {
  const flourInfo = button.nextElementSibling;

  if (!bakery.isFlour) {
    flourInfo.classList.remove('hidden')
    button.setAttribute('disabled', 'true') 
  } else {
    flourInfo.classList.add('hidden')
    button.removeAttribute('disabled')
  }
}
