const button = document.querySelector('.cake__button');
const doughCounter = document.querySelector('.cake__count')
const progressBar = document.querySelector('.progress-bar-fill');

let done = false;
let pause = true;
let animationId;

const bakery = {
  doughBalls: 0,
  
  increaseDoughBall() {
    this.doughBalls++;
    doughCounter.textContent = this.doughBalls;
  }
}

function createProgressBar() {
  width = 0;

  return function loading() {
    width += 0.4;

    if (width > 100) {
      done = true;
      pause = true;
      width = 0;
      changeButtonName();
      bakery.increaseDoughBall();
    }

    progressBar.style.width = `${width}%`;

    if (!done) {
      animationId = requestAnimationFrame(loading);
    } else {
      done = false;
    }
  };
}

function toggleProgess() {
  pause = !pause
  changeButtonName();

  if (!pause) {
    makeDoughBall();
  } else {
    cancelAnimationFrame(animationId);
  }
}

function changeButtonName() {
  if (!pause && !done) {
    button.textContent = 'Zatrzymaj lepienie'
  } else {
    button.textContent = 'Ulep Ciasto'
  }
}

button.addEventListener('click', () => {
  toggleProgess()
});

const makeDoughBall = createProgressBar();