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
      uniqueID +=
        (visited.length === 1 ? ":" : "-") + ID_Components[randomIndex];
    }
  }
  return prefix ? uniqueID : uniqueID.substring(3);
};
