import { useEffect, useState } from "react";
import "./Global.css";
import { CHAT_STORAGE, GLOBAL_SETTING } from "../constants/storage";

const MessageStorage = () => {
  const [storage, setStorage] = useState<string[]>([]);
  const [text, setText] = useState<string>("");
  const [showCopied, setShowCopied] = useState<boolean>(false);

  // 저장되어있는 storage 불러오기
  useEffect(() => {
    chrome.storage.local.get([CHAT_STORAGE], (res) => {
      if (res[CHAT_STORAGE]) {
        setStorage(res[CHAT_STORAGE]);
      }
    });
  });

  // 메세지 클립보드에 복사
  const copyMessage = (data: string) => {
    setShowCopied(true);
    navigator.clipboard.writeText(data).then(() => {});
  };

  // 메세지 추가로 저장
  const addMessage = () => {
    if (text.replaceAll(" ", "").length == 0) return;

    setStorage([...storage, text]);
    setText("");
    chrome.storage.local.set({
      [CHAT_STORAGE]: [...storage, text],
    });
  };

  // 메세지 삭제
  const removeMessage = (idx: number) => {
    const temp = [...storage.slice(0, idx), ...storage.slice(idx + 1)];
    setStorage(temp);
    chrome.storage.local.set({
      [CHAT_STORAGE]: temp,
    });
  };

  useEffect(() => {
    let timeoutId: number;

    if (showCopied) {
      timeoutId = setTimeout(() => {
        setShowCopied(false);
      }, 1000);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [showCopied]);

  return (
    <>
      <h2 className="czp-storage-heading">채팅 저장소</h2>
      <div className="czp-storage-form">
        <input
          type="text"
          className="czp-storage-form-input"
          placeholder="저장할 채팅을 입력하세요."
          value={text}
          onChange={(e) => {
            setText(e.target.value);
          }}
        ></input>
        <button
          type="button"
          className="czp-storage-form-btn"
          onClick={addMessage}
        >
          저장
        </button>
      </div>
      <div className="czp-storage">
        {storage.map((data, idx) => (
          <div
            className="czp-chat-st-btn"
            key={`${data}-${idx}`}
            onClick={() => {
              copyMessage(data);
            }}
          >
            {data}
            <button
              type="button"
              className="czp-chat-st-remove-btn"
              key={`${data}-${idx}`}
              onClick={(e) => {
                e.preventDefault;
                removeMessage(idx);
              }}
            >
              X
            </button>
          </div>
        ))}
      </div>
      {showCopied && <div className="czp-storage-message">복사되었습니다.</div>}
    </>
  );
};

export default function Global() {
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    chrome.storage.onChanged.addListener((changes) => {
      for (const key in changes) {
        const storageChange = changes[key];
        if (GLOBAL_SETTING === key) {
          setOpen(storageChange.newValue);
        }
      }
    });

    chrome.storage.local.get([GLOBAL_SETTING], (res) => {
      if (res[GLOBAL_SETTING]) {
        setOpen(res[GLOBAL_SETTING]);
      }
    });
  }, []);

  return (
    <>
      {open && (
        <div className="czp-global">
          <button
            className="czp-global-close-btn"
            onClick={() => {
              chrome.storage.local.set({
                [GLOBAL_SETTING]: false,
              });
            }}
          >
            X
          </button>
          <MessageStorage />
        </div>
      )}
    </>
  );
}
