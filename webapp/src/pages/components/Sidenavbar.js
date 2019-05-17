import React, { Component } from "react";
import "./Sidenavbar.css";
import ListGroup from "react-bootstrap/ListGroup";
import ButtonToolbar from "react-bootstrap/ButtonToolbar"
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";

class Sidenavbar extends Component {
    constructor(props) {
        super(props)
        console.log("Sidenavbar")
    }
    render() {
        return (
            <ListGroup>
                <ListGroup.Item className="buttonItem">
                    <ButtonToolbar className="buttonToolbar">
                        <Button className="new" variant="outline-dark" onClick={() => this.props.appendNote()}>New</Button>
                        <Button className={this.props.contentChanged ? "save" : "hidden"}
                                variant="outline-success"
                                onClick={() => this.props.saveNote()}
                        >
                            Save
                        </Button>
                    </ButtonToolbar>
                    <InputGroup className="search">
                        <FormControl
                            placeholder="Search..."
                            aria-label="Search..."
                            aria-describedby="basic-addon1"
                            onChange={(event) => this.props.filterNotes(event)}
                        />
                    </InputGroup>
                </ListGroup.Item>
                {this.props.notes.map((item, index) => {
                    if (item !== undefined) {
                        return <ListGroup.Item
                            action
                            onClick={() => this.props.onClick(item.title)}
                            key={index}
                        >
                            {item.title}
                        </ListGroup.Item>
                    }
                })}
            </ListGroup>
        );
    }
}

function test() {
    console.log("Clicked!");
}

export default Sidenavbar;
