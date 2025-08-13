import './button.css'
import type { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

interface Properties extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  name: string;
}

export default function MentorButton({ name, className, ...props }: Readonly<Properties>) {
  return <button className={`mentor-button ${className || ''}`} {...props}>
    {name}
  </button>
}
