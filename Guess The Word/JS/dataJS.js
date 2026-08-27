const response = await fetch("../JS/dataJSON.json");
const dataSet = await response.json();

const levels = {
    A1: new Set(dataSet.A1.filter(word => word.length > 2 && word.length < 11)),
    A2: new Set(dataSet.A2.filter(word => word.length > 2 && word.length < 11)),
    B1: new Set(dataSet.B1.filter(word => word.length > 2 && word.length < 11)),
    B2: new Set(dataSet.B2.filter(word => word.length > 2 && word.length < 11))
};

export { levels };