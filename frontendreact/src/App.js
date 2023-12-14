import Gallery from './Component/Gallery';
import ThemeContext from './Component/Context/ThemeContext';
import { useState } from 'react';


function App() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
      <Gallery />
    </ThemeContext.Provider>
  );
}


export default App;
