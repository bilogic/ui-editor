// Libraries.

import React, { Component } from "react";
import ReactDOM from "react-dom";


// Components.

import Events from "./Events";
import DynamicComponent from "./DynamicComponent";

import Markup from './Markup';
import Style from  "./Style";
import State from "./State";




// Constants

class Index extends Component {
    constructor(props) {
        super(props);
        let components = [];
        this.state = {
            components: components,
            selectedTag: "",
            component: {
                name: "",
                markup: "",
                style: "",
                state: "{ }",
                events: []
            },
            selectedComponent: "",
            selectedTab: "Events"
        }
        this.updateConfig = updateConfig.bind(this);

    }


    render() {
        const selectedComponent = this.state.selectedComponent || this.state.component;
        const randomKey = Math.ceil(Math.random() * 1000);
        return (
            <div>
                <Markup markup={selectedComponent.markup} key={randomKey}></Markup>
                <Style style={selectedComponent.style} key={randomKey}></Style>
                <State state={selectedComponent.state} key={randomKey}></State>
                <DynamicComponent onSave={this.props.onSave} key={randomKey} component={selectedComponent}/>

                <Events
                    key={randomKey}
                    component={selectedComponent}
                    selectedTag={this.state.selectedTag}
                    components={this.state.components}
                    title="Events"
                />
            </div>
        );
    }
}
console.log("Source code https://github.com/imvetri/ui-editor")
ReactDOM.render(<Index />, document.getElementById("index"));