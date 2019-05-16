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
            updatedNoteContent: ""
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

    setContent(title) {
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
        this.setContent("New Note");
        this.titleRef.current.focus()
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
        let notes = this.state.notes;
        const index = notes.findIndex(note => note.id === this.state.activeNoteId);
        // const id = this.state.updatedNoteId;
        console.log(index);
        console.log(this.state.activeNoteId);
        // console.log(this.state.updatedNoteContent);
        // console.log(this.state.updatedNoteId);
        // console.log(this.state.updatedNoteTitle);

        const title = this.state.updatedNoteTitle;
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
    render() {
        return (
            <>
                <Container className="height100">
                    <Row>
                        <Col>
                            <Topnavbar
                                className="navbar"
                            />
                        </Col>
                    </Row>
                    <Row className="height100">
                        <Col lg={2} className="sidebar height100">
                            <Sidenavbar
                                notes={this.state.filteredNotes}
                                onClick={(title) => this.setContent(title)}
                                appendNote={(note) => this.appendNote(note)}
                                filterNotes={(event) => this.filterNotes(event)}
                                contentChanged={this.state.contentChanged}
                                saveNote={() => this.saveNote()}
                            />
                        </Col>
                        <Col lg={10} className="content height100">
                            <Container className="height100">
                                <Row className={this.state.activeNoteTitle ? "" : "hidden"}>
                                    <Col className="noteTitle">
                                        <input
                                            id="noteTitle"
                                            value={this.state.updatedNoteTitle}
                                            onChange={(event) => this.updateNote(event)}
                                            ref={this.titleRef}
                                        ></input>
                                    </Col>
                                </Row>
                                <Row className="height100">
                                <textarea
                                    id="noteContent"
                                    className="notes height100"
                                    value={this.state.updatedNoteContent}
                                    onChange={(event) => this.updateNote(event)}
                                >
                                </textarea>
                                </Row>
                            </Container>
                        </Col>
                    </Row>
                </Container>
            </>
        );
    }
}

export default Home;
