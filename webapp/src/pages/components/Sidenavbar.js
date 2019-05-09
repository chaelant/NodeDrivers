import React, { Component } from "react";
import "./Sidenavbar.css";
import ListGroup from "react-bootstrap/ListGroup";

class Sidenavbar extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        const newItems = this.props.items.map((item) => {
            return <ListGroup.Item 
                    action 
                    onClick={() => this.props.onClick(item.title)}
                    key={item.title.toString()}
                    >
                    {item.title}
                </ListGroup.Item>
        })
        return (
            <ListGroup>
                {newItems}
            </ListGroup>
        );
    }
}

function test() {
    console.log("Clicked!");
}

export default Sidenavbar;