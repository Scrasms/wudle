import { useState, useEffect } from 'react';
import { differenceInCalendarDays } from 'date-fns';
import wordObject from '../../assets/words.json';
import './Game.css';

function Game() {
  const [word, setWord] = useState();
  const wordArray = Object.keys(wordObject);
  const baseDate = new Date('2025-07-04');

  // Get new word for the day on mounting
  useEffect(() => {
    const wordIndex = differenceInCalendarDays(new Date(), baseDate) % wordArray.length;
    console.log(differenceInCalendarDays(new Date(), baseDate));
    // USE LOCAL STORAGE TO SAVE USER STATE!!!!
    setWord(wordArray[wordIndex]);
  }, []);

  return (
    <>
        {word}
    </>
  );
}

export default Game;