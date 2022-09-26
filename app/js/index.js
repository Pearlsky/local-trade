import {key, populateTableHead, populateTableBody} from "./populate-td.js";
import {otherKey, populateSelectOptions, createFiatOption, createCryptoOption} from "./populate-sel.js";

function init() {
    navToggle();
    populateCryptoTable();
    getCryptoOptions();
    getFiatOptions();
    modalToggle();
}

function navToggle() {
    const navMenu = document.querySelector(".nav__menu--open");
    const navClose = document.querySelector(".nav__menu--close");
    const navSlide = document.querySelector(".nav-outline");

    navMenu.addEventListener("click", (e) => {
        navSlide.style.display = "block";
        navSlide.style.animation = "drop-in .3s ease-in 1 both"
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
            if(e.target.parentElement.classList.contains("has-submenu")) {
                const submenuList = e.target.parentElement;
                const submenuIcon = submenuList.querySelector(".submenu-icon");
                const submenu = submenuList.querySelector(".submenu");
                
                if(submenu.hasAttribute("hidden")) {
                    submenu.removeAttribute("hidden")
                    e.target.setAttribute("aria-expanded", "true")
                    submenuIcon.style.transform = "rotateX(180deg)"
                } else {
                    submenu.setAttribute("hidden", "hidden")
                    e.target.setAttribute("aria-expanded", "false");
                    submenuIcon.removeAttribute("style");
                }
            }
        });
    };

    subMenuToggle();
}

function modalToggle() {
    const modalOpenBtn = document.querySelector(".brand-usp__cta");
    const modalCloseBtn = document.querySelector(".modal__close");
    const modal = document.querySelector(".modal");

    modalOpenBtn.addEventListener("click", (e) => {
       modal.removeAttribute("hidden"); 
    });

    modalCloseBtn.addEventListener("click", (e) => {
        modal.setAttribute("hidden", "");
    });
}

function populateCryptoTable() {
    const cryptoTable = document.querySelector(".pre-load");
    const tHeadData = {
        1: "Name",
        2: "Price",
        3: "Change 24H",
        4: "Dynamic",
    }
    const cryptoData = fetch(`https://min-api.cryptocompare.com/data/top/totalvolfull?limit=23&tsym=USD&apikey=${key}`)
        .then((response) => {
            if(!response.ok) {
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
        .catch(err => {
            console.error(`${err.name} : ${err.message}`);
        })
}

function getCryptoOptions() {
    const cryptoData = fetch(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/map?limit=50&sort=cmc_rank&CMC_PRO_API_KEY=${otherKey}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            } else {
                return response.json();
            }
        })
        .then((data) => {
            const cryptoOptions = data["data"].map(el => createCryptoOption(el));
            populateSelectOptions(".convert-from__select", cryptoOptions);
        })
        .catch(err => {
            console.error(`${err.name}: ${err.message}: ${err.cause}`);
        });
}

function getFiatOptions() {
    const fiatData = fetch(`https://pro-api.coinmarketcap.com/v1/fiat/map?sort=name&CMC_PRO_API_KEY=${otherKey}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            } else {
                return response.json();
            }
        })
        .then((data) => {
            const fiatOptions = data["data"].map(el => createFiatOption(el));
            populateSelectOptions(".convert-to__select", fiatOptions);
        })
        .catch(err => {
            console.error(`${err.name}: ${err.message}: ${err.cause}`);
        });
}

init();