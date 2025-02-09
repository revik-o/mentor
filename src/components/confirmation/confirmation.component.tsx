import { ReactNode } from "react";
import languageService from "../../services/language.service";

const lang = languageService.dictionary;
const genericLang = lang.title.generic;

interface Properties extends React.HTMLAttributes<HTMLDivElement> {
  onYes: () => void;
  onNo: () => void;
}

export default function ConfirmationComponent({
  onYes,
  onNo,
}: Readonly<Properties>): ReactNode {
  return (
    <div className="confirmation-dialog">
      <header>
        <h2>{genericLang.areYouShure}</h2>
      </header>
      <footer>
        <button onClick={onYes}>{genericLang.yes}</button>
        <button onClick={onNo}>{genericLang.no}</button>
      </footer>
    </div>
  );
}
