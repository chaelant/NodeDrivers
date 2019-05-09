import React, { Component } from "react";
import "./Home.css";
import Sidenavbar from "./components/Sidenavbar";
import Topnavbar from "./components/Topnavbar"
import Container from 'react-bootstrap/Container'
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"

const items = [
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
            contentChanged: true
        }
        this.topnavbarElement = React.createRef()
    }
    setContent(title) {
        let filtered = items.filter(item => item.title == title)
        let textarea = document.getElementById("textContent")
        textarea.value = filtered[0].content
        this.topnavbarElement.current.disableSaveStatus()
    }
    enableSave() {
        this.topnavbarElement.current.enableSaveStatus()
    }
    render() {
        return (
            <Container>
                <Row>
                    <Col>
                        <Topnavbar 
                            className="navbar"
                            contentChanged={this.state.contentChanged}
                            ref={this.topnavbarElement}
                        />
                    </Col>    
                </Row>
                <Row>
                    <Col lg={2} className="sidebar">
                        <Sidenavbar 
                            items={items} 
                            onClick={(title) => this.setContent(title)}
                        />
                    </Col>
                    <Col lg={10} className="content">
                        <textarea 
                            id="textContent" 
                            className="notes"
                            onChange={() => this.enableSave()}
                            >
                        </textarea>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default Home;