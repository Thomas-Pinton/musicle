"use client"

import './styles.css';
import './endGame.css';

import Player from './player.js'
import SearchBox from './searchBox.js'
import Modal from './popUp.js'

import axios from 'axios';

import React, {useEffect, useState} from 'react';
//import menu from './images/menu.png'
import menu from 'C:/Users/thoma/OneDrive/Documentos/Codes/HeardleClone/heardle_clone/app/images/menu.png'
import account from './images/account.png'

let menuUrl = 'https://cdn-icons-png.flaticon.com/512/7216/7216128.png';
let accountUrl = 'https://cdn-icons-png.flaticon.com/512/61/61205.png';

let musica1 = 'https://file.notion.so/f/s/ceb26cb9-9dcd-4f09-b34d-337fdf833c00/Counting_Stars.mp3?id=1186b948-bf25-4438-8b8e-552fb0d660ca&table=block&spaceId=09cc515c-e3ac-4443-8f45-cc119ad130bd&expirationTimestamp=1683514648561&signature=rdohdrs_ihND7xJaF9athkAe6OQHZ5qkyu5z08JM0kA';

let wikipediaMusic = 'https://upload.wikimedia.org/wikipedia/pt/8/8e/I_want_you.ogg';

const BASE_SIZE = 92;

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
    answer: ''
  })

  const [data, setData] = useState([])
  // let data = []

  const [dataFetched, setDataFetched] = useState(false);
  const [songsFetched, setSongsFetched] = useState(false);

  const [playing, setPlaying] = useState(false);
  const [timeBar, setTimeBar] = useState(0);
  const [timeToPlay, setTimeToPlay] = useState(0.5);

  const [attempt, setAttempt] = useState(0);

  const GameState = {
    lost: 0,
    won: 1,
    notPlayed: 2,
  }
  const [gameState, setGameState] = useState(GameState.notPlayed);

  const date = new Date().getDate();

  useEffect(() => {
    console.log(song.src)
    console.log("Using effect!")

    getSongs().then( (response) => {
      // const songs = response.map((song, index) => ({ key: index.toString(), value: song }));
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
        // setAudio(dataFromGetSong.src)
      })
    })
  }, []);

  //HasPlayed
  useEffect(() => {
    const gameStateData = window.localStorage.getItem(`GAME_STATE${date}`);
    console.log("Data", gameStateData); 
    if (gameStateData)
      setGameState(JSON.parse(gameStateData));

    // removing all keys with GAME_STATE value
    var arr = [];
    for (var i = 0; i < localStorage.length; i++){
      if (localStorage.key(i).startsWith('GAME_STATE')) {
          arr.push(localStorage.key(i));
      }
    }
    // Iterate over arr and remove the items by key
    for (var i = 0; i < arr.length; i++) {
        localStorage.removeItem(arr[i]);
    }
  },[])

  useEffect(() => {
    console.log("Game status ", gameState);
    window.localStorage.setItem(`GAME_STATE${date}`, JSON.stringify(gameState));
    console.log("1", window.localStorage.getItem(`GAME_STATE${date}`))
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
            <Player url={'http://localhost:4000/urls/' + song.src} timeToPlay={timeToPlay} onClickPlay={handleClick}>
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
    
  );
}