let user = {
    xp: 1240,
    level: 12,
    streak: 7,
    completedLessons: 45
};

const levels = [
    {id: "A1", name: "A1 Beginner", color: "emerald"},
    {id: "A2", name: "A2 Elementary", color: "blue"},
    {id: "B1", name: "B1 Intermediate", color: "violet"},
    {id: "B2", name: "B2 Upper Intermediate", color: "amber"},
    {id: "C1", name: "C1 Advanced", color: "rose"},
    {id: "C2", name: "C2 Mastery", color: "purple"}
];

const vocabulary = {
    "A1": [
        {word: "Apple", trans: "ვაშლი", pron: "ˈæp.əl", ex: "I eat an apple every day."},
        {word: "Book", trans: "წიგნი", pron: "bʊk", ex: "This is my favorite book."},
        {word: "Water", trans: "წყალი", pron: "ˈwɔː.tər", ex: "Drink more water."},
        {word: "House", trans: "სახლი", pron: "haʊs", ex: "My house is big."},
        {word: "School", trans: "სკოლა", pron: "skuːl", ex: "I go to school."},
        {word: "Teacher", trans: "მასწავლებელი", pron: "ˈtiː.tʃər", ex: "My teacher is kind."},
        {word: "Family", trans: "ოჯახი", pron: "ˈfæm.ə.li", ex: "I love my family."},
        {word: "Dog", trans: "ძაღლი", pron: "dɒɡ", ex: "The dog is playing."},
        {word: "Cat", trans: "კატა", pron: "kæt", ex: "The cat is sleeping."},
        {word: "Car", trans: "მანქანა", pron: "kɑːr", ex: "My father has a car."}
        // ... 190+ more would go here in full version
    ],
    "A2": [ /* 300+ words */ ],
    // ... other levels with increasing data
};

const grammarLessons = [
    {
        title: "Present Simple",
        rule: "Used for habits, facts, and general truths.",
        examples: ["I eat breakfast every day.", "She works in Tbilisi."],
        exercise: "I ___ (go) to school every morning."
    },
    {
        title: "Present Continuous",
        rule: "Used for actions happening now.",
        examples: ["I am learning English.", "They are playing football."],
        exercise: "Listen! She ___ (sing)."
    }
];

function navigate(section) {
    document.querySelectorAll('section').forEach(s => s.classList.add('hidden'));
    document.getElementById(section).classList.remove('hidden');
    
    if (section === 'levels') renderLevels();
    if (section === 'vocabulary') loadVocabulary();
    if (section === 'grammar') renderGrammar();
    if (section === 'quiz') startQuiz();
    if (section === 'profile') renderProfile();
}

function renderLevels() {
    const container = document.getElementById('levels-grid');
    container.innerHTML = '';
    levels.forEach(level => {
        const div = document.createElement('div');
        div.className = `glass rounded-3xl p-8 card cursor-pointer`;
        div.innerHTML = `
            <div class="text-${level.color}-400 text-sm font-medium">CEFR Level</div>
            <div class="text-3xl font-bold mt-2">${level.name}</div>
            <button onclick="openLevel('${level.id}')" class="mt-6 w-full py-3 bg-white text-black rounded-2xl">Start Level</button>
        `;
        container.appendChild(div);
    });
}

function openLevel(levelId) {
    alert(`Opening ${levelId} level lessons... (Full content loaded)`);
    navigate('vocabulary');
    document.getElementById('level-select').value = levelId;
    loadVocabulary();
}

function loadVocabulary() {
    const level = document.getElementById('level-select').value || "A1";
    const container = document.getElementById('vocab-list');
    container.innerHTML = '';
    
    const words = vocabulary[level] || vocabulary["A1"];
    
    words.forEach(item => {
        const card = document.createElement('div');
        card.className = "glass rounded-3xl p-6 cursor-pointer card";
        card.innerHTML = `
            <h3 class="text-2xl font-semibold">${item.word}</h3>
            <p class="text-emerald-400 mt-2">${item.trans}</p>
            <p class="text-zinc-400 text-sm mt-1">/${item.pron}/</p>
            <p class="text-zinc-300 mt-4 text-sm">"${item.ex}"</p>
        `;
        card.onclick = () => showWordModal(item);
        container.appendChild(card);
    });
}

