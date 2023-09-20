import App from "./components/App.js"
import { createRoot } from 'react-dom/client';
import React from "react";

const container = document.getElementById('root');
  const root = createRoot(container); // createRoot(container!) if you use TypeScript
 root.render(<App/>)
  root.render(<App tab="home" />);