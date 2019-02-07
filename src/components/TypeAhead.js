import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

// const ENTER_KEY = 13;
// const UP_ARROW = 38;
// const DOWN_ARROW = 40;

class TypeAhead extends Component {
    static propTypes = {
        config: PropTypes.shape({
            dataSrc: PropTypes.string.isRequired,
            caseSensitiveMatch: PropTypes.bool,
            autoComplete: PropTypes.string,
            placeHolder: PropTypes.string,
            spellCheck: PropTypes.string,
        }),
    }

    constructor(props) {
        super(props);
        this.state = {
            selectedSuggestion: 0,
            suggestionList: [],
            isSuggestionVisible: false,
            enteredValue: '',
        };
        this.handleChange = this.handleChange.bind(this);
    }

    fetchSuggestions(url, inputVal){
        fetch(this.props.config.dataSrc)
        .then(result => result.json())
        .then(listObj => {
            let suggestions = [];
            for(let item of listObj.list){
                if(this.props.config.caseSensitiveMatch){
                    if(item.toLowerCase().includes(inputVal.toLowerCase())){
                        suggestions.push(item);
                    }
                }else{
                    if(item.includes(inputVal)){
                        suggestions.push(item);
                    }
                }
            }
            if (suggestions.length === 0){
                suggestions.push('No matches found!!');
            }
            this.setState({ suggestionList: suggestions, selectedSuggestion: 0, isSuggestionVisible: true});
        })
        .catch(err => {
            console.log(err);
            this.setState({
                suggestionList: ['something went wrong!!'],
                selectedSuggestion: 0,
                isSuggestionVisible: true,
                // enteredValue: inputVal
            });
        });
    };

    handleChange = event => {
        this.setState({enteredValue: event.target.value});
        const inputValue = event.target.value;
        this.fetchSuggestions(`${this.props.config.dataSrc}?q=${inputValue}`, inputValue);
    };

    onClick = event => {
        this.setState({
            suggestionList: [],
            selectedSuggestion: 0,
            isSuggestionVisible: false,
            enteredValue: event.target.innerText,
        });
    };


    render() {
        let suggestionsListMarkup ;
        if(this.state.isSuggestionVisible && this.state.enteredValue){
            suggestionsListMarkup = (
                <ul className="suggestions">
                {this.state.suggestionList.map((suggestion, index) => {
                    let className;

                    if (index === this.state.selectedSuggestion) {
                        className = "suggestion-active";
                    }

                    return (
                        <li
                        className={className}
                        key={suggestion}
                        onClick={this.onClick}
                        >
                        {suggestion}
                        </li>
                    );
                })}
                </ul>
            );
        }
        return (
            <Fragment>
                <input
                    type="text"
                    onChange={this.handleChange}
                    value={this.state.enteredValue}
                    autoComplete={this.props.config.autoComplete}
                    placeholder={this.props.config.placeHolder}
                    spellCheck={this.props.config.spellCheck}
                />
                {suggestionsListMarkup}
            </Fragment>
        );
    }
}


export default TypeAhead;
