function createComponent(component){

    let componentString = convertToReactcomponent(component);

    // eval does not evaluate class if not exclosed in paranthesis.
    return eval(Babel.transform(componentString, { presets: ['react'], plugins: ["transform-es2015-classes"]  }).code)
}


// Elements to  react component.
function convertToReactcomponent (component){

    let markup = "markup";

    component.events.forEach(event=>{
        event.id = event.id.replace("-","");
    })

    let addProps= (component)=>{
        return component[markup].replace(">",` {...this.props}>{this.props.children}`)
    }

    let getComponentEventedMarkup = (markup, events)=>{
        events.forEach(event=>{
            let id = `id="${event.id}"`;
            // check if markup contains the id.
            if(markup.includes(id)){
                markup = markup.replace(id, `${id} ${event.name}={this.${event.id+event.name}.bind(this)}`);
            }
            // its a child component.
            else{
                markup = markup.replace(`<${event.id}`,`<${event.id} ${event.name}={this.${event.id+event.name}.bind(this)}`)
            }
                
        });
    
        return markup.split("{state.").join("{this.state.")
    }

    // checks if state override is on. then adds state prop to child 
    let getStatedMarkup = (markup)=>{
        // for all the config.
        // filter child with overide state is true
        let config = JSON.parse(component.config);
        let childrenConfig = Object.keys(config);
        childrenConfig.forEach(childName=>{

            // PRECAUTION : Edit markup only for showHideProp
            if(config[childName].showHideProp && !config[childName].override){
                let childMarkup = `<${childName}></${childName}>`;
                let showHideChild = `{this.state.${config[childName].showHideProp} ? ${childMarkup}: null}`
                if(markup.includes(childMarkup)){
                    markup = markup.replace(childMarkup, showHideChild)
                }
            }

            // PRECAUTION: Edit markup only for override
            if(config[childName].override && !config[childName].showHideProp){
                markup = markup.replace(childName, childName+` state={this.state.${childName}}`)
            }

            // PRECAUTION: Edit markup for both changes.
            if(config[childName].showHideProp && config[childName].override){

                //1. show or hide
                let childMarkup = `<${childName}></${childName}>`;
                let showHideChild = `this.state.${showHideChild} ? ${childMarkup}: null`
                if(markup.includes(childMarkup)){
                    markup = markup.replace(childMarkup, showHideChild)
                }

                //2. override state.
                markup = markup.replace(childName, childName+` state={this.state.${childName}}`)

            }

            // PRECAUTION: Edit markup for rendering list. Should not use other configuration while using this.
            if(config[childName].renderListProp && !config[childName].override && !config[childName].showHideChild){
                let childMarkup = `<${childName}></${childName}>`;

                let childMarkupWithProps = `<${childName} state={item} key={i}></${childName}>`;
                let renderListMarkup = `{this.state.${config[childName].renderListProp}.map((item,i)=>${childMarkupWithProps})}`;

                markup =  markup.replace(childMarkup, renderListMarkup);   
            }
        })
        return markup;
    }
    
    let propsInMarkup = addProps(component);
    let stateOverideMarkup = getStatedMarkup(propsInMarkup);
    let componentEventedMarkup = getComponentEventedMarkup(stateOverideMarkup, component.events);

    let ReactComponent = 
    `(
        class ${component.name} extends Component {
        
            constructor(props) {
                super(props);
                this.state = this.props.state || ${component.state};
            }
        
            ${component.events.map(event=>{
                if(event.publishable){
                    return `
                    
                    ${event.id+event.name} (e) {
                        var state = JSON.parse(JSON.stringify(this.state))
                        ${event.reducer}
                        this.setState(state);
                        e.state = state;
                        this.props.${event.publishName}? this.props.${event.publishName}(e):null;
                    }
                    
                    `
                }
        
                return `
                    ${event.id+event.name} (e) {
                        var state = JSON.parse(JSON.stringify(this.state))
                        ${event.reducer}
                        this.setState(state);
                    }
                `
            }).join("\n")}
        
            render() {
                return (${componentEventedMarkup})
            }
        })
        `
    return ReactComponent;
}

module.exports = {
    createComponent,
    convertToReactcomponent
}