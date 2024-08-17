"use client"

import {
  FaA,
  FaB,
  FaC,
  FaD,
  FaE,
  FaF,
  FaG,
  FaH,
  FaI,
  FaJ,
  FaK,
  FaL,
  FaM,
  FaN,
  FaO,
  FaP,
  FaQ,
  FaR,
  FaS,
  FaT,
  FaU,
  FaV,
  FaW,
  FaX,
  FaY,
  FaZ,
} from "react-icons/fa6"

const lettersToIcons = {
  A: FaA,
  B: FaB,
  C: FaC,
  D: FaD,
  E: FaE,
  F: FaF,
  G: FaG,
  H: FaH,
  I: FaI,
  J: FaJ,
  K: FaK,
  L: FaL,
  M: FaM,
  N: FaN,
  O: FaO,
  P: FaP,
  Q: FaQ,
  R: FaR,
  S: FaS,
  T: FaT,
  U: FaU,
  V: FaV,
  W: FaW,
  X: FaX,
  Y: FaY,
  Z: FaZ,
}

export function LetterIcon({
  letter,
  ...props
}: { letter: string } & React.ComponentProps<typeof FaA>) {
  const Comp =
    lettersToIcons[letter.toUpperCase() as keyof typeof lettersToIcons] ??
    (() => null)
  return <Comp {...props} />
}
