import { useState, useEffect } from 'react';
import { getWord } from '../../api/word';
import './Game.css';

function Game() {
  const [word, setWord] = useState();

  // // Get new word
  // // USE LOCAL STORAGE TO SAVE USER STATE!!!!
  // useEffect(() => {
  //   const getTargetWord = async () => {
  //     setWord(await getWord());
  //   }
  //   getTargetWord();
  // }, []);


  return (
    <>
        {word}
    </>
  );
}

export default Game;