//********************************************************************
//File:	        index.js    
//Author:       Thomas Reeves
//Date:	        2017-11-19
//Course:       Applied Javascript
//
//Problem Statement:
// 1. Display the location for each move in the format (col, row) in the move history list. 
// 2. Bold the currently selected item in the move list. 
// 3. Rewrite Board to use two loops to make the squares instead of hardcoding them.
// 4. Add a toggle button that lets you sort the moves in either ascending or descending order.
// 5. When someone wins, highlight the three squares that caused the win.

//Inputs:	User's key clicks  
//Outputs:	Tic Tac toe game
// 

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


const NUM_ROWS = 3;
const NUM_CELLS = 3;

function Square(props) {
  if (props.highlight) { // if else if highlight is true background is yellow if not default white
    return (
      <button className="square" style={{backgroundColor:"yellow"}} onClick={props.onClick}>
        {props.value}
      </button>
    );
  } else { 
    return (
      <button className="square" onClick={props.onClick}>
        {props.value}
      </button>
    );
  }
  }
  
  class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          squares: Array(9).fill(null),
          xIsNext: true,
        };
      }

      renderSquare(i) {
        let won = false;
        if (this.props.winningSquares && this.props.winningSquares.indexOf(i) >= 0) {    
          won = true;
       }
       // if a winning square set highlight to true if not default to false
       return <Square key={i} value={this.props.squares[i]} highlight={won} onClick={() => this.props.onClick(i)} />;
    }
  
    render() {
      var board = [];
      var cells = [];
      var cellPos = 0;
      for (var index = 0; index < NUM_ROWS; index++) { // loop for # of rows
        for (var cell = 0; cell < NUM_CELLS; cell++) { // loop for # of cells per row
          cells.push(this.renderSquare(cellPos))
          cellPos++; 
      }
        board.push(<div key={index} className="board-row">{ cells }</div>)
        cells = []; //clears array after main loop so it doesn't make 9 columns
    }
    return (
      <div>
        {board}
      </div>     
    )
  }
}
  
  class Game extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        history: [{
          squares: Array(9).fill(null),
        }],
         stepNumber: 0,
        xIsNext: true,
      };
    }

    handleClick(i) {
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length - 1];
      const squares = current.squares.slice();
      if (calculateWinner(squares) || squares[i]) {
          return
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
          history: history.concat([{
            squares: squares,
            position: squares[i]
          }]),
          stepNumber: history.length,
          xIsNext: !this.state.xIsNext,
        });
      }

    jumpTo(step) {
        this.setState({
          stepNumber: step,
          xIsNext: (step % 2) === 0,
        });
    }

    sortMoves() { // function to handle sorted
      const sorted = this.state.sorted;
      this.setState({
        sorted: !sorted,
      });
    }

    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const win = calculateWinner(current.squares);

      const moves = history.map((step, move) => {
        const desc = move ?
          'Go to move #'  + move : //gave up Q_Q history.position 
          'Go to game start';
          if ( move === this.state.stepNumber ){ // if current move bolds
        return (
          <li key={move}>
            <button onClick={() => this.jumpTo(move)}><b>{desc}</b></button>
          </li>
        );
      }
      else {
        return (
          <li key={move}>
            <button onClick={() => this.jumpTo(move)}>{desc}</button>
          </li>
      );
      }
      });
  
      let status;
      let winningSquares;
      if (win) {
        status = 'Winner: ' + win.winner ;
        winningSquares = win.winningSquares;
        //console.log(win.winningSquares);
      } else {
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      }

      return (
        <div className="game">
          <div className="game-board">
          <Board
            squares={current.squares}
            winningSquares = {winningSquares}
            onClick={(i) => this.handleClick(i)}
          />
            
          </div>
          <div className="game-info">
            <div>{status}</div>
            <button onClick={() => this.sortMoves()}> Sort </button>
            {(() => this.state.sorted === true?
            // inline conditonal with true / false for sorting
            <ol>{moves.reverse()}</ol> : <ol>{moves}</ol>) ()} 
          </div>
        </div>
      );
    }
  }
  
  // ========================================

  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return {
         // returns objects so i can call the properties
         winner: squares[a],
         winningSquares: lines[i]
        }
      }
    }
    return null;
  }
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  