import './searchBox.css'

import { useState } from "react";

const SearchBox = ({ data, onClickSearch }) => {

    const [searchInput, setSearchInput] = useState("");
    const [positionSelected, setPositionSelected] = useState(0);

    const onChange = (event) => {
        setSearchInput(event.target.value);
        console.log(event.target.value)
        console.log(searchInput);
    }

    const handleKeyDown = (event) => {
        console.log("Key", event.key)
        
            // When changing the input text, it might be that
            // the position selected is higher than the number of itens
        if (event.key === 'Enter') {
          // 👇 Get input value
          console.log("itensSelected", itensSelected);
          if (!itensSelected[0] || positionSelected == -1)
          {
            onClickSearch(searchInput)
            return;
          }
          console.log("Position selected", positionSelected)
          if (searchInput != itensSelected[positionSelected])
            setSearchInput(itensSelected[positionSelected].title + ' - ' + itensSelected[positionSelected].artist);
        }
        else if (event.key === 'ArrowDown')
        {
            console.log(itensSelected.length)
            if (positionSelected + 1 < itensSelected.length)
            {
                setPositionSelected(prev => prev + 1)   
                // console.log("Position", positionSelected)             
            }
        }
        else if (event.key === 'ArrowUp')
        {
            if (positionSelected > 0)
            {
                setPositionSelected(prev => prev - 1)
                // console.log("Position", positionSelected)
            }
        }
    }

    let itensSelected = [];
    

    return (
        <div className="searchContainer">
            <div className='inputArea'>
                <input className="searchInput" type='text' 
                placeholder={searchInput} 
                value={searchInput} 
                onChange={onChange}
                onKeyDown={handleKeyDown}
                 />
                <button className="searchButton" onClick={() => { onClickSearch(searchInput)}}>
                    Search
                </button>
            </div>
            
            <div className="dropdownSuggestions">
                {
                    data
                        .filter( item => {
                            if (!searchInput) return 0;
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
                        
                        // .map ( (item) => (
                        //     <div onClick={() => {setSearchInput(item.title)}} className='dropdownSuggestion'>{item.title + ' - ' + item.artist}</div>
                        // ))
                        // .map ( (item) => {
                        //     itensSelected.push(item);
                        //     return (
                        //         <div onClick={() => {setSearchInput(item.title)}} className='dropdownSuggestion'>{item.title + ' - ' + item.artist}</div>
                        //     )
                        // })
                        .map((element, index) => {
                            itensSelected.push(element);
                            return (
                                <div 
                                    key = {index}
                                    onClick={() => {setSearchInput(element.title + ' - ' + element.artist)}} 
                                    className= {positionSelected == index ? 'selected dropdownSuggestion' : 'dropdownSuggestion'}
                                >
                                    {element.title + ' - ' + element.artist}
                                </div>
                            )
                        })
                }
            </div>
        </div>
    )
}

export default SearchBox;