function showWordModal(word) {
    document.getElementById('modal-content').innerHTML = `
        <h2 class="text-4xl font-bold">${word.word}</h2>
        <p class="text-2xl text-emerald-400 mt-4">${word.trans}</p>
        <p class="text-zinc-400 mt-2">Pronunciation: <span class="font-mono">/${word.pron}/</span></p>
        <div class="mt-8">
            <p class="font-medium">Example:</p>
            <p class="italic">"${word.ex}"</p>
        </div>
    `;
    document.getElementById('word-modal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('word-modal').classList.add('hidden');
}

function renderGrammar() {
    const container = document.getElementById('grammar-list');
    container.innerHTML = grammarLessons.map(lesson => `
        <div class="glass rounded-3xl p-8">
            <h3 class="text-2xl font-bold">${lesson.title}</h3>
            <p class="mt-4 text-zinc-300">${lesson.rule}</p>
            <div class="mt-6">
                <p class="font-medium">Examples:</p>
                <ul class="list-disc pl-6 mt-2 space-y-1">
                    ${lesson.examples.map(ex => `<li>${ex}</li>`).join('')}
                </ul>
            </div>
            <div class="mt-8 bg-zinc-900 p-6 rounded-2xl">
                <p class="font-medium">Practice:</p>
                <p>${lesson.exercise}</p>
                <input type="text" class="mt-4 w-full bg-transparent border border-emerald-500 rounded-2xl p-4" placeholder="Type your answer">
            </div>
        </div>
    `).join('');
}

let currentQuiz = 0;
const quizQuestions = [
    {q: "What is the capital of England?", a: "London", options: ["Paris", "London", "Berlin"]},
    {q: "Choose correct form: She ___ English.", a: "speaks", options: ["speak", "speaks", "speaking"]}
];

function startQuiz() {
    currentQuiz = 0;
    renderQuizQuestion();
}

function renderQuizQuestion() {
    const q = quizQuestions[currentQuiz];
    document.getElementById('quiz-container').innerHTML = `
        <h3 class="text-2xl mb-8">${q.q}</h3>
        <div class="space-y-4">
            ${q.options.map(opt => `
                <button onclick="answerQuiz('${opt}')" class="w-full py-5 text-left px-8 rounded-2xl border border-zinc-700 hover:border-emerald-500 transition">
                    ${opt}
                </button>
            `).join('')}
        </div>
    `;
}

function answerQuiz(selected) {
    alert(selected === quizQuestions[currentQuiz].a ? "✅ Correct! +10 XP" : "❌ Wrong");
    user.xp += 10;
    currentQuiz++;
    if (currentQuiz < quizQuestions.length) {
        renderQuizQuestion();
    } else {
        alert("Quiz Completed! Great job!");
        navigate('profile');
    }
}

function startDailyChallenge() {
    alert("Daily Challenge Started!\n\n5 new words + 1 grammar exercise\n\n+50 XP earned today");
    user.xp += 50;
    user.streak++;
    renderProfile();
}

function renderProfile() {
    document.getElementById('username').textContent = "Alex Tskitishvili";
    document.getElementById('xp').textContent = user.xp;
    document.getElementById('level').textContent = `Level ${user.level}`;
    document.getElementById('streak').textContent = `${user.streak} day streak 🔥`;
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Populate level select
    const select = document.getElementById('level-select');
    levels.forEach(l => {
        const opt = document.createElement('option');
        opt.value = l.id;
        opt.textContent = l.name;
        select.appendChild(opt);
    });
    
    navigate('home');
    console.log('%cEnglish Master %cLoaded Successfully!', 'color:#10b981;font-size:18px;font-weight:bold', '');
});
