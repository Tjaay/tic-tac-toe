import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const humanPlayer = 'X';
const aiPlayer = 'O';
const size = 4;

function Square(props) {
  return (
    <button className={"square" + (props.winningSquare ? " winner" : "")} onClick={props.onClick}>
      {props.value}
    </button>
  );
}


class Board extends React.Component {

  renderSquare(i) {
    return <Square key={i}
      value={this.props.squares[i]}
      winningSquare={this.props.winner && this.props.winner.indexOf(i) !== -1}
      onClick={() => this.props.onClick(i)}
    />;
  }

  render() {
    const mappedSquares = Array(size * size).fill(null);
    let square = 0;
    for (let i = 0; i < size; i++) {
      const squares = Array(size).fill(null);
      for (let j = 0; j < size; j++) {
        square = size * i + j;
        squares[square] = this.renderSquare(square);
      }
      mappedSquares.push(<div key={square} className="board-row">{squares}</div>);
    }
    return (
      <div class="board">
        {mappedSquares}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      history: [{
        squares: Array(size * size).fill(null),
        col: null,
        row: null,
      }],
      human: null,
      computer: null,
      stepNumber: 0,
      xIsNext: true,
      movesAscending: true,
    };
  }



  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    var aiPick = Math.floor(Math.random() * squares.length);
    while (squares[aiPick] === "X" || squares[aiPick] === 'O') {
      aiPick = Math.floor(Math.random() * squares.length);
    }
    const col = i % size;
    const row = Math.floor(i / size);
    if (calculateWinner(squares) || squares[i]) {
      return
    }
    squares[i] = humanPlayer;
    squares[aiPick] = aiPlayer;
    console.log(squares.length);
    this.setState({
      history: history.concat([{
        squares: squares,
        col: col,
        row: row
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }



  onClick(i) {
    this.handleClick(i);
    this.computerPick();
  }

  computerPick() {
    
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  toggleMoves() {
    this.setState({
      movesAscending: !this.state.movesAscending
    })
  }


  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move + " at position: (" + step.col + ", " + step.row + ")" :
        'Go to game start';
      return (
        <li key={move}>
          <button className={move === this.state.stepNumber ? "currentMove" : ""} onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    if (!this.state.movesAscending) {
      moves.reverse();
    }

    let status;
    let draw;
    let bold;
    if (winner) {
      status = 'Winner: ' + current.squares[winner[0]];
      bold = true;
    } else if (winner === false) {
      status = 'TIE GAME!!!!';
      bold = true;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? humanPlayer : aiPlayer);
    }

    return (
      <div className="game">
        <div className="game-board">
          <h1>{"Tic Tac Toe"}</h1>
          <div className={bold ? "gameResult" : "info"}> {status}</div>
          <Board
            winner={winner}
            squares={current.squares}
            onClick={(i) => this.onClick(i)}
          />
          <button onClick={() => this.toggleMoves()}>Reorder Moves</button>
          <div className="game-info">
            <li>{moves}</li>
          </div>
        </div>
      </div>
    );
  }
}

// ========================================
function calculateWinner(squares, player) {
  const lines = [
    [0, 1, 2, 3],
    [4, 5, 6, 7],
    [8, 9, 10, 11],
    [12, 13, 14, 15],
    [0, 4, 8, 12],
    [1, 5, 9, 13],
    [2, 6, 10, 14],
    [3, 7, 11, 15],
    [0, 5, 10, 15],
    [12, 9, 6, 3],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c, d] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c] && squares[a] === squares[d]) {
      return [a, b, c, d];
    }
    if (squares.indexOf(null) === -1) {
      return false;
    }
  }
  return null;
}

ReactDOM.render(

  <Game />,
  document.getElementById('root')
);
