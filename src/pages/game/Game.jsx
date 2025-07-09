import { useState, useEffect, useRef } from 'react';
import { differenceInCalendarDays } from 'date-fns';
import wordObject from '../../assets/words.json';
import './Game.css';

const wordArray = Object.keys(wordObject);
// Update this later to the date of deployment
// YYYY-MM-DD
const baseDate = new Date('2025-07-09');

function Game() {
  // USE LOCAL STORAGE TO SAVE USER STATE!!!!
  const [solution, setSolution] = useState();
  const [grid, setGrid] = useState([]);
  const [currRow, setCurrRow] = useState(0);
  const [currCol, setCurrCol] = useState(0);

  const gridContainerRef = useRef();

  // Get the solution for the day and generate grid on mounting
  useEffect(() => {
    const wordIndex = differenceInCalendarDays(new Date(), baseDate) % wordArray.length;
    const currSolution = wordArray[wordIndex];
    setSolution(currSolution);

    // For a n-letter word, n + 1 guesses (rows)
    const emptyGrid = Array.from({ length: currSolution.length + 1 }, () =>
      Array.from({length: currSolution.length}, () => ({
        letter: null,
        colour: 'none'
      }))
    );
    setGrid(emptyGrid);

    // Focus the grid-container div on mount
    if (gridContainerRef.current) {
      gridContainerRef.current.focus();
    }
  }, []);

  const handleKey = (event) => {
    switch (event.key) {
      case 'Backspace':
        clearGrid();
        break;
      case 'Enter':
        // Handle case where not enough letters are entered or guess word does not exist later
        checkGuess();
        break;
      default:
        fillGrid(event.key);
    }
  }

  // Deletes last input from grid
  const clearGrid = () => {
    if (currCol === 0) return;

    insertGrid(currRow, currCol - 1, null);
    setCurrCol(currCol => currCol - 1);
  }

  // Adds new input to grid
  const fillGrid = (key) => {
    // Only letters are allowed
    if (key.length !== 1 || !key.match(/[a-z]/i) || currCol === solution.length) return;

    insertGrid(currRow, currCol, key);
    setCurrCol(currCol => currCol + 1);
  }

  // Inserts new letter & colour object to the grid at specified row and col
  const insertGrid = (row, col, letter) => {
    // Force rerender by calling setGrid
    setGrid(grid => {
      const newGrid = grid.map(row => [...row]);
      newGrid[row][col].letter = letter;
      return newGrid;
    });
  }

  const checkGuess = () => {
    const guess = grid[currRow];
    const guessLen = guess.map((obj) => obj.letter).join("").length;

    if (guessLen !== solution.length) {
      // Replace with an alert component later
      alert('Not enough letters!');
      return;
    }

    // Green: letter present in solution and in correct position
    // Yellow: letter present in solution
    // Grey: letter not present in solution
    for (const [i, obj] of guess.entries()) {
      if (solution.charAt(i) === obj.letter) {
        obj.colour = 'green';
      } else if (solution.includes(obj.letter)) {
        obj.colour = 'yellow';
      } else {
        obj.colour = 'grey';
      }
    }

    // Move to next row after guess
    if (currRow !== solution.length) {
      setCurrRow(currRow => currRow + 1);
      setCurrCol(0);
    } else {
      // Handle game completion logic here
      alert('Game over');
    }

    // Trigger rerender for grid
    setGrid(grid => {
      const newGrid = grid.map(row => [...row]);
      newGrid[currRow] = guess;
      return newGrid;
    });
  }

  return (
    <>
      {/*grid-container is always secretly focused
      and covers whole page to capture keyboard input*/}
      <div
        className='grid-container'
        ref={gridContainerRef}
        tabIndex='0'
        onKeyDown={handleKey}
      >
        <div className='grid'>
          {grid.map((row, rowIndex) => (
            <div className='row' key={rowIndex}>
              {row.map((col, colIndex) => (
                <div className={`col ${col.colour}`} key={colIndex}>
                  <div className='grid-text'>{col.letter}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
        <p>Solution: {solution}</p>
      </div>
    </>
  );
}

export default Game;