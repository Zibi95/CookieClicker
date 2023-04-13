const doughButton = document.querySelector('.cake__button');
const progressBar = document.querySelector('.progress-bar-fill');
const doughCounter = document.querySelector('.cake__count');
const flourState = document.querySelector('.flour__info');
const cookiesTable = document.querySelector('.cookies-table')
const rawCookiesCounter = document.querySelector('.cookies-table__count')
const stoveButton = document.querySelector('.stove__button');
const stoveCounter = document.querySelector('.stove__inside');

let proccessing = false;
let pause = true;
let animationId;

const bakery = {
  doughBalls: [],
  flour: 100,
  isFlour: true,
  rawCookies: 0,
  stove: 0,
  stoveCapacity: 9,
  
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
  },

  putRawCookieInStove() {
    if (this.stove >= this.stoveCapacity) {
      alert('Piec jest pełen')
      return;
    }

    if (this.rawCookies > 0) {
      this.rawCookies--;
      this.stove++;
  
      updateUI(this);
    }
  },

  fillStove() {
    if (this.stove >= this.stoveCapacity || this.rawCookies <= 0) {
      return;
    }

    const toFill = this.stoveCapacity - this.stove;

    if (toFill <= this.rawCookies) {
      this.stove += toFill;
      this.rawCookies -= toFill
    } else {
      this.stove += this.rawCookies;
      this.rawCookies = 0;
      alert('Robiliśmy co w naszej mocy, ale mamy za mało ciastek')
    }

    updateUI(this);
  }
}

function updateUI(bakery) {
  flourState.textContent = `${bakery.flour}kg`;
  doughCounter.textContent = bakery.doughBalls.length;
  rawCookiesCounter.textContent = bakery.rawCookies;
  stoveCounter.textContent = bakery.stove;
} 

function changeButtonName() {
  if (!pause) {
    doughButton.classList.add('cake__button--pause')
    doughButton.textContent = 'Zatrzymaj lepienie'
  } else {
    doughButton.classList.remove('cake__button--pause')
    doughButton.textContent = 'Ulep Ciasto'
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

doughButton.addEventListener('click', toggleProcess);

cookiesTable.addEventListener('click', (event) => {
  const { id } = event.target;

  if (id) {
    bakery.makeCookie(id);
  }
})

stoveButton.addEventListener('click', bakery.putRawCookieInStove.bind(bakery));

stoveButton.nextElementSibling.addEventListener('click', bakery.fillStove.bind(bakery));