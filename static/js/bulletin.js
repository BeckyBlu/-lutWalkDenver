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

    const avatar = document.createElement('div');
    avatar.className = 'avatar';
    avatar.textContent = sender.charAt(0).toUpperCase() + (sender.charAt(1) || '');

    const bubble = document.createElement('div');
    bubble.className = 'bubble';

    const h4 = document.createElement('h4');
    h4.textContent = sender;

    const p = document.createElement('p');
    p.textContent = text;

    const small = document.createElement('small');
    small.textContent = timeStamp();

    bubble.appendChild(h4);
    bubble.appendChild(p);
    bubble.appendChild(small);
    message.appendChild(avatar);
    message.appendChild(bubble);

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

    const header = document.createElement('div');
    header.className = 'thread-header';
    const strong = document.createElement('strong');
    strong.textContent = 'Anonymous';
    header.appendChild(strong);
    header.appendChild(document.createTextNode(` • ${timeStamp()}`));

    const body = document.createElement('div');
    body.className = 'thread-body';

    const h3 = document.createElement('h3');
    h3.textContent = title;
    body.appendChild(h3);

    if (imageSrc) {
      const img = document.createElement('img');
      img.src = imageSrc;
      img.alt = 'Thread image';
      body.appendChild(img);
    }

    const p = document.createElement('p');
    p.textContent = text;
    body.appendChild(p);

    const repliesEl = document.createElement('div');
    repliesEl.className = 'replies';
    body.appendChild(repliesEl);

    const replyForm = document.createElement('div');
    replyForm.className = 'reply-form';

    const label = document.createElement('label');
    label.className = 'sr-only';
    label.htmlFor = replyId;
    label.textContent = 'Write a reply';

    const textarea = document.createElement('textarea');
    textarea.id = replyId;
    textarea.rows = 3;
    textarea.placeholder = 'Write a reply...';

    const replyBtn = document.createElement('button');
    replyBtn.type = 'button';
    replyBtn.textContent = 'Reply';

    replyForm.appendChild(label);
    replyForm.appendChild(textarea);
    replyForm.appendChild(replyBtn);

    thread.appendChild(header);
    thread.appendChild(body);
    thread.appendChild(replyForm);

    replyBtn.addEventListener('click', () => {
      const value = textarea.value.trim();
      if (!value) return;

      const reply = document.createElement('div');
      reply.className = 'reply';

      const small = document.createElement('small');
      small.textContent = `Anonymous • ${timeStamp()}`;

      const content = document.createElement('div');
      content.textContent = value;

      reply.appendChild(small);
      reply.appendChild(content);
      repliesEl.appendChild(reply);
      textarea.value = '';
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