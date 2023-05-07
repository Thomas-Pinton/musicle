"use client"

import './styles.css';

import Player from './player.js'

import axios from 'axios';
import React, {useEffect, useState} from 'react';
//import menu from './images/menu.png'
import menu from 'C:/Users/thoma/OneDrive/Documentos/Codes/HeardleClone/heardle_clone/app/images/menu.png'
import account from './images/account.png'
//import getSong from './getSong.js'

let menuUrl = 'https://cdn-icons-png.flaticon.com/512/7216/7216128.png';
let accountUrl = 'https://cdn-icons-png.flaticon.com/512/61/61205.png';

let musica1 = 'https://file.notion.so/f/s/ceb26cb9-9dcd-4f09-b34d-337fdf833c00/Counting_Stars.mp3?id=1186b948-bf25-4438-8b8e-552fb0d660ca&table=block&spaceId=09cc515c-e3ac-4443-8f45-cc119ad130bd&expirationTimestamp=1683514648561&signature=rdohdrs_ihND7xJaF9athkAe6OQHZ5qkyu5z08JM0kA';

let wikipediaMusic = 'https://upload.wikimedia.org/wikipedia/pt/8/8e/I_want_you.ogg';



const getSong = async () => {
  try {
    const response = await axios.get('http://localhost:4000/')
    var rand = Math.floor(Math.random() * response.data.length)
    console.log(response.data[rand])
    return response.data[rand];
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

function Attempt ({ text })
{
  return (
    <div className='attempt'>
      <p className='attempt_text'>❌{text}</p>
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
    name: 'Teste',
    src: wikipediaMusic,
  })
  const [dataFetched, setDataFetched] = useState(false);

  useEffect(() => {
    console.log(song.src)
    console.log("Using effect!")
    getSong().then( (dataFromGetSong) => {
      console.log(dataFromGetSong)
      setSong({name: dataFromGetSong.name, src: dataFromGetSong.src})
      setDataFetched(true);
    })
    console.log(song.src)
  }, []);

  return (
    <div>
      {dataFetched && (
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
            <Attempt text={'Enter Sandman - Metallica'}/>
            <Attempt text={'Memories - Maroon 5'}/>
            <Attempt text={'This Love - Maroon 5'}/>
            <Attempt />
            <Attempt />
          </div> 

          <div className='time_wrapper'>
            <Time w={70}/>
            <Time w={140}/>
            <Time w={280}/>
            <Time w={560}/>
          </div>
          <div className='timeFill' style={{width:"140px"}}>

          </div>

          <div className='play_wrapper'>
            <Player url={song.src}>
            </Player>
          </div>
        </>
      )}
    </div>
  );
}