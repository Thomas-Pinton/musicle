const puppeteer = require('puppeteer');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const { resolve } = require('path');
// const mm = require('music-metadata');

const app = express();

app.use(cors());

app.get('/', async (req, res) => {
    const song = await getSong();
    res.send(song);
})

app.get('/allSongs', async (req, res) => {
  const songs = await getSongsMetadata();
  res.send(songs);
})

app.use('/urls', express.static('C:/Users/thoma/SpotiFlyer/Playlists/All_Out_2010s'));

app.listen(4000, () => {
  console.log('Server listening on port 4000')
});

const getSongMetadata = async (filePath1, file1) => {
  const mm = await import("music-metadata");
  return new Promise ( resolve => {
    mm.parseFile(filePath1 + '/' + file1).then(metadata => {
      // console.log(metadata.common.picture);
      resolve({
        title: metadata.common.title, 
        artist: metadata.common.artist, 
        album: metadata.common.album
        // cover: mm.selectCover(metadata.common.picture)
        // cover: (metadata.common.picture ? metadata.common.picture[0].data.toString('base64') : null)
      });
    })
  })
}

const getSongsMetadata = () => {
  let filePath = 'C:/Users/thoma/SpotiFlyer/Playlists/All_Out_2010s'
  return new Promise( async resolve => {
    let metadata = []
    let fsObj = fs.readdirSync(filePath);
    for (const file of fsObj)
    {
      var data = await getSongMetadata(filePath, file);
      console.log("name", data);
      metadata.push(data)
    }
    console.log("Resolved");
    resolve(metadata);
  });
}

const getAllSongs = async () => {

  return new Promise( (resolve) => {

    let filePath = 'C:/Users/thoma/SpotiFlyer/Playlists/All_Out_2010s'

    let names = []

    fs.readdirSync(filePath).forEach(file => {
      names.push(file)
    });

    console.log(names.length)

    resolve (names);

  })

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto('https://congruous-year-ded.notion.site/M-sica-237c41fcad0f425a9591407e492efd0f');

  await page.waitForSelector('audio');

  const audios = await page.$$('audio');

  console.log(audios.length);
  
  let songs = [];

  for (i in audios)
  {
    const src = await audios[i].evaluate(node => node.src);
    songs[i] = {
      name: names[i],
      src: src,
    }
  }

  console.log(songs)

  const jsonData = JSON.stringify(songs, null, 2);
  const jsonNames = JSON.stringify(names, null, 2);

  fs.writeFile('song.json', jsonData, (err) => {
    if (err) throw err;
    console.log('Data written to file');
  });

  fs.writeFile('names.json', jsonNames, (err) => {
    if (err) throw err;
    console.log('Data written to file');
  });

  await browser.close();

  return songs;
}

const getSong = async () => {

  let date = new Date();

  function readFileAsync(filename) {
    return new Promise((resolve, reject) => {
      fs.readFile(filename, 'utf8', (err, data) => {
        if (err) reject(err);
        resolve(data);
      });
    });
  }
  let data = await readFileAsync('song.json');
  data ? data = JSON.parse(data) : data = [];

  if (!data[0])
  {
    console.log("No data saved");
  } else 
  {
    if (data[0].date == date.getDate())
    {
      console.log("Song already saved");
      return (data[0]);
    }
  }

  let names = await getAllSongs();

  console.log("length", names.length)

  const randomNumber = Math.floor(Math.random() * (names.length));

  console.log(names, randomNumber)

  const song = {
    id: randomNumber,
    src: names[randomNumber],
    date: date.getDate(),
  };

  console.log("song", song)

  const jsonData = JSON.stringify([song], null, 2);

  fs.writeFile('song.json', jsonData, (err) => {
    if (err) throw err;
    console.log('Data written to file');
  });

  return song;

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto('https://congruous-year-ded.notion.site/M-sica-237c41fcad0f425a9591407e492efd0f');

  await page.waitForSelector('audio');

  const audios = await page.$$('audio');

  console.log(audios.length);

  // const randomNumber = Math.floor(Math.random() * (audios.length));

  const src = await audios[randomNumber].evaluate(node => node.src);

  // const song = {
  //   id: randomNumber,
  //   src: src,
  //   date: date.getDate(),
  // };

  console.log(song)

  

  await browser.close();

  return song;
}


