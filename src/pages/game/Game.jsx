import { useState, useEffect } from 'react';
import { differenceInCalendarDays } from 'date-fns';
import wordObject from '../../assets/words.json';
import './Game.css';

const wordArray = Object.keys(wordObject);
const baseDate = new Date('2025-07-04');

function Game() {
  // USE LOCAL STORAGE TO SAVE USER STATE!!!!
  const [solution, setSolution] = useState();
  const [grid, setGrid] = useState([]);

  // Get the solution for the day and generate grid on mounting
  useEffect(() => {
    const wordIndex = differenceInCalendarDays(new Date(), baseDate) % wordArray.length;
    const currSolution = wordArray[wordIndex];
    setSolution(currSolution);

    // For a n-letter word, n + 1 guesses (rows)
    const emptyGrid = Array.from({ length: currSolution.length + 1 }, () =>
      new Array(currSolution.length).fill('')
    );
    setGrid(emptyGrid);
  }, []);

  return (
    <>
      <div className='grid'>
        {grid.map((row, rowIndex) => (
          <div className='row' key={rowIndex}>
            {row.map((col, colIndex) => (
              <div className='col' key={colIndex}>
                {col}
              </div>
            ))}
          </div>
        ))}
      </div>
      <p>Solution: {solution}</p>
    </>
  );
}

export default Game;