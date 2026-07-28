(() => {
  const threadsEl = document.getElementById('threads');
  const chatWindow = document.getElementById('chatWindow');
  const messageInput = document.getElementById('messageInput');
  const sendBtn = document.getElementById('sendBtn');
  const postThreadBtn = document.getElementById('postThread');
  const threadTitleInput = document.getElementById('threadTitle');
  const threadTextInput = document.getElementById('threadText');
  const threadImageInput = document.getElementById('threadImage');

  function timeStamp() {
    return new Date().toLocaleString();
  }

  function appendChatMessage(sender, text, sent = false) {
    const message = document.createElement('div');
    message.className = `message ${sent ? 'sent' : 'received'}`;
    message.innerHTML = `
      <div class="avatar">${sender.charAt(0).toUpperCase()}${sender.charAt(1) || ''}</div>
      <div class="bubble">
        <h4>${sender}</h4>
        <p>${text.replace(/\n/g, '<br>')}</p>
        <small>${timeStamp()}</small>
      </div>
    `;

    chatWindow.appendChild(message);
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }

  function sendChatMessage() {
    const value = messageInput.value.trim();
    if (!value) return;

    appendChatMessage('You', value, true);
    messageInput.value = '';
  }

  sendBtn.addEventListener('click', sendChatMessage);
  messageInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendChatMessage();
    }
  });

  function createThread(title, text, imageSrc) {
    const thread = document.createElement('article');
    thread.className = 'thread';
    const replyId = `reply-${Date.now()}`;

    thread.innerHTML = `
      <div class="thread-header">
        <strong>Anonymous</strong> • ${timeStamp()}
      </div>
      <div class="thread-body">
        <h3>${title}</h3>
        ${imageSrc ? `<img src="${imageSrc}" alt="Thread image">` : ''}
        <p>${text.replace(/\n/g, '<br>')}</p>

        <div class="replies"></div>
      </div>

      <div class="reply-form">
        <label class="sr-only" for="${replyId}">Write a reply</label>
        <textarea id="${replyId}" rows="3" placeholder="Write a reply..."></textarea>
        <button type="button">Reply</button>
      </div>
    `;

    const replyBtn = thread.querySelector('.reply-form button');
    const replyInput = thread.querySelector('.reply-form textarea');
    const replies = thread.querySelector('.replies');

    replyBtn.addEventListener('click', () => {
      const value = replyInput.value.trim();
      if (!value) return;

      const reply = document.createElement('div');
      reply.className = 'reply';
      reply.innerHTML = `
        <small>Anonymous • ${timeStamp()}</small>
        <div>${value.replace(/\n/g, '<br>')}</div>
      `;

      replies.appendChild(reply);
      replyInput.value = '';
    });

    threadsEl.prepend(thread);
  }

  postThreadBtn.addEventListener('click', () => {
    const title = threadTitleInput.value.trim();
    const text = threadTextInput.value.trim();
    const file = threadImageInput.files[0];

    if (!title || !text) return;

    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => createThread(title, text, event.target.result);
      reader.readAsDataURL(file);
    } else {
      createThread(title, text, '');
    }

    threadTitleInput.value = '';
    threadTextInput.value = '';
    threadImageInput.value = '';
  });

  createThread(
    'Welcome to the community board',
    'Use this space for organizing, resources, event planning, and respectful discussion.',
    ''
  );
})();