import ManagerView from "./managerView/ManagerView";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/*" element={<ManagerView />} />
      </Routes>
    </Router>
  );
}

export default App;
