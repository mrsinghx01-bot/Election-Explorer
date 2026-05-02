/**
 * Election Explorer - Core Interactive Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // Loader
  // ==========================================
  const loader = document.getElementById('loader');
  setTimeout(() => {
    loader.classList.add('hidden');
    // Trigger reveals on initial load
    setTimeout(handleScroll, 100);
    animateStats();
  }, 1000);

  // ==========================================
  // Theme Toggle
  // ==========================================
  const themeToggle = document.getElementById('theme-toggle');
  const htmlElement = document.documentElement;
  
  // Check local storage for theme
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    htmlElement.setAttribute('data-theme', savedTheme);
  }

  themeToggle.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  });

  // ==========================================
  // Mobile Menu
  // ==========================================
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navLinks = document.getElementById('nav-links');
  const navItems = document.querySelectorAll('.nav-link');

  mobileMenuBtn.addEventListener('click', () => {
    mobileMenuBtn.classList.toggle('active');
    navLinks.classList.toggle('active');
  });

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      mobileMenuBtn.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });

  // ==========================================
  // Scroll Effects (Navbar, Progress, Reveal)
  // ==========================================
  const navbar = document.getElementById('navbar');
  const scrollProgress = document.getElementById('scroll-progress');
  const revealElements = document.querySelectorAll('.reveal');

  function handleScroll() {
    // Navbar background
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Scroll progress bar
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    scrollProgress.style.width = scrolled + '%';

    // Scroll reveal animation
    const windowHeight = window.innerHeight;
    revealElements.forEach(el => {
      const elementTop = el.getBoundingClientRect().top;
      const elementVisible = 100;
      if (elementTop < windowHeight - elementVisible) {
        el.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', handleScroll);

  // ==========================================
  // Stat Counters Animation
  // ==========================================
  const statNumbers = document.querySelectorAll('.stat-number');
  let statsAnimated = false;

  function animateStats() {
    if (statsAnimated) return;
    statsAnimated = true;

    statNumbers.forEach(stat => {
      const target = parseInt(stat.getAttribute('data-target'));
      const duration = 2000; // ms
      const stepTime = Math.abs(Math.floor(duration / target));
      let current = 0;
      
      const timer = setInterval(() => {
        current += 1;
        stat.innerText = current;
        if (current >= target) {
          clearInterval(timer);
          stat.innerText = target;
        }
      }, stepTime);
    });
  }

  // ==========================================
  // Quiz System
  // ==========================================
  const quizQuestions = [
    {
      q: "What marks the official start of the election process?",
      opts: ["Candidates campaigning", "Announcement by the Election Commission", "Voter registration opens", "Publishing manifestos"],
      ans: 1
    },
    {
      q: "What is the silence period before polling?",
      opts: ["24 hours", "48 hours", "72 hours", "1 week"],
      ans: 1
    },
    {
      q: "What device is used to cast votes securely?",
      opts: ["Paper ballots only", "Internet portal", "Electronic Voting Machine (EVM)", "Mobile App"],
      ans: 2
    },
    {
      q: "What ensures voters that their vote was recorded correctly?",
      opts: ["SMS confirmation", "VVPAT slip", "Election officer receipt", "Ink on finger"],
      ans: 1
    },
    {
      q: "Who forms the government after results?",
      opts: ["The party with most funds", "The oldest candidate", "The party or coalition with a majority", "The Election Commission decides"],
      ans: 2
    }
  ];

  let currentQuestion = 0;
  let score = 0;

  const quizStartBtn = document.getElementById('start-quiz-btn');
  const quizNextBtn = document.getElementById('quiz-next-btn');
  const quizRetryBtn = document.getElementById('quiz-retry-btn');
  const heroQuizBtn = document.getElementById('hero-quiz-btn');
  
  const pnlStart = document.getElementById('quiz-start');
  const pnlActive = document.getElementById('quiz-active');
  const pnlResult = document.getElementById('quiz-result');

  const qNum = document.getElementById('quiz-question-num');
  const qText = document.getElementById('quiz-question');
  const qOpts = document.getElementById('quiz-options');
  const qProgFill = document.getElementById('quiz-progress-fill');
  const qScoreLive = document.getElementById('quiz-score-display');

  function startQuiz() {
    pnlStart.style.display = 'none';
    pnlResult.style.display = 'none';
    pnlActive.style.display = 'block';
    currentQuestion = 0;
    score = 0;
    qScoreLive.innerText = `Score: 0`;
    loadQuestion();
  }

  function loadQuestion() {
    quizNextBtn.style.display = 'none';
    const q = quizQuestions[currentQuestion];
    
    // Update Meta
    qNum.innerText = `Question ${currentQuestion + 1}/${quizQuestions.length}`;
    qProgFill.style.width = `${((currentQuestion) / quizQuestions.length) * 100}%`;
    qText.innerText = q.q;

    // Render Options
    qOpts.innerHTML = '';
    q.opts.forEach((opt, index) => {
      const btn = document.createElement('div');
      btn.className = 'quiz-option';
      btn.innerHTML = `<span>${opt}</span> <span class="opt-indicator"></span>`;
      btn.addEventListener('click', () => selectOption(index, btn));
      qOpts.appendChild(btn);
    });
  }

  function selectOption(selectedIndex, btnElement) {
    // Prevent multiple selections
    if (qOpts.classList.contains('answered')) return;
    qOpts.classList.add('answered');

    const q = quizQuestions[currentQuestion];
    const options = qOpts.querySelectorAll('.quiz-option');

    if (selectedIndex === q.ans) {
      btnElement.classList.add('correct');
      btnElement.querySelector('.opt-indicator').innerHTML = '✓';
      score++;
      qScoreLive.innerText = `Score: ${score}`;
    } else {
      btnElement.classList.add('wrong');
      btnElement.querySelector('.opt-indicator').innerHTML = '✗';
      // Highlight correct answer
      options[q.ans].classList.add('correct');
      options[q.ans].querySelector('.opt-indicator').innerHTML = '✓';
    }

    // Update progress bar to current
    qProgFill.style.width = `${((currentQuestion + 1) / quizQuestions.length) * 100}%`;
    quizNextBtn.style.display = 'inline-flex';
  }

  function nextQuestion() {
    qOpts.classList.remove('answered');
    currentQuestion++;
    if (currentQuestion < quizQuestions.length) {
      loadQuestion();
    } else {
      showResults();
    }
  }

  function showResults() {
    pnlActive.style.display = 'none';
    pnlResult.style.display = 'block';
    
    document.getElementById('quiz-result-score').innerText = `${score}/${quizQuestions.length}`;
    const txt = document.getElementById('quiz-result-text');
    const icon = document.getElementById('quiz-result-icon');
    
    if (score === quizQuestions.length) {
      txt.innerText = "Perfect! You're an expert on the democratic process.";
      icon.innerText = "👑";
    } else if (score >= quizQuestions.length / 2) {
      txt.innerText = "Good job! You have a solid understanding of elections.";
      icon.innerText = "🌟";
    } else {
      txt.innerText = "Keep learning! Democracy is a complex but fascinating process.";
      icon.innerText = "📚";
    }
  }

  quizStartBtn.addEventListener('click', startQuiz);
  heroQuizBtn.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('quiz').scrollIntoView({ behavior: 'smooth' });
    if(pnlStart.style.display !== 'none') startQuiz();
  });
  quizNextBtn.addEventListener('click', nextQuestion);
  quizRetryBtn.addEventListener('click', startQuiz);

  // ==========================================
  // Scenario Simulator
  // ==========================================
  const simData = {
    hung: {
      title: "Hung Parliament",
      icon: "⚖️",
      desc: "No single party has achieved the absolute majority required to form the government.",
      steps: [
        "President/Governor invites the leader of the single largest party.",
        "They are given a timeframe to prove their majority on the floor of the house.",
        "If they fail, the next largest party or coalition is invited.",
        "If no stable government is formed, fresh elections may be called."
      ]
    },
    recount: {
      title: "Recount Demanded",
      icon: "🔁",
      desc: "A candidate disputes the vote count due to narrow margins or suspected irregularities.",
      steps: [
        "Candidate submits a formal written request to the Returning Officer.",
        "The Returning Officer evaluates the validity of the request.",
        "If approved, a recount is conducted under strict observation.",
        "The final declared result post-recount is binding, though courts can intervene later."
      ]
    },
    coalition: {
      title: "Coalition Formation",
      icon: "🤝",
      desc: "Multiple smaller parties join forces to cross the majority mark.",
      steps: [
        "Parties draft a 'Common Minimum Programme' outlining shared goals.",
        "Leaders negotiate cabinet portfolios and ministerial positions.",
        "The coalition stakes a claim to form the government.",
        "The coalition must pass a floor test to prove confidence."
      ]
    },
    emergency: {
      title: "Election Disruption",
      icon: "🚨",
      desc: "A natural disaster, violence, or severe disruption occurs during polling.",
      steps: [
        "Presiding officer halts polling and secures the EVMs.",
        "A detailed report is sent to the Election Commission.",
        "The EC assesses the situation and may declare polling void at that station.",
        "A date for repolling is announced for the affected areas."
      ]
    }
  };

  const simBtns = document.querySelectorAll('.sim-btn');
  const simModal = document.getElementById('sim-modal');
  const simClose = document.getElementById('sim-modal-close');

  simBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.getAttribute('data-sim');
      const data = simData[type];
      
      document.getElementById('sim-modal-icon').innerText = data.icon;
      document.getElementById('sim-modal-title').innerText = data.title;
      document.getElementById('sim-modal-body').innerText = data.desc;
      
      const stepsContainer = document.getElementById('sim-modal-steps');
      stepsContainer.innerHTML = '';
      data.steps.forEach((step, idx) => {
        const d = document.createElement('div');
        d.className = 'step';
        d.innerHTML = `<span class="step-num">${idx + 1}.</span> <span>${step}</span>`;
        stepsContainer.appendChild(d);
      });

      simModal.classList.add('active');
    });
  });

  simClose.addEventListener('click', () => simModal.classList.remove('active'));
  simModal.addEventListener('click', (e) => {
    if (e.target === simModal) simModal.classList.remove('active');
  });

  // ==========================================
  // Chatbot System
  // ==========================================
  const botTrigger = document.getElementById('chatbot-trigger');
  const botClose = document.getElementById('chatbot-close');
  const chatbot = document.getElementById('chatbot');
  const botInput = document.getElementById('chatbot-input');
  const botSend = document.getElementById('chatbot-send');
  const botMessages = document.getElementById('chatbot-messages');
  const suggestionChips = document.querySelectorAll('.suggestion-chip');

  const botResponses = [
    { keywords: ['voting', 'vote', 'ballot'], reply: 'Voting is the process where citizens choose their representatives. You must be registered and 18+ years old to vote.' },
    { keywords: ['evm', 'machine', 'electronic'], reply: 'EVM stands for Electronic Voting Machine. It records votes securely without paper. VVPAT provides a printed paper slip for verification.' },
    { keywords: ['process', 'stages', 'steps'], reply: 'The process includes: Announcement, Nomination, Campaigning, Polling Day, Counting, and Government Formation.' },
    { keywords: ['count', 'results', 'win'], reply: 'Votes are counted under heavy security at designated centres. The candidate with the highest number of votes in a constituency wins.' },
    { keywords: ['hello', 'hi', 'hey'], reply: 'Hello! I am DemoBot. Ask me anything about the election process, voting, or EVMs!' }
  ];

  const defaultReply = "I'm not entirely sure about that. Try asking about 'voting', 'EVMs', or the 'election process'.";

  function toggleBot() {
    chatbot.classList.toggle('active');
    if (chatbot.classList.contains('active') && botMessages.children.length === 0) {
      addBotMessage("Hi there! 👋 I'm your Election Assistant. How can I help you understand democracy today?");
    }
  }

  botTrigger.addEventListener('click', toggleBot);
  botClose.addEventListener('click', toggleBot);

  function addUserMessage(text) {
    const msg = document.createElement('div');
    msg.className = 'chat-bubble user-msg';
    msg.innerText = text;
    botMessages.appendChild(msg);
    scrollToBottom();
  }

  function addBotMessage(text) {
    const msg = document.createElement('div');
    msg.className = 'chat-bubble bot-msg';
    msg.innerText = text;
    botMessages.appendChild(msg);
    scrollToBottom();
  }

  function showTyping() {
    const typing = document.createElement('div');
    typing.className = 'typing-indicator';
    typing.id = 'typing-indicator';
    typing.innerHTML = `<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>`;
    botMessages.appendChild(typing);
    scrollToBottom();
  }

  function removeTyping() {
    const typing = document.getElementById('typing-indicator');
    if (typing) typing.remove();
  }

  function scrollToBottom() {
    botMessages.scrollTop = botMessages.scrollHeight;
  }

  function processUserInput(text) {
    if (!text.trim()) return;
    
    addUserMessage(text);
    botInput.value = '';
    showTyping();

    setTimeout(() => {
      removeTyping();
      const lowerText = text.toLowerCase();
      let reply = defaultReply;

      for (let item of botResponses) {
        if (item.keywords.some(kw => lowerText.includes(kw))) {
          reply = item.reply;
          break;
        }
      }
      addBotMessage(reply);
    }, 1000 + Math.random() * 1000); // 1-2 sec delay
  }

  botSend.addEventListener('click', () => processUserInput(botInput.value));
  botInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') processUserInput(botInput.value);
  });

  suggestionChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const q = chip.getAttribute('data-q');
      processUserInput(q);
    });
  });

  // ==========================================
  // Premium Particle Background Canvas
  // ==========================================
  const canvas = document.getElementById('particles-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  const emojis = ['🗳️', '✅', '📜', '⭐', '🇮🇳'];

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 15 + 10; // Emoji size
      this.speedX = Math.random() * 0.4 - 0.2;
      this.speedY = Math.random() * -0.5 - 0.2; // Float upwards mostly
      this.opacity = Math.random() * 0.3 + 0.1;
      this.emoji = emojis[Math.floor(Math.random() * emojis.length)];
      this.rotation = Math.random() * 360;
      this.rotSpeed = Math.random() * 2 - 1;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.rotation += this.rotSpeed;

      if (this.x > canvas.width + 20) this.x = -20;
      if (this.x < -20) this.x = canvas.width + 20;
      if (this.y > canvas.height + 20) this.y = -20;
      if (this.y < -20) this.y = canvas.height + 20;
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation * Math.PI / 180);
      ctx.globalAlpha = this.opacity;
      ctx.font = `${this.size}px Arial`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(this.emoji, 0, 0);
      ctx.restore();
    }
  }

  function initParticles() {
    particles = [];
    const count = window.innerWidth < 768 ? 30 : 70;
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animateParticles);
  }

  initParticles();
  animateParticles();

  // Float Cards Click to Scroll
  const floatCards = document.querySelectorAll('.float-card');
  floatCards.forEach(card => {
    card.addEventListener('click', () => {
      let targetStage = 1;
      if (card.classList.contains('fc-1')) targetStage = 2; // Register -> Nomination (Stage 2)
      if (card.classList.contains('fc-2')) targetStage = 3; // Campaign -> Stage 3
      if (card.classList.contains('fc-3')) targetStage = 4; // Vote -> Stage 4
      if (card.classList.contains('fc-4')) targetStage = 5; // Results -> Stage 5
      
      const targetEl = document.querySelector(`.stage-card[data-stage="${targetStage}"]`);
      if (targetEl) {
        const y = targetEl.getBoundingClientRect().top + window.pageYOffset - 120;
        window.scrollTo({ top: y, behavior: 'smooth' });
        
        targetEl.classList.add('highlight-pulse');
        setTimeout(() => targetEl.classList.remove('highlight-pulse'), 1500);
      }
    });
  });

  // Mouse Parallax for Hero Visual
  const heroCardStack = document.querySelector('.hero-card-stack');
  if (heroCardStack) {
    document.addEventListener('mousemove', (e) => {
      const x = (window.innerWidth / 2 - e.pageX) / 80;
      const y = (window.innerHeight / 2 - e.pageY) / 80;
      heroCardStack.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
    });
  }
});
