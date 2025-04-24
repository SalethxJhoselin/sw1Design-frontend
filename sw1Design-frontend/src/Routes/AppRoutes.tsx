import { Route, Routes } from 'react-router-dom';
import { CanvasComponent } from '../components/Canvas/CanvasComponent';
import Home from "../pages/Home";
import Layout from '../pages/Layout';

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/canvas" element={<CanvasComponent />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;