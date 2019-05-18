import React, { Component } from "react";
import "./Home.css";
import Sidenavbar from "./components/Sidenavbar";
import Topnavbar from "./components/Topnavbar"
import Container from 'react-bootstrap/Container'
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner"
import {FormGroup, FormControl, FormLabel} from "react-bootstrap"
import LoaderButton from "./components/LoaderButton";

import { getAuthorizedNotes, getNotesByAuthor } from "../../backend/ops/elasticsearch";

const axios = require('axios');
const uuid = require('uuid/v4');
const xss = require('xss');

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
            "showDeleteModal": false,
            "showDeleteSpinner": false,
            authors: ""
        };
        this.titleRef = React.createRef();
    }


    async componentDidMount() {

        let ownedNotes = await getNotesByAuthor(this.props.cookies.get('current session'));
        let otherNotes = await getAuthorizedNotes(this.props.cookies.get('current session'));

        notes = ownedNotes.filter(elem => elem !== undefined);
        let authNotes = otherNotes.filter(elem => elem !== undefined);

        console.log('Using these to set state');
        console.log(notes);
        console.log(authNotes);

        if (notes.length > 0 && authNotes.length === 0) {
            this.setState({
                notes: notes,
                filteredNotes: notes
            })
        } else if (authNotes.length > 0 && notes.length === 0) {
            this.setState({
                notes: authNotes,
                filteredNotes: authNotes
            })
        } else if (authNotes.length > 0 && notes.length > 0) {
            this.setState({
                notes: notes.concat(authNotes),
                filteredNotes: notes.concat(authNotes)
            })
        } else {
            this.setState({
                notes: [],
                filteredNotes: []
            })
        }

        console.log('After set state');
        console.log(this.state.notes);
        // console.log(this.props.cookies.get('current session'));

    }

    setContent(title, focus) {
        let filtered = this.state.notes.filter(item => item.title == title);
        console.log(filtered);
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
        const title = xss(this.state.updatedNoteTitle, {
            whiteList: [],
            stripIgnoreTag: true,
            stripIgnoreTagBody: ['script']
        });

        let notes = this.state.notes;
        let filtered = notes.filter(note => note.title === title)
        if(filtered.length > 1) {
            alert("Error: duplicate note title");
            return
        }
        const index = notes.findIndex(note => note.id === this.state.activeNoteId);
        // const id = this.state.updatedNoteId;
        //console.log(this.state.updatedNoteContent);
        // console.log(index);
        // console.log(this.state.activeNoteId);
        // console.log(this.state.updatedNoteContent);
        // console.log(this.state.updatedNoteId);
        // console.log(this.state.updatedNoteTitle);

        const content = xss(this.state.updatedNoteContent, {
            whiteList: [],
            stripIgnoreTag: true,
            stripIgnoreTagBody: ['script']
        });

        const updatedNote = {
            "id": this.state.activeNoteId,
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
        const author = this.props.cookies.get('current session');

        if (isExistingNote.data === false) {
            await axios.get('http://localhost:5000/create', {
                        params: {
                            id: this.state.updatedNoteId,
                            title: this.state.updatedNoteTitle,
                            content: this.state.updatedNoteContent,
                            author: author
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
            "showDeleteModal": false,
            "showDeleteSpinner": false
        })
    }

    async addAuthors() {
        const cleanAuthor = xss(this.state.authors, {
            whiteList: [],
            stripIgnoreTag: true,
            stripIgnoreTagBody: ['script']
        });

        alert("Added " + cleanAuthor + " to " + this.state.updatedNoteTitle + '!');
        await axios.get('http://localhost:5000/update', {
            params: {
                id: this.state.updatedNoteId,
                title: this.state.updatedNoteTitle,
                content: this.state.updatedNoteContent,
                newAuthor: this.state.authors
            }
        });
    }

    async deleteNote() {
        this.setState({
            "showDeleteSpinner": true
        })
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



        const isExistingNote = await axios.get('http://localhost:5000/cache', {
            params: {
                id: updatedId,
                title: updatedTitle, 
                content: updatedContent
            }
        });

        console.log(isExistingNote);

        if (isExistingNote.data === false) {
            alert("Error Deleting Note: note doesn't exist. (Have you not saved it?)")
        } else {
            console.log("Deleting note: id:", updatedId, "title:", updatedTitle, "content:", updatedContent)
            await axios.get('http://localhost:5000/delete', {
                        params: {
                            id: updatedId,
                            title: updatedTitle, 
                            content: updatedContent
                        }
                    })
            console.log("after axios get")
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
        }
        this.closeDeleteModal()
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        })
    };

    validateShareSubmit() {
        return this.state.authors.length > 0;
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
                                <br/>
                                <form onSubmit={() => this.addAuthors()}>
                                    <Row className="add_authors">
                                        <Col md={2.5} className="justify-content-center">
                                            <FormLabel>Share this note with a friend!</FormLabel>
                                        </Col>
                                        <Col>
                                            <FormGroup controlId="authors">
                                                <FormControl
                                                    type="email"
                                                    placeholder="Enter an email to allow access"
                                                    onChange={this.handleChange}
                                                    />
                                            </FormGroup>
                                        </Col>
                                        <Col>
                                            <LoaderButton
                                                block
                                                disabled={!this.validateShareSubmit()}
                                                type="submit"
                                                text="Share"
                                            >
                                            </LoaderButton>
                                        </Col>
                                    </Row>
                                </form>
                            </Container>
                        </Col>
                    </Row>
                </Container>
                <Modal show={this.state.showDeleteModal} className="deleteModal">
                    <Modal.Body>
                        <p>Are you sure you want to delete "{this.state.activeNoteTitle}"?</p>
                    </Modal.Body>
                    <Spinner className={this.state.showDeleteSpinner ? "deleteModalSpinner" : "hidden"} animation="border"/>
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
