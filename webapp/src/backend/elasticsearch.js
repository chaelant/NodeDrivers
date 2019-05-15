const axios = require('axios/index');
const esUrl = 'https://search-nodedrivers-notes-n7nguaedqxlyl4hwh6x3t476yu.us-east-1.es.amazonaws.com/lambda-index/lambda-type/';

// exportedMethods = {
//
//     async getNote(id) {
//         const note = axios.get(esUrl + id)
//             .then(res => {
//                 let retrieved = res.data._source;
//                 let data = {
//                     id: retrieved.id.S,
//                     title: retrieved.title.S,
//                     content: retrieved.content.S
//                 };
//                 return data;
//             });
//
//         return note;
//     },
//
//     async getAllNotes() {
//         const allNotes = axios.get(esUrl + '_search')
//             .then(res => {
//                 let noteData = [];
//                 let retrieved = res.data.hits.hits;
//                 for (let r in retrieved) {
//                     noteData.push(retrieved[r]._source)
//                 }
//                 return noteData;
//             })
//             .then(notes => {
//                 let noteList = []
//                 for (let note in notes) {
//                     let noteData = {
//                         id: notes[note].id.S,
//                         title: notes[note].title.S,
//                         content: notes[note].content.S
//                     };
//                     noteList.push(noteData)
//                 }
//                 return noteList;
//             });
//
//         return allNotes;
//     }
// };
//
// module.exports = exportedMethods;

export async function getNote(id) {
    const note = axios.get(esUrl + id)
        .then(res => {
            let retrieved = res.data._source;
            let data = {
                id: retrieved.id.S,
                title: retrieved.title.S,
                content: retrieved.content.S
            };
            return data;
        });

    return note;
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
