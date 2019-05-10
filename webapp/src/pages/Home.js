import React, { Component } from "react";
import "./Home.css";
import Sidenavbar from "./components/Sidenavbar";
import Topnavbar from "./components/Topnavbar"
import Container from 'react-bootstrap/Container'
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

let notes = [
    {
        title: "John",
        content: "Insert something about John here"
    },
    {
        title: "Where does it come from?",
        content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum"
    },
    {
        title: "What does it do?",
        content: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like)."
    },
    {
        title: "Where does the moon live?",
        content: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc."
    }
]
class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            "content": undefined,
            contentChanged: false,
            notes: notes,
            filteredNotes: notes,
            activeNoteTitle: undefined,
            activeNoteContent: undefined,
            updatedNoteTitle: "",
            updatedNoteContent: ""
        }
        this.titleRef = React.createRef()
    }
    setContent(title) {
        let filtered = this.state.notes.filter(item => item.title == title)
        this.setState({
            activeNoteTitle: filtered[0].title,
            activeNoteContent: filtered[0].content,
            updatedNoteTitle: filtered[0].title,
            updatedNoteContent: filtered[0].content,
            contentChanged: false
        })
    }
    appendNote() {
        let note = {
            title: "New Note",
            content: ""
        }
        let notes = this.state.notes
        notes.push(note)
        this.setState({
            notes: notes,
            filteredNotes: notes
        })  
        this.setContent("New Note")
        this.titleRef.current.focus()
    }
    filterNotes(event) {
        const substring = event.target.value.toLocaleLowerCase()
        const filtered = this.state.notes.filter(function(item) {
            if(item.title.toLocaleLowerCase().indexOf(substring) != -1) {
                return item.title
            }
        })
        this.setState({
            filteredNotes: filtered
        })
    }
    saveNote() {
        let notes = this.state.notes
        const index = notes.findIndex(note => note.title === this.state.activeNoteTitle)
        const title = this.state.updatedNoteTitle
        const content = this.state.updatedNoteContent
        const updatedNote = {
            "title": title,
            "content": content
        }
        notes.splice(index, 1, updatedNote)
        this.setState({
            notes: notes,
            filteredNotes: notes,
            contentChanged: false
        })
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