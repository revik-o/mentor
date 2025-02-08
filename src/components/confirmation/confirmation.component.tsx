import { ReactNode } from "react";

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
        <h2>!!!TODO!!! Are you shure?</h2>
      </header>
      <footer>
        <button onClick={onYes}>!!!TODO!!! Yes</button>
        <button onClick={onNo}>!!!TODO!!! No</button>
      </footer>
    </div>
  );
}
