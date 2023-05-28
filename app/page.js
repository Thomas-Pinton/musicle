"use client"

import './styles.css';

import Player from './player.js'
import SearchBox from './searchBox.js'
import axios from 'axios';

import React, {useEffect, useState, useRef} from 'react';
//import menu from './images/menu.png'
import menu from 'C:/Users/thoma/OneDrive/Documentos/Codes/HeardleClone/heardle_clone/app/images/menu.png'
import account from './images/account.png'

let menuUrl = 'https://cdn-icons-png.flaticon.com/512/7216/7216128.png';
let accountUrl = 'https://cdn-icons-png.flaticon.com/512/61/61205.png';

let musica1 = 'https://file.notion.so/f/s/ceb26cb9-9dcd-4f09-b34d-337fdf833c00/Counting_Stars.mp3?id=1186b948-bf25-4438-8b8e-552fb0d660ca&table=block&spaceId=09cc515c-e3ac-4443-8f45-cc119ad130bd&expirationTimestamp=1683514648561&signature=rdohdrs_ihND7xJaF9athkAe6OQHZ5qkyu5z08JM0kA';

let wikipediaMusic = 'https://upload.wikimedia.org/wikipedia/pt/8/8e/I_want_you.ogg';

const getSong = async () => {
  return new Promise ( async (resolve) => {
    try {
      const response = await axios.get('http://localhost:4000/')
      console.log(response.data)
      resolve (response.data);
      return;
    } catch (error) {
      console.error('Error fetching data:', error);
      resolve();
    }
  })
}

const getSongs = async () => {
  return new Promise ( async (resolve) => {
    try {
      const response = await axios.get('http://localhost:4000/allSongs');
      console.log(response.data[0]);
      console.log(response.data[3]);
      resolve (response.data);
      return;
    } catch (error) {
      console.log("Error: ", error);
      resolve();
    }
  })
}

function Attempt ({ text })
{
  const changeText = (newText) => {
    text = newText;
  }
  return (
    <div className='attempt'>
      <p className='attempt_text'>{text}</p>
    </div>
  )
}

function Time ({ w }) 
{
  return (
    <div className='time' style={{width: w}}>
    </div>
  )
}

export default function App ()
{
  const [song, setSong] = useState({
    id: 'Teste',
    src: wikipediaMusic,
  })

  const [data, setData] = useState([])
  // let data = []

  const [dataFetched, setDataFetched] = useState(false);
  const [songsFetched, setSongsFetched] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [timeBar, setTimeBar] = useState(0);

  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    console.log(song.src)
    console.log("Using effect!")
    getSong().then( (dataFromGetSong) => {
      console.log("Data from get song", dataFromGetSong)
      setSong({id: dataFromGetSong.id, src: dataFromGetSong.src})
      setDataFetched(true);
      // setAudio(dataFromGetSong.src)
    })
    getSongs().then( (response) => {
      // const songs = response.map((song, index) => ({ key: index.toString(), value: song }));
      setData(response)
      console.log("Data (tem que vir antes)", data)
      setSongsFetched(true);
    })
  }, []);

  useEffect( () => {
    if (timeBar < 70 && playing)
    {
      setTimeout(() => setTimeBar(prev => prev += 1), 43);
      console.log("valor", timeBar)
    }
    if (timeBar == 70)
    {
      setPlaying(false);
    }
  }, [timeBar, playing])

  const handleClick = () => {
    if(!playing)
    {
      setTimeBar(0);
    }
    setPlaying(!playing);
  }

  const [texts, setTexts] = useState([]);

  function handleSearch(songAttempt) {
    if (attempt > 4)
      return;

    console.log("Data song ida", song.id)
    console.log("Data song id", data[song.id])
    console.log("Handling search")

    const updatedItems = [...texts];

    if (data[song.id] != songAttempt)
      updatedItems[attempt] = "❌ " + songAttempt;
    else
      updatedItems[attempt] = "✅ " + songAttempt;

    setTexts(updatedItems);
    setAttempt(prev => prev += 1);
  }

  return (
    <div>
      {dataFetched && songsFetched && (
        <>
          <div className='top'>
            <img
              src={menuUrl}
              alt={'Dropdown menu'}
              className='menu'
            />
            <h1 className="heardle">Heardle Clone</h1>
            <img
              src={accountUrl}
              alt={'Account'}
              className='account'
            />
          </div>
          
          <div className='attempt_wrapper'>
            <Attempt text={texts[0]} />
            <Attempt text={texts[1]} />
            <Attempt text={texts[2]} />
            <Attempt text={texts[3]} />
            <Attempt text={texts[4]} />
          </div> 

          <div className='time_wrapper'>
            <Time w={70}/>
            <Time w={140}/>
            <Time w={280}/>
            <Time w={560}/>
          </div>
          <div className='timeFill' style={{width: timeBar}}>

          </div>

          <div className='play_wrapper'>
            {console.log("page.js", song.src, dataFetched)}
            <Player url={song.src} onClickPlay={handleClick}>
            </Player>
          </div>
          {console.log("data (tem que vir depois)", data)}
          <SearchBox data={data} onClickSearch={handleSearch}>

          </SearchBox>
        </>
      )}
    </div>
  );
}