
import { useState } from 'react';
import './App.css'
import { Navbar } from './components/Navbar';
import  { WorkingArea }  from './pages/WorkingArea';

function App() {
  const [grabber, setGrabber] = useState(false);
  const [circle, setCircle] = useState(false);
  const [rectangle, setRectangle] = useState(false);
  const [line, setLine] = useState(false);
  return (
    <div>
      <Navbar setGrab={setGrabber} setCircle={setCircle} setRectangle={setRectangle} setLine={setLine} />
      <WorkingArea grabber={grabber} circle={circle} rectangle={rectangle} line={line}/>
    </div>
  );
}

export default App;
