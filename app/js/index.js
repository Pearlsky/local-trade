import {key, populateTableHead, populateTableBody} from "./populate-td.js";

function init() {
    navToggle();
    populateCryptoTable();
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

function populateCryptoTable() {
    const cryptoTable = document.querySelector(".pre-load");
    const tHeadData = {
        1: "Name",
        2: "Price",
        3: "Change 24H",
        4: "Dynamic",
    }
    const cryptoData = fetch(`https://min-api.cryptocompare.com/data/top/totalvolfull?limit=25&tsym=USD&apikey=${key}`)
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

init();