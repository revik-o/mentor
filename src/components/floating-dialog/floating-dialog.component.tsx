import { ReactNode } from "react";
import "./floating-dialog-component.css";

interface Properties extends React.HTMLAttributes<HTMLDivElement> {
  showDialog: boolean;
  children?: ReactNode;
}

export default function FloatingDialogComponent({
  showDialog,
  children,
  ...attr
}: Readonly<Properties>): ReactNode {
  attr.className =
    (attr.className ? `${attr.className} ` : "") + "floating-dialog";

  return (
    <>
      {showDialog && (
        <div className="floating-dialog-background">
          <div {...attr}>{children}</div>
        </div>
      )}
    </>
  );
}
