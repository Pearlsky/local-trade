import { key, populateTableHead, populateTableBody } from "./populate-td.js";
import {
  otherKey,
  populateSelectOptions,
  createFiatOption,
  createCryptoOption,
} from "./populate-sel.js";

init();

function init() {
  navToggle();
  populateCryptoTable();
  getCryptoOptions();
  // getFiatOptions();
  modalToggle();
  convertUI();
}

function navToggle() {
  const navMenu = document.querySelector(".nav__menu--open");
  const navClose = document.querySelector(".nav__menu--close");
  const navSlide = document.querySelector(".nav-outline");

  navMenu.addEventListener("click", (e) => {
    navSlide.style.display = "block";
    navSlide.style.animation = "drop-in .3s ease-in 1 both";
    navMenu.setAttribute("aria-expanded", "true");
  });

  navClose.addEventListener("click", (e) => {
    navSlide.removeAttribute("style");
    navMenu.setAttribute("aria-expanded", "false");
  });

  function subMenuToggle() {
    const navMenuBar = document.querySelector(".nav__list");
    navMenuBar.addEventListener("click", (e) => {
      e.preventDefault();
      if (e.target.parentElement.classList.contains("has-submenu")) {
        const submenuList = e.target.parentElement;
        const submenuIcon = submenuList.querySelector(".submenu-icon");
        const submenu = submenuList.querySelector(".submenu");

        if (submenu.hasAttribute("hidden")) {
          submenu.removeAttribute("hidden");
          e.target.setAttribute("aria-expanded", "true");
          submenuIcon.style.transform = "rotateX(180deg)";
        } else {
          submenu.setAttribute("hidden", "hidden");
          e.target.setAttribute("aria-expanded", "false");
          submenuIcon.removeAttribute("style");
        }
      }
    });
  }

  subMenuToggle();
}

function modalToggle() {
  function getFocusableEls(el) {
    return Array.from(
      el.querySelectorAll(
        'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex="0"]'
      )
    );
  }

  function setAndMaintainFocus(el, array) {
    const firstFocusableEl = array[0];
    const lastFocusableEl = array[array.length - 1];

    // setting focus on open
    firstFocusableEl.focus();

    // maintaining focus while open
    el.addEventListener("keydown", (e) => {
      function maintainShiftTab() {
        if (document.activeElement === firstFocusableEl) {
          e.preventDefault();
          lastFocusableEl.focus();
        }
      }

      function maintainTab() {
        if (document.activeElement === lastFocusableEl) {
          e.preventDefault();
          firstFocusableEl.focus();
        }
      }

      if (e.key === "Tab") {
        if (array.length === 1) {
          e.preventDefault();
        }

        if (e.shiftKey) {
          maintainShiftTab();
        } else {
          maintainTab();
        }
      }
    });
  }

  function closeModal(closableEl, lastFocusedEl) {
    closableEl.setAttribute("hidden", "");
    lastFocusedEl.focus();
  }

  function setAndControlClose(el) {
    el.addEventListener("click", (e) => {
      if (e.target.classList.contains("modal__close")) {
        closeModal(el, modalOpenBtn);
      }
    });

    el.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeModal(el, modalOpenBtn);
      }
    });
  }

  const modal = document.querySelector(".modal");
  const modalOpenBtn = document.querySelector(".brand-usp__cta");

  modalOpenBtn.addEventListener("click", (e) => {
    modal.removeAttribute("hidden");
    modal.focus();

    const focusableEles = getFocusableEls(modal);
    setAndMaintainFocus(modal, focusableEles);
  });

  setAndControlClose(modal);
}

function populateCryptoTable() {
  const cryptoTable = document.querySelector(".pre-load");
  const tHeadData = {
    1: "Name",
    2: "Price",
    3: "Change 24H",
    4: "Dynamic",
  };
  fetch(
    `https://min-api.cryptocompare.com/data/top/totalvolfull?limit=23&tsym=USD&apikey=${key}`
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      } else {
        return response.json();
      }
    })
    .then((data) => {
      const tThead = populateTableHead(tHeadData);
      const tTbody = populateTableBody(data["Data"]);
      cryptoTable.classList.add("crypto-table");
      cryptoTable.innerHTML = "";
      cryptoTable.classList.remove("pre-load");

      cryptoTable.append(tThead, tTbody);
    })
    .catch((err) => {
      console.error(`${err.name} : ${err.message}`);
    });
}

function getCryptoOptions() {
  fetch(
    `https://min-api.cryptocompare.com/data/top/totalvolfull?limit=30&tsym=USD&api_key=b85b854a8ef386ecc096058169e05968cf95b434051bc3671b59dd6a4155ba2a`
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      } else {
        return response.json();
      }
    })
    .then((data) => {
      const cryptoOptions = data["Data"].map((el) => createCryptoOption(el));
      populateSelectOptions(".convert-from__select", cryptoOptions);
      const cryptosOptions = data["Data"].map((el) => createCryptoOption(el));
      populateSelectOptions(".convert-to__select", cryptosOptions);
    })
    .catch((err) => {
      console.error(`${err.name}: ${err.message}: ${err.cause}`);
    });
}

function getFiatOptions() {
  fetch(
    `https://pro-api.coinmarketcap.com/v1/fiat/map?sort=name&CMC_PRO_API_KEY=${otherKey}`
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      } else {
        return response.json();
      }
    })
    .then((data) => {
      const fiatOptions = data["data"].map((el) => createFiatOption(el));
      populateSelectOptions(".convert-to__select", fiatOptions);
    })
    .catch((err) => {
      console.error(`${err.name}: ${err.message}: ${err.cause}`);
    });
}

function convertUI() {
  getRate();
  let currencyRate;
  let currencyFrom;
  let currencyTo;

  function convert(amount) {
    if (currencyRate !== undefined) {
      return Number(amount) * Number(currencyRate.toFixed(4));
    }
  }

  function amountCurrencyHandler(e) {
    currencyFrom = e.target.value;
    console.log(currencyFrom);
    getRate(currencyFrom, currencyTo);
  }

  function convertedToCurrencyHandler(e) {
    currencyTo = e.target.value;
    console.log(currencyTo);
    getRate(currencyFrom, currencyTo);
  }

  function getRate(currencyFrom, currencyTo) {
    (async () => {
      const response = await fetch(
        `https://rest.coinapi.io/v1/exchangerate/${
          currencyFrom !== undefined ? currencyFrom : "BTC"
        }/${currencyTo !== undefined ? currencyTo : "BTC"}`,
        {
          method: "GET",
          headers: { "X-CoinAPI-Key": "CFA97BA1-59A9-40E4-8FFD-C3542E4CE9AB" },
        }
      );
      const data = await response.json();
      const { rate } = data;
      currencyRate = rate;
    })();
  }

  const fromInput = document.querySelector(".convert-from input");
  const toInput = document.querySelector(".convert-to input");

  fromInput.addEventListener("change", (e) => {
    console.log(e.target.value);
    toInput.value = convert(e.target.value);
  });

  const fromSelect = document.querySelector(".convert-from select");
  const toSelect = document.querySelector(".convert-to select");

  fromSelect.addEventListener("change", amountCurrencyHandler);
  toSelect.addEventListener("change", convertedToCurrencyHandler);
}
