const form = document.querySelector('#chat-form');
const input = document.querySelector('#message');
const conversation = document.querySelector('#conversation');
const sendButton = document.querySelector('#send');
const notice = document.querySelector('#notice');
const welcome = document.querySelector('#welcome');
const csrfToken = document.querySelector('meta[name="csrf-token"]').content;
let history = [];
let busy = false;

function addMessage(name, text, isUser = false) {
  welcome?.remove();
  const node = document.querySelector('#message-template').content.cloneNode(true);
  const article = node.querySelector('.message');
  if (isUser) article.classList.add('user-message');
  node.querySelector('.avatar').textContent = isUser ? 'คุณ' : '✦';
  node.querySelector('.message-name').textContent = name;
  node.querySelector('.message-text').textContent = text;
  conversation.append(node);
  conversation.scrollTop = conversation.scrollHeight;
}

function setBusy(value) {
  busy = value;
  sendButton.disabled = value;
  document.querySelector('#council').disabled = value;
  input.disabled = value;
  sendButton.textContent = value ? '…' : '↑';
}

async function sendMessage(text, council = false) {
  if (busy || !text.trim()) return;
  notice.textContent = '';
  const clean = text.trim();
  addMessage('คุณ', clean, true);
  const requestHistory = [...history, { role: 'user', content: clean }];
  history = requestHistory;
  setBusy(true);
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken },
      body: JSON.stringify({ messages: requestHistory, agent: document.querySelector('#agent').value, council })
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'เกิดข้อผิดพลาด กรุณาลองใหม่');
    if (council) {
      const wrapper = document.createElement('section');
      wrapper.className = 'council-results';
      for (const agent of result.council || []) {
        const card = document.querySelector('#council-template').content.cloneNode(true);
        card.querySelector('h3').textContent = agent.name;
        card.querySelector('pre').textContent = agent.text;
        wrapper.append(card);
      }
      conversation.append(wrapper);
      conversation.scrollTop = conversation.scrollHeight;
    } else {
      addMessage(result.agent || 'Solar', result.answer);
      history.push({ role: 'assistant', content: result.answer });
      history = history.slice(-12);
    }
  } catch (error) {
    notice.textContent = error.message;
  } finally {
    setBusy(false);
    input.focus();
  }
}

form.addEventListener('submit', event => {
  event.preventDefault();
  const text = input.value;
  input.value = '';
  input.style.height = 'auto';
  sendMessage(text);
});
input.addEventListener('input', () => {
  input.style.height = 'auto';
  input.style.height = `${Math.min(input.scrollHeight, 180)}px`;
});
input.addEventListener('keydown', event => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    form.requestSubmit();
  }
});
document.querySelector('#council').addEventListener('click', () => {
  if (history.length) sendMessage(history.at(-1).content, true);
  else notice.textContent = 'ส่งคำถามก่อน แล้วจึงถามทีมทั้ง 10 Agent ได้';
});
document.querySelectorAll('[data-prompt]').forEach(button => button.addEventListener('click', () => {
  input.value = button.dataset.prompt;
  input.focus();
}));
