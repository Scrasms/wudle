import { useState, useEffect, useRef } from 'react';
import { differenceInCalendarDays } from 'date-fns';
import wordObject from '../../assets/words.json';
import './Game.css';

const wordArray = Object.keys(wordObject);

// Update this later to the date of deployment
// YYYY-MM-DD
const baseDate = new Date('2025-07-09');

function Game() {
  const [solution, setSolution] = useState();
  const [grid, setGrid] = useState([]);
  const [currRow, setCurrRow] = useState(0);
  const [currCol, setCurrCol] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const gridContainerRef = useRef();

  // Get the solution for the day and generate grid on mounting
  useEffect(() => {
    const dayDiff = differenceInCalendarDays(new Date(), baseDate);

    // Attempt to load old game state from local storage
    const oldState = JSON.parse(localStorage.getItem(dayDiff));
    if (oldState) {
      setSolution(oldState.solution);
      setGrid(oldState.grid);
      setCurrRow(oldState.currRow);
      setCurrCol(oldState.currCol);
      setGameOver(oldState.gameOver);

    } else {
      const wordIndex = dayDiff % wordArray.length;
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
    }
    // Focus the grid-container div on mount
    if (gridContainerRef.current) {
      gridContainerRef.current.focus();
    }
  }, []);

  // Save updated game state to local storage
  useEffect(() => {
    // Prevent game from being saved before anything has been initialised
    if (!solution) return;

    const key = differenceInCalendarDays(new Date(), baseDate);
    const gameState = {
      solution,
      grid,
      currRow,
      currCol,
      gameOver
    };
    localStorage.setItem(key, JSON.stringify(gameState));
  }, [solution, grid, currRow, currCol, gameOver]);

  const handleKey = (event) => {
    if (gameOver) return;

    switch (event.key) {
      case 'Backspace':
        clearGrid();
        break;
      case 'Enter':
        // Handle case where guess word does not exist later
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
      const newGrid = grid.map(r => [...r]);
      newGrid[row][col].letter = letter;
      return newGrid;
    });
  }

  // Checks whether the current guess (row of letters) is correct
  const checkGuess = () => {
    const guess = grid[currRow];
    const guessStr = guess.map((obj) => obj.letter).join("");

    if (guessStr.length !== solution.length) {
      // Replace with an alert component later
      alert('Not enough letters!');
      return;
    }

    // Counter to track num occurences of each letter in solution
    const solCounter = new Map();
    for (const letter of solution) {
      if (solCounter.has(letter)) {
        solCounter.set(letter, solCounter.get(letter) + 1);
      } else {
        solCounter.set(letter, 1);
      }
    }

    // Green: letter present in solution and in correct position
    // Check for green first to give them counter decrement priority
    for (const [i, obj] of guess.entries()) {
      if (solution.charAt(i) === obj.letter) {
        obj.colour = 'green';
        solCounter.set(obj.letter, solCounter.get(obj.letter) - 1);
      }
    }

    // Yellow: letter present in solution
    // Grey: letter not present in solution
    for (const obj of guess) {
      if (obj.colour != 'none') continue;

      // Only light up a letter as many times as it appears in the solution word
      if (solution.includes(obj.letter) && solCounter.get(obj.letter) !== 0) {
        obj.colour = 'yellow';
        solCounter.set(obj.letter, solCounter.get(obj.letter) - 1);
      } else {
        obj.colour = 'grey';
      }
    }

    // Validate guess against solution
    if (guessStr === solution) {
      setGameOver(true);
      alert('You win!');

    } else {
      // Move to next row after guess
      if (currRow !== solution.length) {
        setCurrRow(currRow => currRow + 1);
        setCurrCol(0);
      } else {
        // Handle all guesses used logic here
        setGameOver(true);
        alert('Game over');
      }
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
        {gameOver ? <p>game over, come back tomorrow :D</p> : null}
        {/* <p>Solution: {solution}</p> */}
      </div>
    </>
  );
}

export default Game;