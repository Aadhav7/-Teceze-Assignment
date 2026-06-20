import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Employees from './pages/Employees';
import Charts from './pages/Charts';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="employees" element={<Employees />} />
          <Route path="charts" element={<Charts />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
