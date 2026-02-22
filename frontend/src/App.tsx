
import { useState } from 'react';
import './App.css'
import { Navbar } from './components/Navbar';
import { WorkingArea } from './pages/WorkingArea';

function App() {
  const [grabber, setGrabber] = useState(false);
  return (
    <div>
      <Navbar setGrab={setGrabber} />
      <WorkingArea grabber={grabber} />
    </div>
  );
}

export default App;
