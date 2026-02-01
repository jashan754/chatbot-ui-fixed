
  import { createRoot } from "react-dom/client";
  import App from "./app/App.tsx";
  import "./styles/index.css";
  import { ChatBot } from '@/app/components/ChatBot';
  createRoot(document.getElementById("root")!).render(<ChatBot />);
  



