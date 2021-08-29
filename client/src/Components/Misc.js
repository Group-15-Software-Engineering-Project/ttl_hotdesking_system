import { sha256 } from "js-sha256";

export const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
];

export const verify = (e) => {
    let a = sessionStorage.email;
    let b = sessionStorage.username;
    let date = new Date();
    let c = date.getFullYear() + date.getMonth() + date.getDate() + date.getDay();
    let token = sha256(a + c + process.env.REACT_APP_A + (e ? process.env.REACT_APP_B : "") + b);
    return token === sessionStorage.sessionToken;
};

export const getDifferenceInDays = (date1, date2) => {
    let d1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate(), 12, 0);
    let d2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate(), 12, 0);
    let diff = d1.getTime() - d2.getTime();
    diff = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return diff;
};

export const parseNumberList = (inputString) => {
    let list = inputString.replaceAll(" ", "");
    list = list.replaceAll(/-+/g, "-");
    list = list.replaceAll(/,+/g, ",");

    if ((list.match(/[^0-9,-]/giu) || []).length !== 0) return [];
    let divisions = list.split(",");
    let finalList = [];
    for (let number of divisions) {
        if (number.includes("-")) {
            let limit = number.split("-");
            if (limit.length !== 2) return [];
            for (let i = parseInt(limit[0]); i <= parseInt(limit[1]); i++) {
                if (finalList.indexOf(i) === -1) finalList.push(i);
            }
        } else {
            if (finalList.indexOf(parseInt(number)) === -1 && !isNaN(parseInt(number)))
                finalList.push(parseInt(number));
        }
    }
    return finalList;
};

export const createUniqueID = (idLength, prefix) => {
    let length;
    if (!idLength || idLength <= 0) length = 4;
    else length = idLength;
    let uniqueID = "ID";
    let ID_Components = [];
    for (let i = 0; i < length; i++) {
        let randomID = Math.random().toString(36).substring(3, 7);
        let p1 = randomID.charAt(0);
        let p2 = randomID.charAt(1);
        let p3 = randomID.charAt(2);
        let p4 = randomID.charAt(3);
        if (Math.floor(Math.random() * 100) % 2 === 1) p1 = p1.toUpperCase();
        if (Math.ceil(Math.random() * 100) % 2 === 1) p2 = p2.toUpperCase();
        if (Math.floor(Math.random() * 100) % 2 === 0) p3 = p3.toUpperCase();
        if (Math.ceil(Math.random() * 100) % 2 === 0) p4 = p4.toUpperCase();
        let arr = [p1, p2, p3, p4];
        let visited = [];
        let ID_String = "";
        while (visited.length < 4) {
            let randomIndex = Math.floor(Math.random() * 100) % 4;
            if (!visited.includes(randomIndex)) {
                ID_String += arr[randomIndex];
                visited.push(randomIndex);
            }
        }
        ID_Components.push(ID_String);
    }
    let visited = [];
    while (visited.length < length) {
        let randomIndex = Math.floor(Math.random() * length * 100) % length;
        if (!visited.includes(randomIndex)) {
            visited.push(randomIndex);
            uniqueID += (visited.length === 1 ? ":" : "-") + ID_Components[randomIndex];
        }
    }
    return prefix ? uniqueID : uniqueID.substring(3);
};
