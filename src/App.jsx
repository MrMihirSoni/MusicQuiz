import { useState } from 'react';
import './App.css';
import Quiz from './Quiz.jsx';
import AddQuestion from './AddQuestion.jsx';

function App() {
  const [view, setView] = useState(null); // can be "music", "dance", or "add"

  return (
    <>
      {view === "music" || view === "dance" ? (
        <Quiz category={view} />
      ) : view === "add" ? (
        <AddQuestion />
      ) : (
        <div>
          <button onClick={() => setView("dance")}>Dance</button>
          <button onClick={() => setView("music")}>Music</button>
          <button onClick={() => setView("add")}>Add Question</button>
        </div>
      )}
    </>
  );
}

export default App;
