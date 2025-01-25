import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FullLayout from './layout/layout';
import Dashboard from './view/dashboard/dashboard';
import Product from './view/product/product';
import Login from './auth/login';
import ProtectedRoute from './protected-route';


import './App.css';



function App() {
  return (
    <div className="App">
      <Router>
        <main>
          <Routes >
            <Route path='/login' element={<Login />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<FullLayout />} >
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="product" element={<Product />} />
              </Route>
            </Route>
          </Routes>
        </main>
      </Router>

    </div>
  );
}

export default App;

