const button = document.querySelector('.cake__button');
const progressBar = document.querySelector('.progress-bar-fill');
const doughCounter = document.querySelector('.cake__count');
const flourState = document.querySelector('.flour__info');
const cookiesTable = document.querySelector('.cookies-table')
const rawCookiesCounter = document.querySelector('.cookies-table__count')

let proccessing = false;
let pause = true;
let animationId;

const bakery = {
  doughBalls: [],
  flour: 100,
  isFlour: true,
  rawCookies: 0,
  
  increaseDoughBall() {
    this.doughBalls.push({ width:50, id:this.doughBalls.length });
    updateUI(this);

    displayDoughBalls(this.doughBalls)
  },

  useFlour() {
    if (this.flour >= 10) {
      this.flour -= 10;
      updateUI(this);
    } else {
      this.isFlour = false;
    }
  },

  makeCookie(cookieId) {
    const doughBall = this.doughBalls.find(el => `${el.id}` === cookieId);

    doughBall.width -= 5;
    this.checkDoughBalls();

    this.rawCookies++;
    updateUI(this);

    displayDoughBalls(this.doughBalls);
  },

  checkDoughBalls() {
    this.doughBalls = this.doughBalls.filter(el => el.width > 0)
    updateUI(this);
  }
}

function updateUI(bakery) {
  flourState.textContent = `${bakery.flour}kg`;
  doughCounter.textContent = bakery.doughBalls.length;
  rawCookiesCounter.textContent = bakery.rawCookies;
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

function displayDoughBalls(doughBalls) {
  cookiesTable.innerHTML = '';

  let markup = doughBalls.reduce((accumulator, current) => {
    const { width, id } = current

    return accumulator + `<div class="cookie" style="width: ${width}px; height: ${width}px;" id="${id}"></div>`
  } ,'');

  cookiesTable.insertAdjacentHTML("afterbegin", markup);
}


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

const makeDoughBall = createProgressBar();

function toggleProcess() {
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

button.addEventListener('click', toggleProcess);
cookiesTable.addEventListener('click', (event) => {
  const { id } = event.target;

  if (id) {
    bakery.makeCookie(id);
  }
})