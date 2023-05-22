const puppeteer = require('puppeteer');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
// const mm = require('music-metadata');

const app = express();

app.use(cors());

app.get('/', async (req, res) => {
    const song = await getSong();
    res.send(song);
})

app.listen(4000, () => {
  console.log('Server listening on port 4000')
});

const getAllSongs = async () => {

  let filePath = 'C:/Users/thoma/SpotiFlyer/Playlists/All_Out_2010s'

  let names = []

  fs.readdirSync(filePath).forEach(file => {
    mm.parseFile(file).then(metadata => {
      names.push(`${metadata.common.title} - ${metad.common.artist}`);
    }).catch(err => {
      console.error(err.message);
    });
  });

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
}

const getSong = async () => {

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
    console.log("Song already saved");
    return (data[0]);
  }

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto('https://congruous-year-ded.notion.site/M-sica-237c41fcad0f425a9591407e492efd0f');

  await page.waitForSelector('audio');

  const audios = await page.$$('audio');

  console.log(audios.length);

  const randomNumber = Math.floor(Math.random() * (audios.length));

  const src = await audios[randomNumber].evaluate(node => node.src);

  const song = {
    name: 'Teste',
    src: src,
  };

  const jsonData = JSON.stringify([song], null, 2);

  fs.writeFile('song.json', jsonData, (err) => {
    if (err) throw err;
    console.log('Data written to file');
  });

  console.log(randomNumber, src);

  await browser.close();

  return song;
}