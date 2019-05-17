const axios = require('axios/index');
const esUrl = 'https://search-nodedrivers-final-tt6soi4ppisqo3prwkgbj4tvra.us-east-1.es.amazonaws.com/lambda-index/lambda-type/';

export async function getNotesByAuthor(author) {
    const allNotes = axios.get(esUrl + '_search')
        .then(res => {
            let noteData = [];
            let retrieved = res.data.hits.hits;
            for (let r in retrieved) {
                noteData.push(retrieved[r]._source)
            }
            return noteData;
        })
        .then(notes => {
            let noteList = [];
            for (let note in notes) {
                let noteData;
                if (notes[note].author.S === author)
                    noteData = {
                        id: notes[note].id.S,
                        title: notes[note].title.S,
                        content: notes[note].content.S
                    };
                    // console.log(noteData);
                    noteList.push(noteData)
            }
            //console.log(noteList[0]);
            console.log('From the byAuthor notes');
            console.log(noteList);
            return noteList;
        });

    return allNotes;
}

export async function getAuthorizedNotes(email) {
    const allNotes = axios.get(esUrl + '_search')
        .then(res => {
            let noteData = [];
            let retrieved = res.data.hits.hits;
            for (let r in retrieved) {
                noteData.push(retrieved[r]._source)
            }
            return noteData;
        })
        .then(notes => {
            let noteList = [];
            for (let note in notes) {
                // console.log(notes[note].accessGrantedTo.L[0]);

                let authNote = notes[note].accessGrantedTo.L.find(element => {
                    return element.S === email;
                });

                //console.log(authNote);

                if (authNote) {
                    let noteData = {
                        id: notes[note].id.S,
                        title: notes[note].title.S,
                        content: notes[note].content.S,
                        allowed: notes[note].accessGrantedTo.L
                    };
                    noteList.push(noteData)
                }

            }
            //console.log(noteList);
            return noteList;
        });

    return allNotes;
}

export async function getAllNotes() {
    const allNotes = axios.get(esUrl + '_search')
        .then(res => {
            let noteData = [];
            let retrieved = res.data.hits.hits;
            for (let r in retrieved) {
                noteData.push(retrieved[r]._source)
            }
            return noteData;
        })
        .then(notes => {
            let noteList = []
            for (let note in notes) {
                let noteData = {
                    id: notes[note].id.S,
                    title: notes[note].title.S,
                    content: notes[note].content.S
                };
                noteList.push(noteData)
            }
            return noteList;
        });

    return allNotes;
}
