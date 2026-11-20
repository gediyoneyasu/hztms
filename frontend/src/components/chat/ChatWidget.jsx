import { useEffect, useRef, useState } from 'react';
import ChatBubble from './ChatBubble.jsx';
import './ChatWidget.css';

const initial = [
  {
    from: 'bot',
    text:
      'Hi! Ask me about routes, fares, departure times or station notices. / ሰላም! ስለ መስመሮች፣ ዋጋ እና የጉዞ ሰዓት ይጠይቁኝ።',
  },
];

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState(initial);
  const [input, setInput] = useState('');
  const msgsRef = useRef(null);

  useEffect(() => {
    if (msgsRef.current) {
      msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
    }
  }, [msgs, open]);

  const send = (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    setMsgs((prev) => [...prev, { from: 'me', text }]);
    setInput('');

    setTimeout(() => {
      const replies = [
        'Thanks for your message! Our team will respond shortly.',
        'For immediate help, please call +251 46 000 0000.',
        'You can check live schedules on the Schedules page.',
      ];
      const reply = replies[Math.floor(Math.random() * replies.length)];
      setMsgs((prev) => [...prev, { from: 'bot', text: reply }]);
    }, 700);
  };

  return (
    <>
      <button
        className="fab"
        aria-label="Open travel assistant"
        onClick={() => setOpen((v) => !v)}
      >
        💬
      </button>

      {open && (
        <div className="chat">
          <div className="ch">
            <div>
              <b>Travel Assistant</b>
              <div className="ch-sub">English · አማርኛ</div>
            </div>
            <button className="ibtn" onClick={() => setOpen(false)}>✕</button>
          </div>

          <div className="msgs" ref={msgsRef}>
            {msgs.map((m, i) => (
              <ChatBubble key={i} from={m.from} text={m.text} />
            ))}
          </div>

          <form className="chat-form" onSubmit={send}>
            <input
              className="field"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question…"
            />
            <button className="btn btn-dark" type="submit">➤</button>
          </form>
        </div>
      )}
    </>
  );
}
