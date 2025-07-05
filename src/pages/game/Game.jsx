import { useState, useEffect } from 'react';
import { differenceInCalendarDays } from 'date-fns';
import wordObject from '../../assets/words.json';
import './Game.css';

const wordArray = Object.keys(wordObject);
// Update this later to the date of deployment
const baseDate = new Date('2025-07-04');

function Game() {
  // USE LOCAL STORAGE TO SAVE USER STATE!!!!
  const [solution, setSolution] = useState();
  const [grid, setGrid] = useState([]);
  const [currRow, setCurrRow] = useState(0);
  const [currCol, setCurrCol] = useState(0);

  // Get the solution for the day and generate grid on mounting
  useEffect(() => {
    const wordIndex = differenceInCalendarDays(new Date(), baseDate) % wordArray.length;
    const currSolution = wordArray[wordIndex];
    setSolution(currSolution);

    // For a n-letter word, n + 1 guesses (rows)
    const emptyGrid = Array.from({ length: currSolution.length + 1 }, () =>
      new Array(currSolution.length).fill(<div></div>)
    );
    setGrid(emptyGrid);
  }, []);

  const handleKey = (event) => {
    if (event.key === 'Backspace') {
      clearGrid(event);
    } else {
      fillGrid(event);
    }
  }

  // Deletes last input from grid
  const clearGrid = (event) => {
    let tempRow = currRow;
    let tempCol = currCol;
    if (event.key === 'Backspace') {
      if (currCol === 0) {
        if (currRow === 0) return;
        tempRow = currRow - 1;
        tempCol = solution.length - 1;
      } else {
        tempCol = currCol - 1;
      }
      insertGrid(tempRow, tempCol, null);
      setCurrRow(tempRow);
      setCurrCol(tempCol);
    }
  }

  // Adds new input to grid
  const fillGrid = (event) => {
    // Only letters are allowed
    if (event.key.length !== 1 || !event.key.match(/[a-z]/i)) return;

    // Do nothing if on last grid square
    if (currRow === solution.length + 1 && currCol === 0) return;

    // Fill grid with user input
    insertGrid(currRow, currCol, <div className='grid-text'>{event.key}</div>);

    if (currCol === solution.length - 1) {
      setCurrRow(currRow + 1);
      setCurrCol(0);
    } else {
      setCurrCol(currCol + 1);
    }
  }

  // Inserts new element to the grid at specified row and col
  const insertGrid = (row, col, element) => {
    const newGrid = grid.map(row => [...row]);
    newGrid[row][col] = <div className='grid-text'>{element}</div>;
    setGrid(newGrid);
  }

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
      <input onKeyDown={handleKey} />
    </>
  );
}

export default Game;