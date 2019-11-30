import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import img1 from './assets/images/info.png';

class App extends Component {
  render() {
    console.log(str1, str, add, myObj.a)
    return (
      <div>hello world
        <img src={img1}/>
      </div>
    )
  }
}


ReactDOM.render(<App />, document.getElementById('app'));