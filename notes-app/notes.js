const fs = require('fs');
const chalk = require("chalk")

const addNotes = (title,body) => {
    const notes = loadNotes();
    const duplicateNotes = notes.find((note) => note.title === title );
    if (!duplicateNotes ){
        notes.push({
            title: title,
            body: body
        });
        saveNotes(notes);
        console.log('New Note added!');
    } else {
        console.log('Title is already taken!');
    }
}

const loadNotes = () => {
    try{
        const dataBuffer = fs.readFileSync('notes.json');
        const dataJSON = dataBuffer.toString();
        return JSON.parse(dataJSON);
    } catch(e) {
        return [];
    }
}

const saveNotes = (notes) => {
    const dataJSON = JSON.stringify(notes);
    fs.writeFileSync('notes.json',dataJSON);
}

const removeNotes = (title) => {
    const notes = loadNotes();
    const notesToKeep = notes.filter((note) => note.title !== title);
    saveNotes(notesToKeep);
    if (notes.length === notesToKeep.length){
        console.log(chalk.bgRed.bold('Title Not Present, Note Not Removed!!'));
    } else {
        console.log(chalk.bgGreen.bold('Note removed successfully!'))
    }
}

const listNotes = () => {
    console.log(chalk.blue.bold('Your notes-'));
    const notes = loadNotes();
    notes.forEach((note) => {
        console.log(note.title);
    });
}

const readNotes = (title) => {
    const notes = loadNotes();
    const note = notes.find((note) => note.title === title); 
    if (note){
        console.log(chalk.bgYellow.inverse.bold(note.title));
        console.log(note.body);
    } else{
        console.log(chalk.red.bold("TITLE NOT FOUND"));
    }
}

module.exports = {
    addNotes: addNotes,
    removeNotes: removeNotes,
    listNotes: listNotes,
    readNotes: readNotes
}