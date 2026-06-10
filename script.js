// User Data
let userData = {
    xp: 1240,
    level: 12,
    streak: 7,
    learnedWords: 342,
    achievements: ["First Lesson", "7 Day Streak"],
    favorites: []
};

// Sample Vocabulary (A1 - expandable)
const vocabularyDB = {
    "A1": [
        {id:1, word:"Apple", trans:"ვაშლი", pron:"/ˈæp.əl/", ex:"I eat an apple every day.", gex:"მე ყოველდღე ვჭამ ვაშლს."},
        {id:2, word:"Book", trans:"წიგნი", pron:"/bʊk/", ex:"This is my favorite book.", gex:"ეს ჩემი საყვარელი წიგნია."},
        {id:3, word:"Water", trans:"წყალი", pron:"/ˈwɔː.tər/", ex:"Drink water every day.", gex:"დალიე წყალი ყოველდღე."},
        {id:4, word:"House", trans:"სახლი", pron:"/haʊs/", ex:"My house is big.", gex:"ჩემი სახლი დიდია."},
        {id:5, word:"Teacher", trans:"მასწავლებელი", pron:"/ˈtiː.tʃər/", ex:"The teacher is kind.", gex:"მასწავლებელი კეთილია."},
        {id:6, word:"Family", trans:"ოჯახი", pron:"/ˈfæm.ə.li/", ex:"I love my family.", gex:"მე მიყვარს ჩემი ოჯახი."},
        // ... შეგიძლია გააგრძელო 300+ სიტყვამდე
    ],
    "A2": [
        {id:101, word:"Shopping", trans:"საყიდლები", pron:"/ˈʃɒp.ɪŋ/", ex:"I go shopping on weekends.", gex:"შაბათ-კვირას საყიდლებზე დავდივარ."}
    ]
    // შეგიძლია დაამატო დანარჩენი დონეები
};

const grammarDB = [
    {
        title: "Present Simple",
        en: "Used for habits, facts and routines.",
        ka: "გამოიყენება ჩვევების, ფაქტებისა და ყოველდღიური მოქმედებებისთვის.",
        examples: ["I go to school every day.", "She works in Tbilisi."],
        gexamples: ["მე ყოველდღე დავდივარ სკოლაში.", "ის თბილისში მუშაობს."]
    }
];

let currentWord = null;
let currentLevel = "A1";

// Navigation
function navigate(page) {
    document.querySelectorAll('section').forEach(s => s.classList.add('hidden'));
    document.getElementById(page).classList.remove('hidden');

    if (page === 'levels') renderLevels();
    if (page === 'vocabulary') loadVocab();
    if (page === 'grammar') renderGrammar();
    if (page === 'quiz') startRandomQuiz();
    if (page === 'profile') renderProfile();
}

// Render Levels
function renderLevels() {
    const container = document.getElementById('levels-container');
    container.innerHTML = `
        <div class="glass rounded-3xl p-8 card cursor-pointer" onclick="startLevel('A1')">
            <h3 class="text-3xl font-bold text-emerald-400">A1 Beginner</h3>
            <p class="mt-4">Greetings, Numbers, Family, Colors...</p>
        </div>
        <div class="glass rounded-3xl p-8 card cursor-pointer" onclick="startLevel('A2')">
            <h3 class="text-3xl font-bold text-teal-400">A2 Elementary</h3>
            <p class="mt-4">Shopping, Travel, Weather...</p>
        </div>
    `;
}

function startLevel(level) {
    currentLevel = level;
    navigate('vocabulary');
}

// Vocabulary
function loadVocab() {
    const container = document.getElementById('vocab-grid');
    container.innerHTML = '';
    const words = vocabularyDB[currentLevel] || vocabularyDB["A1"];

    words.forEach(w => {
        const div = document.createElement('div');
        div.className = "glass rounded-3xl p-6 card cursor-pointer";
        div.innerHTML = `
            <h4 class="text-2xl font-semibold">${w.word}</h4>
            <p class="text-emerald-400 text-xl mt-2">${w.trans}</p>
            <p class="text-zinc-400 text-sm">${w.pron}</p>
        `;
        div.onclick = () => showWord(w);
        container.appendChild(div);
    });
}

