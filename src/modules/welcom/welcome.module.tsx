import { ReactNode, useCallback } from "react";
import { useNavigate } from "react-router";
import languageService from "../../services/language.service";
import logo from "../../assets/logo.svg";
import "./welcome-module.css";

const lang = languageService.dictionary;
const welcomeModuleLang = lang.title.module.welcome;

export default function IndexModule(): ReactNode {
  const navigate = useNavigate();
  const startBtn = useCallback(() => navigate("/topics"), []);

  return (
    <div className="welcom-sceen">
      <div>
        <h1>
          MENT{<img src={logo} className="logo react" alt="React logo" />}R
        </h1>
      </div>
      <div className="card">
        <p>{welcomeModuleLang.mainTitle}</p>
        <button onClick={startBtn}>{welcomeModuleLang.startButton}</button>
      </div>
    </div>
  );
}
