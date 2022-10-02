export const key = "b85b854a8ef386ecc096058169e05968cf95b434051bc3671b59dd6a4155ba2a";

export function populateTableHead(data) {
    const thead = document.createElement("thead");
    thead.classList.add("crypto-table-head");
    const theadRow = document.createElement("tr");

    for(let key in data) {
        const theadData = document.createElement("th");
        theadData.textContent = `${data[key]}`;
        theadRow.appendChild(theadData);
    }

    thead.appendChild(theadRow);
    return thead;
}

export function populateTableBody(dataArray) {
    const tbody = document.createElement("tbody");
    tbody.classList.add("crypto-table-body");
    
    for(let i = 0; i < dataArray.length; i++ ) {
        const tbodyRow = document.createElement("tr");
        tbodyRow.classList.add("crypto");
        const colOneData = populateColOne(dataArray[i]["CoinInfo"]);
        const colTwoData = populateColTwo(dataArray[i]["DISPLAY"]["USD"]);
        const colThreeData = populateColThree(dataArray[i]["RAW"]["USD"]);
        const colFourData = populateColFour(dataArray[i]["RAW"]["USD"]);

        tbodyRow.append(colOneData, colTwoData, colThreeData, colFourData);
        tbody.appendChild(tbodyRow);
    }

    return tbody;
}

function populateColOne(coldata) {
    const colOne = document.createElement("td");
    const cryptoIcon = document.createElement("img"); 
    const cryptoAbbr = document.createElement("p");
    const cryptoName = document.createElement("span");

    cryptoIcon.classList.add("crypto__icon");
    cryptoAbbr.classList.add("crypto__abbr");
    cryptoName.classList.add("crypto__name");

    cryptoIcon.src = `${"https://www.cryptocompare.com"}${coldata["ImageUrl"]}`;
    cryptoAbbr.textContent = coldata["Name"];
    cryptoName.textContent = ` (${coldata["FullName"]})`;

    cryptoAbbr.appendChild(cryptoName);
    colOne.append(cryptoIcon, cryptoAbbr);

    return colOne;
}

function populateColTwo(coldata) {
    const colTwo = document.createElement("td");
    colTwo.textContent = `${coldata["PRICE"]}`;
    return colTwo;
}

function populateColThree(coldata) {
    const colThree = document.createElement("td");
    const cryptoChange = document.createElement("div");
    const changePct = document.createElement("span");
    const changeDir = document.createElement("span");
    changePct.classList.add("crypto__change__percent");
    const changePctString = (coldata["CHANGEPCTDAY"]).toFixed(2);

    if(changePctString.substring(0, 1) === "-") {
        cryptoChange.classList.add("crypto__change--bear");
        changeDir.classList.add("crypto__change__arrow--bear");

        changePct.textContent = `${formatNegString(changePctString)}`;

    } else {
        cryptoChange.classList.add("crypto__change--bull");
        changeDir.classList.add("crypto__change__arrow--bull");
        
        changePct.textContent = `${formatPosString(changePctString)}`;
    }

    cryptoChange.append(changePct, changeDir);
    colThree.appendChild(cryptoChange);
    return colThree;
}

function populateColFour(coldata) {
    const colFour = document.createElement("td");
    const cryptoDynamic = document.createElement("div");
    const changePctString = (coldata["CHANGEPCTDAY"]).toFixed(2);

    if(changePctString.substring(0, 1) === "-") {
        cryptoDynamic.classList.add("crypto__dynamic--bear");
    } else {
        cryptoDynamic.classList.add("crypto__dynamic--bull");
    }

    colFour.appendChild(cryptoDynamic);
    return colFour;
}


function formatPosString(aString) {
    return aString = ("+" + aString + "%");
}

function formatNegString(aString) {
    return aString = (aString + "%");
}
