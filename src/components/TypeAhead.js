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
            this.setState({ suggestionList: suggestions, selectedSuggestion: 0, isSuggestionVisible: true, enteredValue: inputVal });
        })
        .catch(err => {
            console.log(err);
            return ['something went wrong!!'];
        });
    };

    onChange = event => {
        const inputValue = event.currentTarget.value;
        this.fetchSuggestions(`${this.props.config.dataSrc}?q=${inputValue}`, inputValue);
    };

    onClick = event => {
        this.setState({
            suggestionList: [],
            selectedSuggestion: 0,
            isSuggestionVisible: false,
            enteredValue: event.currentTarget.innerText,
        });
    };


    render() {
        let suggestionsListMarkup ;
        if(this.state.isSuggestionVisible && this.state.enteredValue){
            suggestionsListMarkup = (
                <ul className="suggestions">
                {this.state.suggestionList.map((suggestion, index) => {
                    let className;

                    // Flag the active suggestion with a class
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
                    onChange={this.onChange}
                    value={this.state.enteredValue}
                    autoComplete={this.props.config.autoComplete}
                />
                {suggestionsListMarkup}
            </Fragment>
        );
    }
}


export default TypeAhead;
