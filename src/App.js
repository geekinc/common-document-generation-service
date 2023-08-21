// src/App.js
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import SearchForm from './SearchForm';
import ClientForm from "./ClientForm";


const App = () => {
  return (
      <div className="App" style={{backgroundColor: "#f2f7fa"}}>
        {/*<SearchForm />*/}
        <ClientForm />
      </div>
  );
};

export default App;
