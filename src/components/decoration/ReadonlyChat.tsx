import * as React from "react";
import "./readonly-chat.css";

interface ReadonlyChatProps {
  placeholder?: string;
  placeholderNode?: React.ReactNode;
  tags?: string[];
  width?: number | string;
  className?: string;
  style?: React.CSSProperties;
  height?: number | string;
}

export function ReadonlyChat({
  placeholder = "Imagine Something...✦˚",
  placeholderNode,
  tags = ["Create An Image", "Analyse Data", "More"],
  width = 260,
  className,
  style,
  height = 50,
}: ReadonlyChatProps) {
  const resolvedMaxWidth = typeof width === "number" ? `${width}px` : width;
  const resolvedHeight = typeof height === "number" ? `${height}px` : height;
  return (
    <div
      className={"container_chat_bot" + (className ? ` ${className}` : "")}
      aria-readonly
      style={{ maxWidth: resolvedMaxWidth, ...style }}
    >
      <div className="container-chat-options">
        <div className="chat">
          <div className="chat-bot" style={{ position: 'relative' }}>
            {placeholderNode && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  pointerEvents: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  padding: 16,
                  color: '#f3f6fd',
                  opacity: 0.9,
                }}
              >
                {placeholderNode}
              </div>
            )}
            <textarea
              id="chat_bot"
              name="chat_bot"
              placeholder={placeholderNode ? "" : placeholder}
              readOnly
              style={{ height: resolvedHeight }}
            />
          </div>
          <div className="options">
            <div className="btns-add">
              <button type="button" aria-label="Lock" disabled>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                  <path
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 8v8a5 5 0 1 0 10 0V6.5a3.5 3.5 0 1 0-7 0V15a2 2 0 0 0 4 0V8"
                  />
                </svg>
              </button>
              <button type="button" aria-label="Grid" disabled>
                <svg viewBox="0 0 24 24" height="20" width="20" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M4 5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1zm0 10a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1zm10 0a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1zm0-8h6m-3-3v6"
                    strokeWidth="2"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                  />
                </svg>
              </button>
              <button type="button" aria-label="Globe" disabled>
                <svg viewBox="0 0 24 24" height="20" width="20" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10s-4.477 10-10 10m-2.29-2.333A17.9 17.9 0 0 1 8.027 13H4.062a8.01 8.01 0 0 0 5.648 6.667M10.03 13c.151 2.439.848 4.73 1.97 6.752A15.9 15.9 0 0 0 13.97 13zm9.908 0h-3.965a17.9 17.9 0 0 1-1.683 6.667A8.01 8.01 0 0 0 19.938 13M4.062 11h3.965A17.9 17.9 0 0 1 9.71 4.333A8.01 8.01 0 0 0 4.062 11m5.969 0h3.938A15.9 15.9 0 0 0 12 4.248A15.9 15.9 0 0 0 10.03 11m4.259-6.667A17.9 17.9 0 0 1 15.973 11h3.965a8.01 8.01 0 0 0-5.648-6.667"
                    fill="currentColor"
                  />
                </svg>
              </button>
            </div>
            <button className="btn-submit" type="button" aria-label="Send" disabled>
              <i>
                <svg viewBox="0 0 512 512">
                  <path
                    fill="currentColor"
                    d="M473 39.05a24 24 0 0 0-25.5-5.46L47.47 185h-.08a24 24 0 0 0 1 45.16l.41.13l137.3 58.63a16 16 0 0 0 15.54-3.59L422 80a7.07 7.07 0 0 1 10 10L226.66 310.26a16 16 0 0 0-3.59 15.54l58.65 137.38c.06.2.12.38.19.57c3.2 9.27 11.3 15.81 21.09 16.25h1a24.63 24.63 0 0 0 23-15.46L478.39 64.62A24 24 0 0 0 473 39.05"
                  />
                </svg>
              </i>
            </button>
          </div>
        </div>
      </div>
      <div className="tags">
        {tags.map((t, idx) => (
          <span key={idx}>{t}</span>
        ))}
      </div>
    </div>
  );
}

export default ReadonlyChat;


