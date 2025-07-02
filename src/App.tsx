import { Route, Routes,} from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Layout from "./layouts/Layout";
import Containers from "./pages/Containers";
import CreateContainerForm from "./components/CreateContainerForm";
import ItemsPage from "./pages/ItemsPage";
import AdvertsPage from "./pages/AdvertsPage";
import { AdvertProvider } from './contexts/AdvertContext';

function App() {
  return (
    <div>
      <Layout>
        <AdvertProvider>
        <Routes>
          <Route index element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/containers" element={<Containers />} />
          <Route path="/container-form" element={<CreateContainerForm />} />
          <Route path="/items" element={<ItemsPage />} />
          <Route path="/adverts" element={<AdvertsPage />} />
        </Routes>
        </AdvertProvider>
      </Layout>    
    </div>
  );
}

export default App;
