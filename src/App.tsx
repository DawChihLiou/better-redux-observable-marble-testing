import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { fetchUsers } from './store/githubUsers';

const App: React.FC = () => {
  const dispatch = useDispatch();

  const handleClick = useCallback(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={handleClick}>Get Github Users</button>
      </header>
    </div>
  );
};

export default App;
