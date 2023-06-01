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
            <div className='inputArea'>
                <input className="searchInput" type='text' placeholder={searchInput} value={searchInput} onChange={onChange} />
                <button className="searchButton" onClick={() => { onClickSearch(searchInput)}}>
                    Search
                </button>
            </div>
            
            <div className="dropdownSuggestions">
                {
                    data
                        .filter( item => {
                            if (!searchInput) return 0;
                            console.log(item)
                            if (item.title.toLowerCase().startsWith(searchInput.toLowerCase()))
                            {
                                item.priority = 3;
                                return true;
                            } 
                            if (item.artist.toLowerCase().startsWith(searchInput.toLowerCase()))
                            {
                                item.priority = 2;
                                return true;
                            }
                            if (item.album.toLowerCase().startsWith(searchInput.toLowerCase()))
                            {
                                item.priority = 1;
                                return true;
                            }
                            return (false);
                        })

                        .sort((a, b) => a.priority - b.priority)
                        
                        .map ( (item) => (
                            <div onClick={() => {setSearchInput(item.title)}} className='dropdownSuggestion'>{item.title + ' - ' + item.artist}</div>
                        ))
                }
            </div>
        </div>
    )
}

export default SearchBox;