const fs = require('fs');

// const book = {
//     title: 'Ego is ememy',
//     author: 'Parv'
// };

// const bookJSON = JSON.stringify(book);

// fs.writeFileSync('1-json.json',bookJSON);

const dataBuffer = fs.readFileSync('1-json.json');
const dataJSON = dataBuffer.toString();

const data = JSON.parse(dataJSON);
data.title = 'Haven and Paradise'
data.author = 'Sanjana'

fs.writeFileSync('1-json.json',JSON.stringify(data));