function showWord(word) {
    currentWord = word;
    document.getElementById('modal-body').innerHTML = `
        <h2 class="text-5xl font-bold">${word.word}</h2>
        <p class="text-3xl text-emerald-400 mt-4">${word.trans}</p>
        <p class="font-mono mt-2">${word.pron}</p>
        <div class="mt-8">
            <p class="font-medium">Example:</p>
            <p class="italic">"${word.ex}"</p>
            <p class="text-zinc-400 mt-2">"${word.gex}"</p>
        </div>
    `;
    document.getElementById('word-modal').classList.remove('hidden');
}

function closeWordModal() {
    document.getElementById('word-modal').classList.add('hidden');
}

function speakWord() {
    if (!currentWord) return;
    const utterance = new SpeechSynthesisUtterance(currentWord.word);
    utterance.lang = 'en-GB';
    speechSynthesis.speak(utterance);
}

// Grammar
function renderGrammar() {
    const container = document.getElementById('grammar-container');
    container.innerHTML = grammarDB.map(g => `
        <div class="glass rounded-3xl p-8">
            <h3 class="text-3xl font-bold">${g.title}</h3>
            <p class="mt-4"><strong>EN:</strong> ${g.en}</p>
            <p class="mt-2"><strong>KA:</strong> ${g.ka}</p>
            <div class="mt-6">
                <p class="font-medium">Examples:</p>
                ${g.examples.map((e,i) => `<p class="mt-1">${e} → ${g.gexamples[i]}</p>`).join('')}
            </div>
        </div>
    `).join('');
}

// Quiz
function startRandomQuiz() {
    const qa = [
        {q: "What is 'ვაშლი' in English?", a: "Apple"},
        {q: "Choose: She ___ to school.", options: ["go", "goes", "going"], a: "goes"}
    ];
    let index = 0;

    function render() {
        const q = qa[index];
        document.getElementById('quiz-area').innerHTML = `
            <h3 class="text-2xl mb-8">${q.q}</h3>
            ${q.options ? q.options.map(opt => `
                <button onclick="checkAnswer('${opt}', '${q.a}')" class="block w-full text-left p-5 mb-4 rounded-2xl border border-zinc-700 hover:border-emerald-500">${opt}</button>
            `).join('') : `<input id="quiz-input" class="w-full p-5 rounded-2xl bg-zinc-900" placeholder="Type answer...">
            <button onclick="checkAnswer(document.getElementById('quiz-input').value, '${q.a}')" class="mt-4 px-8 py-4 bg-emerald-500 rounded-2xl">Submit</button>`}
        `;
    }
    render();
}

function checkAnswer(selected, correct) {
    if (selected.toLowerCase() === correct.toLowerCase()) {
        userData.xp += 20;
        alert("✅ Correct! +20 XP");
    } else {
        alert(`❌ Wrong. Correct: ${correct}`);
    }
    renderProfile();
}

// Daily Challenge
function startDailyChallenge() {
    alert("Daily Challenge Started!\n\n+100 XP\nStreak increased!");
    userData.xp += 100;
    userData.streak++;
    renderProfile();
}

function renderProfile() {
    document.getElementById('xp-display').textContent = userData.xp;
    document.getElementById('level-display').textContent = userData.level;
    document.getElementById('streak-display').textContent = userData.streak + " 🔥";
}

// Init
document.addEventListener('DOMContentLoaded', () => {
    // Load from LocalStorage
    const saved = localStorage.getItem('englishMasterUser');
    if (saved) userData = JSON.parse(saved);

    navigate('home');
    console.log('%cEnglish Master %cReady!', 'color:#10b981; font-size:20px; font-weight:bold;', '');
});

// Auto save
setInterval(() => {
    localStorage.setItem('englishMasterUser', JSON.stringify(userData));
}, 5000);
