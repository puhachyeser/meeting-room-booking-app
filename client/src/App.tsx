import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from './features/auth/auth-slice';
import Auth from './pages/Auth';
import Rooms from './pages/Rooms';
import CreateRoom from './pages/CreateRoom';

function App() {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  return (
    <Router>
      <Routes>
        <Route 
          path="/auth" 
          element={!isAuthenticated ? <Auth /> : <Navigate to="/" />} 
        />
        <Route 
          path="/" 
          element={isAuthenticated ? <Rooms /> : <Navigate to="/auth" />} 
        />
        <Route path="/create-room" element={isAuthenticated ? <CreateRoom /> : <Navigate to="/auth" />} />
      </Routes>
    </Router>
  );
}

export default App;