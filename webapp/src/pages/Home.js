import React, { Component } from "react";
import "./Home.css";
import Sidenavbar from "./components/Sidenavbar";
import Topnavbar from "./components/Topnavbar"
import Container from 'react-bootstrap/Container'
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import { getAllNotes } from "../../backend/ops/elasticsearch";

const axios = require('axios');
const uuid = require('uuid/v4');

// console.log(notes);
let notes = [];

class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            "content": undefined,
            contentChanged: false,
            notes: notes,
            filteredNotes: notes,
            activeNoteId: undefined,
            activeNoteContent: undefined,
            activeNoteTitle: undefined,
            updatedNoteId: "",
            updatedNoteTitle: "",
            updatedNoteContent: "",
            "showDeleteModal": false
        };

        this.titleRef = React.createRef()
    }

    async componentDidMount() {

        notes = await getAllNotes();
        this.setState({
            notes: notes,
            filteredNotes: notes
        });

        //console.log(notes);

    }

    setContent(title, focus) {
        let filtered = this.state.notes.filter(item => item.title == title);
        // console.log(filtered);
        this.setState({
            activeNoteId: filtered[0].id,
            activeNoteTitle: filtered[0].title,
            activeNoteContent: filtered[0].content,
            updatedNoteId: filtered[0].id,
            updatedNoteTitle: filtered[0].title,
            updatedNoteContent: filtered[0].content,
            contentChanged: false
        }, () => {
            if(focus) {
                this.titleRef.current.focus()
            }
        })
    }

    appendNote() {
        let note = {
            id: uuid(),
            title: "New Note",
            content: ""
        };
        let notes = this.state.notes;
        notes.push(note);
        this.setState({
            notes: notes,
            filteredNotes: notes
        });
        this.setContent("New Note", true);
    }

    filterNotes(event) {
        const substring = event.target.value.toLocaleLowerCase();
        const filtered = this.state.notes.filter(function(item) {
            if(item.title.toLocaleLowerCase().indexOf(substring) != -1) {
                return item.title
            }
        });
        this.setState({
            filteredNotes: filtered
        })
    }
    async saveNote() {
        const title = this.state.updatedNoteTitle;
        let notes = this.state.notes;
        let filtered = notes.filter(note => note.title === title)
        if(filtered.length > 1) {
            alert("Error: duplicate note title")
            return
        }
        const index = notes.findIndex(note => note.id === this.state.activeNoteId);
        // const id = this.state.updatedNoteId;
        console.log(index);
        console.log(this.state.activeNoteId);
        // console.log(this.state.updatedNoteContent);
        // console.log(this.state.updatedNoteId);
        // console.log(this.state.updatedNoteTitle);

        const content = this.state.updatedNoteContent;
        const updatedNote = {
            "title": title,
            "content": content
        };
        console.log(updatedNote);
        notes.splice(index, 1, updatedNote);
        this.setState({
            notes: notes,
            filteredNotes: notes,
            contentChanged: false
        });

        const isExistingNote = await axios.get('http://localhost:5000/cache', {
            params: {
                id: this.state.updatedNoteId,
                title: this.state.updateNoteTitle,
                content:this.state.updateNoteContent
            }
        });


        console.log(isExistingNote);

        if (isExistingNote.data === false) {
            await axios.get('http://localhost:5000/create', {
                        params: {
                            id: this.state.updatedNoteId,
                            title: this.state.updatedNoteTitle,
                            content: this.state.updatedNoteContent
                        }
                    });
        } else {
            await axios.get('http://localhost:5000/update', {
                        params: {
                            id: this.state.updatedNoteId,
                            title: this.state.updatedNoteTitle,
                            content: this.state.updatedNoteContent
                        }
                    });
        }


    }
    updateNote(event) {
        // console.log("id:", event.target.id)
        // console.log("value:", event.target.value)
        if(event.target.id === "noteTitle") {
            this.setState({
                updatedNoteTitle: event.target.value
            })
        } else if(event.target.id === "noteContent") {
            this.setState({
                updatedNoteContent: event.target.value
            })
        } else {
            return
        }
        this.setState({
            contentChanged: true
        })
    }
    showDeleteModal() {
        this.setState({
            "showDeleteModal": true
        })
    }
    closeDeleteModal() {
        this.setState({
            "showDeleteModal": false
        })
    }
    async deleteNote() {
        let notes = this.state.notes;
        const index = notes.findIndex(note => note.id === this.state.activeNoteId);
        if(index == -1) {
            this.closeDeleteModal()
            alert("Error: Note not found")
            return
        }
        notes.splice(index, 1);
        const updatedId = this.state.updatedNoteId
        const updatedTitle = this.state.updatedNoteTitle
        const updatedContent = this.state.updatedNoteContent

        this.setState({
            notes: notes,
            filteredNotes: notes,
            contentChanged: false,
            activeNoteId: undefined,
            activeNoteContent: undefined,
            activeNoteTitle: undefined,
            updatedNoteId: "",
            updatedNoteTitle: "",
            updatedNoteContent: ""
        });
        this.closeDeleteModal()

        const isExistingNote = await axios.get('http://localhost:5000/cache', {
            params: {
                id: updatedId,
                title: updatedTitle, 
                content: updatedContent
            }
        });

        console.log(isExistingNote);

        if (isExistingNote.data === false) {
            alert("Error Deleting Note: note doesn't exist")
        } else {
            console.log("Deleting note: id:", updatedId, "title:", updatedTitle, "content:", updatedContent)
            await axios.get('http://localhost:5000/delete', {
                        params: {
                            id: updatedId,
                            title: updatedTitle, 
                            content: updatedContent
                        }
                    });
        }
            
    }
    render() {
        return (
            <>
                <Container>
                    <Row>
                        <Col lg={2} className="sidebar">
                            <Sidenavbar
                                notes={this.state.filteredNotes}
                                onClick={(title) => this.setContent(title)}
                                appendNote={(note) => this.appendNote(note)}
                                filterNotes={(event) => this.filterNotes(event)}
                                contentChanged={this.state.contentChanged}
                                saveNote={async () => this.saveNote()}
                            />
                        </Col>
                        <Col lg={10} className="content">
                            <Container className={this.state.activeNoteTitle ? "" : "hidden"}>
                                <Row> 
                                    <Col className="noteTitle" md={11}>
                                        <input
                                            id="noteTitle"
                                            value={this.state.updatedNoteTitle}
                                            onChange={(event) => this.updateNote(event)}
                                            ref={this.titleRef}
                                        ></input>
                                    </Col>
                                    <Col md={1}>
                                        <Button className="delete" 
                                                variant="outline-danger"
                                                onClick={() => this.showDeleteModal()}
                                                >
                                                Delete
                                        </Button>
                                    </Col>
                                </Row>
                                <Row>
                                    <textarea
                                        id="noteContent"
                                        className="notes"
                                        value={this.state.updatedNoteContent}
                                        onChange={(event) => this.updateNote(event)}
                                    >
                                </textarea>
                                </Row>
                            </Container>
                        </Col>
                    </Row>
                </Container>
                <Modal show={this.state.showDeleteModal} className="deleteModal">
                    <Modal.Body>
                        <p>Are you sure you want to delete "{this.state.activeNoteTitle}"?</p>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="outline-secondary" onClick={() => this.closeDeleteModal()}>Cancel</Button>
                        <Button variant="outline-danger" onClick={async () => this.deleteNote()}>Delete</Button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }
}

export default Home;
