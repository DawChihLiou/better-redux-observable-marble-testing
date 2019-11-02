import React from 'react';
import logo from './logo.svg';
import './App.css';
import { useDispatch } from 'react-redux';
import { fetchUsers } from './store/actions';

const App: React.FC = () => {
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(fetchUsers());
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <button onClick={handleClick}>Get Github Users</button>
      </header>
    </div>
  );
};

export default App;
