"use client"

import './styles.css';
import './endGame.css';

import Player from './player.js'
import SearchBox from './searchBox.js'
import Modal from './popUp.js'
import DataPage from './dataPage.js';

import axios from 'axios';

import React, {useEffect, useState} from 'react';
//import menu from './images/menu.png'
// import menu from 'C:/Users/thoma/OneDrive/Documentos/Codes/HeardleClone/heardle_clone/app/images/menu.png'
// import account from './images/account.png'

let menuUrl = 'https://cdn-icons-png.flaticon.com/512/7216/7216128.png';
let accountUrl = 'https://cdn-icons-png.flaticon.com/512/61/61205.png';

let musica1 = 'https://file.notion.so/f/s/ceb26cb9-9dcd-4f09-b34d-337fdf833c00/Counting_Stars.mp3?id=1186b948-bf25-4438-8b8e-552fb0d660ca&table=block&spaceId=09cc515c-e3ac-4443-8f45-cc119ad130bd&expirationTimestamp=1683514648561&signature=rdohdrs_ihND7xJaF9athkAe6OQHZ5qkyu5z08JM0kA';

let wikipediaMusic = 'https://upload.wikimedia.org/wikipedia/pt/8/8e/I_want_you.ogg';

const BASE_SIZE = 92;

const fetchUrl = 'https://musicle-server.onrender.com/'

