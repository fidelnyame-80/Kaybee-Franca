const pieces = Array.from({ length: 64 }, (_, i) => ({
  left: `${(i * 37.7 + 9) % 100}%`,
  drift: `${(i % 2 ? 1 : -1) * (15 + (i * 13) % 70)}px`,
  rotation: `${(i * 43) % 360}deg`,
  color: ["#ef4286", "#eebd4c", "#9b204b", "#f48b39", "#d65381", "#c94e09"][i % 6],
}));

export default function InvitationConfetti() {
  return <div className="invitation-confetti" aria-hidden="true">
    {pieces.map((piece, i) => <span key={i} className="invitation-confetti__piece" style={{
      left: piece.left,
      backgroundColor: piece.color,
      ["--confetti-drift" as string]: piece.drift,
      ["--confetti-rotation" as string]: piece.rotation,
    }} />)}
  </div>;
}
