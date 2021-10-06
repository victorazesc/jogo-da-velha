import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square (props) {
  return (
    <button className="square" onClick={props.onClick} style={props.value === 'O' ? { color: '#EF8354' } : { color: '#4F5D75' }}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {

  renderSquare (i) {
    return <Square
      value={this.props.squares[i]}
      onClick={() => { this.props.onClick(i) }} />;
  }

  render () {
    return (
      <div>
        {this.props.winner &&
          <div className="restore-button">
            {this.props.restore}
            <div className="victory-message">
              { this.props.winner === 'Empate' &&
              <span style={{color: '#d8464d'}}>Empate !</span>
              }
              { this.props.winner !== 'Empate' &&
              <span style={{color: '#4caf50'}}>Ganhou !</span>
              }
            </div>
          </div>
        }

        <div style={this.props.winner ? { opacity: '0.2' } : { opacity: '1' }}>
          <svg width="306" height="305" viewBox="0 0 306 305" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.83154 103.028H299.337" stroke="#2D3142" strokeWidth="8.31461" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M103.192 4.91573V300.084M5 202.802H301M203.282 300.084V4.91573" stroke="#2D3142" strokeWidth="8.31461" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div className="board-row">
            <span style={{ position: 'absolute', top: '12px', left: '11px' }}> {this.renderSquare(0)} </span>
            <span style={{ position: 'absolute', top: '12px', left: '111px' }}> {this.renderSquare(1)} </span>
            <span style={{ position: 'absolute', top: '12px', right: '12px' }}> {this.renderSquare(2)} </span>
          </div>
          <div className="board-row">
            <span style={{ position: 'absolute', top: '112px', left: '11px' }}> {this.renderSquare(3)} </span>
            <span style={{ position: 'absolute', top: '112px', left: '111px' }}> {this.renderSquare(4)} </span>
            <span style={{ position: 'absolute', top: '112px', right: '12px' }}> {this.renderSquare(5)} </span>
          </div>
          <div className="board-row">
            <span style={{ position: 'absolute', top: '212px', left: '11px' }}> {this.renderSquare(6)} </span>
            <span style={{ position: 'absolute', top: '212px', left: '111px' }}> {this.renderSquare(7)} </span>
            <span style={{ position: 'absolute', top: '212px', right: '12px' }}> {this.renderSquare(8)} </span>
          </div>
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      xWins: 0,
      oWins: 0,
      draws: 0,
      xIsNext: true,
      stepNumber: 0,
    };
  }

  jumpTo (step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  handleClick (i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  render () {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Ir para o Movimento #' + move :
        'Reiniciar Jogo';
      return (
        <button onClick={() => this.jumpTo(0)}>{desc}</button>
      );
    });

    let status;
    if (winner) {
      if (winner === 'X') {
        this.state.xWins++
      } else if (winner === 'O') {
        this.state.oWins++
      } else if (winner === 'Empate') {
        this.state.draws++
      }
      status = 'Vencedor: ' + winner;
    } else {
      status = 'Próximo Jogador: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            winner={winner}
            restore={moves[0]}
          />
        </div>
        <div className="game-info">

          <div className="game-points">

            <table style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th style={{ width: '100px', fontSize: '65px', color: '#4F5D75' }}>X</th>
                  <th style={{ width: '100px', fontSize: '65px', color: '#EF8354' }}>O</th>
                  <th style={{ width: '100px', fontSize: '65px' }}>
                    <svg width="50" height="60" viewBox="0 0 47 49" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginTop: '15px' }}><path d="M23.576 0.511997C29.8907 0.511997 35.3733 2.79466 40.024 7.36C44.6747 11.9253 47 17.6 47 24.384C47 31.1253 44.7813 36.8853 40.344 41.664C35.9067 46.4 30.4453 48.768 23.96 48.768C17.4747 48.768 11.9493 46.4213 7.384 41.728C2.86133 37.0347 0.6 31.4453 0.6 24.96C0.6 21.4187 1.24 18.112 2.52 15.04C3.8 11.9253 5.50667 9.32267 7.64 7.232C9.77333 5.14133 12.2267 3.49866 15 2.304C17.7733 1.10933 20.632 0.511997 23.576 0.511997ZM11.928 24.64C11.928 28.4373 13.144 31.5307 15.576 33.92C18.0507 36.2667 20.8027 37.44 23.832 37.44C26.8613 37.44 29.592 36.288 32.024 33.984C34.456 31.68 35.672 28.5867 35.672 24.704C35.672 20.8213 34.4347 17.7067 31.96 15.36C29.528 13.0133 26.7973 11.84 23.768 11.84C20.7387 11.84 18.008 13.0347 15.576 15.424C13.144 17.7707 11.928 20.8427 11.928 24.64Z" fill="#D8464D"></path><path d="M13 34L34.5 17.5" stroke="#D8464D" strokeWidth="7"></path></svg>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ fontSize: '25px' }}>
                  <td style={{ textAlign: 'center' }}>{this.state.xWins}</td>
                  <td style={{ textAlign: 'center' }}>{this.state.oWins}</td>
                  <td style={{ textAlign: 'center' }}>{this.state.draws}</td>
                </tr>
              </tbody>
            </table>
          </div>
          {/* <div>{status}</div> */}
        </div>
      </div>
    );
  }
}


function calculateWinner (squares) {
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
      console.log(squares[a])
      return squares[a];
    }  
  }
  if (!squares.includes(null)){
    return 'Empate';
  }
  return null;
}


// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
