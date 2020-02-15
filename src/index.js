// Libraries.

import React, { Component } from "react";
import ReactDOM from "react-dom";

// Dependencies.
import "./Index/index.css";

// Components.


import Assets from "./Tool/Assets";
import Components from "./Tool/Components";
import DraggableComponent from "./Tool/DraggableComponent";
import Editor from "./Tool/Editor";
import Events from "./Tool/Events";
import History from "./Tool/History";
import Preview from "./Tool/Preview";

// Reducers.
import { updateEvent, updateConfig, saveElement, updateSelectedComponent } from "./Index/Reducer";

// Utils
import {readData, writeData} from "./utilities/localStorage";

class Index extends Component {
    constructor(props) {
        super(props);
        let components = readData("ui-editor") || [];
        let componentNames = components.map(component=>component.name);
        this.state = {
            components: components,
            selectedTag : "",
            component: {
                name: "",
                markup: "",
                style: "",
                state: "{ }",
                events: []
            },
            selectedComponent: "",
            folders: readData("folders") || [{
                type: "noFolder",
                contents: componentNames,
                name: ""
            }],
            showEditor: false
        }
        this.updateConfig = updateConfig.bind(this);
        this.updateEvent = updateEvent.bind(this);
        this.saveElement = saveElement.bind(this);
        this.updateSelectedComponent = updateSelectedComponent.bind(this);
    }

    updatePreview(element) {
        this.setState({
            previewComponent: element
        });
    }

    updateStyles(){
        this.setState({
            element: this.state.selectedComponent
        })
    }

    updateFolders(folders){
        this.setState({
            folders: folders
        })
        writeData("folders", folders)
    }

    openEditor(){
        this.setState({
            showEditor: true
        })
    }
    render() {
        const selectedComponent = this.state.selectedComponent || this.state.component;
        try {
            return (
                <div>
                    <DraggableComponent>
                        <Components
                            key={Math.ceil(Math.random() * 1000)}
                            components={this.state.components}
                            folders={this.state.folders}
                            selectedComponent={this.state.selectedComponent}
                            title="Components"

                                onOpenEditor={this.openEditor.bind(this)}
                                onSelection={this.updateSelectedComponent}
                                onFoldersUpdate={this.updateFolders.bind(this)}
                        />
                    </DraggableComponent>

                    <DraggableComponent>
                        <Assets                                 
                            title="Assets"
                        />
                    </DraggableComponent>
    
                    <DraggableComponent>
    
                        <Events
                            key={Math.ceil(Math.random() * 1000)}
                            component={selectedComponent}
                            selectedTag={this.state.selectedTag}
                            components={this.state.components}
                            onEventsUpdate={this.updateEvent}
                            onConfigUpdate={this.updateConfig}
                            title="Events"
                        />
    
                    </DraggableComponent>
    
                    {this.state.showEditor? 
                        <DraggableComponent>
                            <Editor
                                key={Math.ceil(Math.random() * 1000)}
                                element={selectedComponent}
                                name={selectedComponent.name}
                                markup={selectedComponent.markup}
                                style={selectedComponent.style}
                                state={selectedComponent.state}
                                title="Editor"
                                    onSave={this.saveElement}
                            />
                        </DraggableComponent>
                    : 
                    null}
    
                    <DraggableComponent>
                        <Preview 
                            key={Math.ceil(Math.random() * 1000)}
                            component={selectedComponent}
                            title="Preview"
                        />
                    </DraggableComponent>
    
                    <DraggableComponent>
                        <History
                            title="History"
                        />
                    </DraggableComponent>
    
                </div>
            );
        }
        catch(e){
            console.log(e);
            return (
                <DraggableComponent>
                    <History
                        name="History"
                    />
                </DraggableComponent>
            )
        }
        
    }
}


ReactDOM.render(<Index />, document.getElementById("index"));