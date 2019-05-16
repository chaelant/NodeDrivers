const axios = require('axios/index');
const esUrl = 'https://search-nodedrivers-notes-n7nguaedqxlyl4hwh6x3t476yu.us-east-1.es.amazonaws.com/lambda-index/lambda-type/';

exportedMethods = {

    async getAllNotes() {
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
};

module.exports = exportedMethods;
