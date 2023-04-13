const doughButton = document.querySelector('.cake__button');
const progressBar = document.querySelector('.progress-bar-fill');
const doughCounter = document.querySelector('.cake__count');
const flourState = document.querySelector('.flour__info');
const cookiesTable = document.querySelector('.cookies-table')
const cookiesTablePopup = document.querySelector('.cookies-table--click')
const rawCookiesCounter = document.querySelector('.cookies-table__count')
const stoveButton = document.querySelector('.stove__button');
const stoveCounter = document.querySelector('.stove__inside');
const oven = document.querySelector('.stove');

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
  
      bakeCookies()
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
      bakeCookies(toFill);
    } else {
      this.stove += this.rawCookies;
      bakeCookies(this.rawCookies);
      this.rawCookies = 0;
      alert('Robiliśmy co w naszej mocy, ale mamy za mało ciastek')
    }

    updateUI(this);
  },

  burntCookie() {
    this.stove--;
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

function displayOnClick(x, y) {
  const div = document.createElement('div');
  div.innerHTML = `<div class="cookies-table--click" style="top:${y}px; left:${x}px">+1</div>`

  document.body.append(div);

  setTimeout(() => div.remove(), 1500)
}


const makeDoughBall = (function () {
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
})()

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

function bake (slot) {
  let start;
  let animationId;

  return function baking(timestamp) {
    if (!start) {
      start = timestamp;
    }

    const timer = timestamp - start;

    if (timer > 3000) {
      slot.style.backgroundColor = "orange";
    }
    if (timer > 6000) {
      slot.style.backgroundColor = 'brown';
    } 
    if (timer > 9000) {
      slot.style.backgroundColor = 'black';
    } 
    if (timer >= 12000) {
      bakery.burntCookie();
      slot.style.backgroundColor = 'white';
    }

    animationId = requestAnimationFrame(baking);

    if(slot.style.backgroundColor === 'white') {
      cancelAnimationFrame(animationId)
    }
  }
}

function bakeCookies(cookiesCount = 1) {
  const slotList = Array.from(oven.querySelectorAll('.oven__slot'));

  while (cookiesCount > 0) {
    slotList.some(slot => {
      if (slot.style.backgroundColor === 'white' || !slot.style.backgroundColor) {
        slot.style.backgroundColor = "yellow";
        bake(slot)();

        return true
      }
    })

    cookiesCount--;
  }
}

doughButton.addEventListener('click', toggleProcess);

cookiesTable.addEventListener('click', (event) => {
  const { id } = event.target;
  const [x, y] = [event.clientX, event.clientY];

  if (id) {
    displayOnClick(x, y)
    bakery.makeCookie(id);
  }
})

stoveButton.addEventListener('click', bakery.putRawCookieInStove.bind(bakery));

stoveButton.nextElementSibling.addEventListener('click', bakery.fillStove.bind(bakery));