const getSong = async () => {
  return new Promise ( async (resolve) => {
    try {
      const response = await axios.get(fetchUrl)
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
      const response = await axios.get(fetchUrl + 'allSongs');
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
    answer: ''
  })

  const [data, setData] = useState([])

  const [dataFetched, setDataFetched] = useState(false);
  const [songsFetched, setSongsFetched] = useState(false);

  const [playing, setPlaying] = useState(false);
  const [timeBar, setTimeBar] = useState(0);
  const [timeToPlay, setTimeToPlay] = useState(0.5);

  const [attempt, setAttempt] = useState(0);

  const [popUpClosed, setPopUpClosed] = useState(true);


  const GameState = {
    lost: 0,
    won: 1,
    notPlayed: 2,
  }
  const [gameState, setGameState] = useState(GameState.notPlayed);

  let date = new Date();
  date = date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate();

  useEffect(() => {
    console.log(song.src)
    console.log("Using effect!")

    getSongs().then( (response) => {
      setData(response)

      console.log("Data (tem que vir antes)", data)
      setSongsFetched(true);

      getSong().then( (dataFromGetSong) => {
        console.log("Data from get song", dataFromGetSong);
        setSong({
          id: dataFromGetSong.id, 
          src: dataFromGetSong.src,
          cover: dataFromGetSong.cover,
          answer: response[dataFromGetSong.id].title + ' - ' + response[dataFromGetSong.id].artist
        })
        setDataFetched(true);
      })
    })
  }, []);

  //gameState
  useEffect(() => {
    const previousDate = window.localStorage.getItem('DATE');
    if (!previousDate || previousDate != date)
    {
      //if the previous game was played yesterday, update the variables needed
      window.localStorage.setItem('GAME_STATE', GameState.notPlayed);
      window.localStorage.setItem('TEXTS', '[]');
    }

    const gameStateData = window.localStorage.getItem(`GAME_STATE`);
    console.log("Data", gameStateData); 
    if (gameStateData)
      setGameState(JSON.parse(gameStateData));
  },[])

  useEffect(() => {

    const previousDate = window.localStorage.getItem('DATE');

    if ((previousDate && previousDate == date) || gameState == GameState.notPlayed) 
    {
      console.log("Previousdate already exists");
      return;
    }
      // not updating because previousGamesData has already been updated

    window.localStorage.setItem('DATE', date);

    let previousGamesData = window.localStorage.getItem("PREVIOUS_GAMES_DATA");
    previousGamesData = previousGamesData ? JSON.parse(previousGamesData) : {attempts: [0, 0, 0, 0, 0], won: 0, lost: 0};

    console.log("Going to decide")
    
    if (gameState == GameState.won)
    {
      previousGamesData.attempts[attempt-1]++;
      previousGamesData.won++;
    }
    else if (gameState == GameState.lost)
    {
      previousGamesData.lost++;
    }
    
    console.log("previousGamesData", previousGamesData);
    
    window.localStorage.setItem(`GAME_STATE`, JSON.stringify(gameState));
    window.localStorage.setItem("PREVIOUS_GAMES_DATA", JSON.stringify(previousGamesData));
  }, [gameState]);


  useEffect( () => {
    const tamMax = 184 * timeToPlay;

    console.log(timeBar)

    if ((timeBar < tamMax) && playing)
    {
      setTimeout(() => setTimeBar(prev => prev += 2), 11);
      console.log("valor", timeBar)
    }
    if (timeBar == (tamMax))
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

  useEffect ( () => {
    var textsData = window.localStorage.getItem(`TEXTS`);
    if (textsData)
    {
      const textToJson = JSON.parse(textsData);
      setTexts(textToJson);
      setAttempt(textToJson.length);
    }
  }, [])

  useEffect ( () => {
    window.localStorage.setItem(`TEXTS`, JSON.stringify(texts));
  }, [texts])

  function handleSearch(songAttempt) {
    if (attempt > 3)
      setGameState(GameState.lost);

    console.log("Data song ida", song.id)
    console.log("Data song id", data[song.id].title)
    console.log("Handling search")

    const updatedItems = [...texts];

    // console.log(data[song.id].title, songAttempt);

    if (song.answer != songAttempt)
      updatedItems[attempt] = "❌ " + songAttempt;
    else
    {
      updatedItems[attempt] = "✅ " + songAttempt;
      setGameState(GameState.won);
    }

    setTexts(updatedItems);
    setAttempt(prev => prev += 1);
    setTimeToPlay(prev => prev += prev);
  }

  return (
    <div style={{width: '100%'}}>
    {!popUpClosed && (<DataPage setPopUpClosed={setPopUpClosed}/>)}
    <div style={{width: '100%', zIndex: '0', position: 'absolute'}}>
      <div className='top'>
        <button onClick={() => setPopUpClosed(false)}>
          <img
            src={menuUrl}
            alt={'Dropdown menu'}
            className='menu'
          />
        </button>
        <h1 className="heardle">Heardle Clone</h1>
        <img
          src={accountUrl}
          alt={'Account'}
          className='account'
          />
      </div>

      {/* if you've not played today */}
      {gameState == GameState.notPlayed && dataFetched && songsFetched && (
        <>
          <div className='attempt_wrapper'>
            <Attempt text={texts[0]} />
            <Attempt text={texts[1]} />
            <Attempt text={texts[2]} />
            <Attempt text={texts[3]} />
            <Attempt text={texts[4]} />
          </div> 

          <div className='times_wrapper'>
            <div className='time_wrapper'>
              <Time w={BASE_SIZE}/>
              <Time w={BASE_SIZE}/>
              <Time w={BASE_SIZE*2}/>
              <Time w={BASE_SIZE*4}/>
            </div>
            <div className='timeFill' style={{width: timeBar}}>
            </div>
          </div>

          {console.log("data (tem que vir depois)", data)}
          <div className='searchBox'>
            <SearchBox data={data} onClickSearch={handleSearch}>
            </SearchBox>
          </div>
          <div className='play_wrapper'>
            {console.log("page.js", song.src, dataFetched)}
            <Player url={fetchUrl + 'urls/' + song.src} timeToPlay={timeToPlay} onClickPlay={handleClick}>
            </Player>
          </div>
        </>          
      )}

      {/* if you already played / endgame screen */}
      { (gameState == GameState.lost || gameState == GameState.won) && dataFetched && (
        <div className='body'>
          <h1 className='songName'>{song.answer}</h1>
          {/* <img src={song.cover}/> */}
          {
            gameState == GameState.won && (
              <h2 className='endMessage'>Congrats, you've won!
              Come back tomorrow to play a new game.</h2>
            )
          }
          {
            gameState == GameState.lost && (
              <h2 className='endMessage'> You lost!
              Come back tomorrow to play a new game.</h2>
            )
          }
          
        </div>
      )}
    </div>
    </div>
  );
}
