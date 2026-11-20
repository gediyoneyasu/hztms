export default function ChatBubble({ from, text }) {
  return <div className={`bub ${from === 'me' ? 'me' : ''}`}>{text}</div>;
}
