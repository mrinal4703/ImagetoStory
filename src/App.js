import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import {ImageCaption} from "./ImageCaption";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ImageCaption />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
