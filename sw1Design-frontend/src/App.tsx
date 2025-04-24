import AppRoutes from './Routes/AppRoutes';

function App() {
  return (
    <div className="App">
      <div id="root" className="flex-1 flex flex-col overflow-x-hidden">
        <AppRoutes />
      </div>
    </div>
  );
}

export default App;