import './searchBox.css'

import { useState } from "react";

const SearchBox = ({ data, onClickSearch }) => {

    const [searchInput, setSearchInput] = useState("");

    const onChange = (event) => {
        setSearchInput(event.target.value);
        console.log(event.target.value)
        console.log(searchInput);
    }

    return (
        <div className="searchContainer">
            {/* <div className='InputArea'> */}
                <input className="searchInput" type='text' placeholder={searchInput} value={searchInput} onChange={onChange} />
                <button className="searchButton" onClick={onClickSearch}>
                    Search
                </button>
            {/* </div> */}
            
            <div className="dropdownSuggestions">
                {
                    data.filter( item => {
                        item = item.toLowerCase();
                        console.log(item)
                        return (searchInput && item.startsWith(searchInput.toLowerCase()))
                        })
                        .map ( (item) => (
                            <div onClick={() => {setSearchInput(item)}} className='dropdownSuggestions'>{item}</div>
                        ))
                }
            </div>
        </div>
    )
}

export default SearchBox;