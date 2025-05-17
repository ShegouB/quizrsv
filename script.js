document.addEventListener('DOMContentLoaded', () => {

    // --- Références aux éléments HTML ---
    const welcomeScreen = document.getElementById('welcome-screen');
    const firstNameInput = document.getElementById('firstName');
    const lastNameInput = document.getElementById('lastName');
    const firstNameErrorElement = document.getElementById('firstName-error');
    const startButton = document.getElementById('startButton');

    const greetingScreen = document.getElementById('greeting-screen');
    const greetingMessage = document.getElementById('greeting-message');

    const quizScreen = document.getElementById('quiz-screen');
    const timerArea = document.getElementById('timer-area');
    const timeSpan = document.getElementById('time');
    const timerBar = document.getElementById('timer-bar');
    const questionTextElement = document.getElementById('question-text');
    const optionsArea = document.getElementById('options-area');
    const validateButton = document.getElementById('validateButton');
    const feedbackArea = document.getElementById('feedback-area');
    const nextButton = document.getElementById('nextButton');
    const currentQuestionNumberSpan = document.getElementById('current-question-number');
    const totalQuestionsSpan = document.getElementById('total-questions');

    const endScreen = document.getElementById('end-screen');
    const finalScoreElement = document.getElementById('final-score');
    const restartButton = document.getElementById('restartButton');

    // --- Données du Quiz ---
    const quizQuestions = [
        // ... (Vos questions ici, inchangées) ...
        { questionText: "Selon la Session 1, qu'est-ce que le World Wide Web (WWW) ?", options: ["Le réseau physique des câbles sous-marins", "Un service d'interconnexion de documents via Internet", "Un moteur de recherche", "Le protocole de transfert de fichiers"], correctAnswerIndex: 1, type: 'general' },
        { questionText: "Quel est le rôle principal d'un navigateur web comme Chrome ou Firefox ?", options: ["Héberger des sites web", "Exécuter du code Back-end", "Interpréter et afficher les pages web", "Stocker les bases de données"], correctAnswerIndex: 2, type: 'general' },
        { questionText: "Qu'est-ce que le 'Développement Web' ?", options: ["Uniquement la création de sites internet statiques", "Le processus de conception, création et maintenance d'applications web", "La gestion des réseaux informatiques", "La création de logiciels de bureautique"], correctAnswerIndex: 1, type: 'general' },
        { questionText: "À quoi sert principalement une URL (Uniform Resource Locator) ?", options: ["À exécuter du code JavaScript", "À afficher des styles CSS", "À identifier et localiser une ressource sur le web", "À gérer des bases de données"], correctAnswerIndex: 2, type: 'general' },
        { questionText: "Dans le modèle Client-Serveur pour le web, qui est le 'Client' ?", options: ["L'ordinateur qui héberge le site web", "La base de données", "Le navigateur web de l'utilisateur", "Le développeur web"], correctAnswerIndex: 2, type: 'general' },
        { questionText: "Quel langage est utilisé pour structurer le contenu d'une page web via des balises ?", options: ["CSS", "JavaScript", "HTML", "Python"], correctAnswerIndex: 2, type: 'technical' },
        { questionText: "Quel langage est utilisé pour styliser les pages web (couleurs, polices, mise en page) ?", options: ["HTML", "CSS", "JavaScript", "SQL"], correctAnswerIndex: 1, type: 'technical' },
        { questionText: "Quel langage rend les pages web interactives et dynamiques côté navigateur (Client-side) ?", options: ["PHP", "Python", "Java", "JavaScript"], correctAnswerIndex: 3, type: 'technical' },
        { questionText: "Selon la Session 2, qu'est-ce qui permet à JavaScript de modifier le contenu ou l'apparence d'une page *après* qu'elle soit chargée ?", options: ["La lecture des fichiers HTML/CSS bruts", "La manipulation du DOM (Document Object Model)", "La communication directe avec le serveur sans passer par le navigateur", "L'utilisation exclusive de frameworks Front-end"], correctAnswerIndex: 1, type: 'technical' },
        { questionText: "Quel terme décrit la capacité de JavaScript à échanger des données avec un serveur en arrière-plan sans recharger toute la page (Session 2) ?", options: ["Synchronisme", "Ajax (ou communication Asynchrone)", "Compilation", "Transpilation"], correctAnswerIndex: 1, type: 'technical' },
        { questionText: "Parmi les options suivantes, laquelle est une bibliothèque JavaScript populaire pour construire des interfaces utilisateur, souvent utilisée comme base pour des frameworks Front-end ?", options: ["jQuery", "React", "flask", "MooTools"], correctAnswerIndex: 1, type: 'technical' },
        { questionText: "Vue.js est décrit comme un framework 'progressif'. Qu'est-ce que cela signifie principalement ?", options: ["Qu'il ne s'exécute que sur les navigateurs les plus récents", "Qu'il permet d'adopter ses fonctionnalités petit à petit dans un projet existant", "Qu'il est plus lent que les autres frameworks", "Qu'il compile le code avant l'exécution dans le navigateur"], correctAnswerIndex: 1, type: 'technical' },
        { questionText: "Dans un framework Front-end moderne, quelle est l'unité de base pour construire l'interface utilisateur, combinant souvent structure, style et logique ?", options: ["Une Balise HTML", "Un Sélecteur CSS", "Un Composant", "Une Fonction Asynchrone"], correctAnswerIndex: 2, type: 'technical' },
        { questionText: "Pourquoi la séparation des rôles entre HTML, CSS et JavaScript est-elle une bonne pratique en développement web ?", options: ["Pour que les fichiers soient plus petits", "Pour rendre le code plus lisible, maintenable et faciliter le travail d'équipe", "Pour que les navigateurs chargent les pages plus lentement (optimisation)", "Cette séparation n'est pas considérée comme une bonne pratique"], correctAnswerIndex: 1, type: 'reflection' },
        { questionText: "L'essor des frameworks Front-end (React, Vue, Angular) est une conséquence de quelle évolution du web (Session 2) ?", options: ["Le web est devenu entièrement statique", "Les applications web sont devenues de plus en plus complexes et riches en fonctionnalités interactives", "Le Back-end n'est plus nécessaire", "Les navigateurs ne peuvent plus exécuter de JavaScript simple"], correctAnswerIndex: 1, type: 'reflection' },
        { questionText: "Selon les sessions, pourquoi est-il recommandé d'apprendre les bases (HTML, CSS, JavaScript vanilla) avant de se spécialiser dans un framework Front-end ?", options: ["Car les frameworks sont obsolètes", "Car les frameworks s'appuient sur ces bases, et leur maîtrise est essentielle pour comprendre comment les frameworks fonctionnent", "Pour pouvoir développer des applications mobiles natives", "Pour devenir designer graphique"], correctAnswerIndex: 1, type: 'reflection' }
    ];

    // --- Variables d'état du Quiz ---
    let currentQuestionIndex = 0;
    let score = 0;
    let userName = "";
    let userLastName = "";
    let timerId = null;
    // --- CHANGEMENT ICI : Limite de temps augmentée à 45 secondes ---
    const TIME_PER_QUESTION = 50; // Durée de chaque question en secondes
    // -------------------------------------------------------------
    let timeLeft = TIME_PER_QUESTION;
    const sectionTransitionDuration = 500;

    // --- Fonctions de Navigation ---

    function showSection(sectionToShow) {
        const activeSection = document.querySelector('.quiz-section.active');

        if (activeSection && activeSection !== sectionToShow) {
            activeSection.style.opacity = 0;
            activeSection.addEventListener('transitionend', function handleTransitionEnd() {
                activeSection.style.display = 'none';
                activeSection.classList.remove('active');
                 activeSection.removeEventListener('transitionend', handleTransitionEnd);

                sectionToShow.style.display = 'block';
                sectionToShow.offsetHeight;
                sectionToShow.style.opacity = 1;
                sectionToShow.classList.add('active');

                 if (sectionToShow === welcomeScreen) {
                      firstNameInput.focus();
                 }

            }, { once: true });

        } else if (activeSection === sectionToShow) {
             return;
        }
        else {
             document.querySelectorAll('.quiz-section').forEach(section => {
                if (section !== sectionToShow) {
                    section.style.display = 'none';
                    section.style.opacity = 0;
                    section.classList.remove('active');
                }
             });
            sectionToShow.style.display = 'block';
            setTimeout(() => {
                sectionToShow.style.opacity = 1;
                sectionToShow.classList.add('active');
                 if (sectionToShow === welcomeScreen) {
                      firstNameInput.focus();
                 }
            }, 10);
        }
    }

    // --- Logique du Quiz ---

    function startQuiz() {
        currentQuestionIndex = 0;
        score = 0;
        // quizQuestions.sort(() => Math.random() - 0.5); // Optionnel

        totalQuestionsSpan.textContent = quizQuestions.length;

        showSection(quizScreen);
        displayQuestion();
    }

    function displayQuestion() {
        stopTimer();

        validateButton.disabled = false;
        validateButton.classList.remove('hidden');
        nextButton.classList.add('hidden');
        feedbackArea.textContent = '';
        feedbackArea.className = 'feedback';
        feedbackArea.classList.remove('show');

        timerBar.style.transition = 'none';
        timerBar.style.width = '100%';
        timerBar.style.backgroundColor = '#5cb85c';
        timerBar.offsetHeight;
        // --- CHANGEMENT ICI : La durée de transition est liée à la constante ---
        timerBar.style.transition = `width ${TIME_PER_QUESTION}s linear`;
        // ------------------------------------------------------------------

        if (currentQuestionIndex < quizQuestions.length) {
            const currentQuestion = quizQuestions[currentQuestionIndex];

            currentQuestionNumberSpan.textContent = currentQuestionIndex + 1;
            questionTextElement.textContent = currentQuestion.questionText;

            optionsArea.innerHTML = '';
            currentQuestion.options.forEach((option, index) => {
                const optionId = `q${currentQuestionIndex}_option${index}`;
                const optionHTML = `
                    <input type="radio" id="${optionId}" name="quizOption" value="${index}">
                    <label for="${optionId}">${option}</label><br>
                `;
                optionsArea.innerHTML += optionHTML;
            });

            startTimer();
        } else {
            endQuiz();
        }
    }

    function startTimer() {
        timeLeft = TIME_PER_QUESTION;
        timeSpan.textContent = timeLeft;
        timerArea.style.color = '#d9534f';
        timerBar.style.backgroundColor = '#5cb85c';

        timerBar.style.width = '0%';

        timerId = setInterval(() => {
            timeLeft--;
            timeSpan.textContent = timeLeft;

            // Seuil de 5 secondes reste pertinent même pour 45s
            if (timeLeft <= 5) {
                 timerArea.style.color = '#f0ad4e';
                 timerBar.style.backgroundColor = '#f0ad4e';
             } else {
                 timerArea.style.color = '#d9534f';
                 timerBar.style.backgroundColor = '#5cb85c';
            }

            if (timeLeft <= 0) {
                stopTimer();
                handleTimeout();
            }
        }, 1000);
    }

    function stopTimer() {
        clearInterval(timerId);
        timerId = null;
        timerArea.style.color = '#666';

        timerBar.style.transition = 'none';
        const currentWidth = timerBar.offsetWidth;
        const containerWidth = timerBar.parentElement.offsetWidth;
        const percentage = (currentWidth / containerWidth) * 100;
        timerBar.style.width = percentage + '%';
    }

    function handleTimeout() {
        disableOptionsAndButton();
        feedbackArea.textContent = `Temps écoulé ! La bonne réponse était : ${quizQuestions[currentQuestionIndex].options[quizQuestions[currentQuestionIndex].correctAnswerIndex]}`;
        feedbackArea.className = 'feedback timeout show';

        highlightCorrectAnswer();

        nextButton.classList.remove('hidden');

        timerBar.style.transition = 'none';
        timerBar.style.width = '0%';
        timerBar.style.backgroundColor = '#d9534f';
    }

    function disableOptionsAndButton() {
         optionsArea.querySelectorAll('input[name="quizOption"]').forEach(radio => {
            radio.disabled = true;
             radio.nextElementSibling.classList.add('disabled-label');
        });
        validateButton.disabled = true;
        validateButton.classList.add('hidden');
    }

    function validateAnswer() {
        stopTimer();

        const selectedOption = optionsArea.querySelector('input[name="quizOption"]:checked');

        if (!selectedOption) {
             feedbackArea.textContent = "Veuillez sélectionner une option.";
             feedbackArea.className = 'feedback incorrect show';
            return; // Ne pas redémarrer le timer, on attend la sélection
        }

        const selectedAnswerIndex = parseInt(selectedOption.value);
        const currentQuestion = quizQuestions[currentQuestionIndex];
        let isCorrect = false;

        disableOptionsAndButton();

        if (selectedAnswerIndex === currentQuestion.correctAnswerIndex) {
            score++;
            feedbackArea.textContent = "Félicitations ! Correct.";
            feedbackArea.className = 'feedback correct show';
            isCorrect = true;

             timerBar.style.transition = 'none';
             timerBar.style.width = '100%'; // Barre pleine pour bonne réponse
             timerBar.style.backgroundColor = '#5cb85c';
        } else {
            feedbackArea.textContent = `Oups. Courage ! La bonne réponse était : ${currentQuestion.options[currentQuestion.correctAnswerIndex]}`;
            feedbackArea.className = 'feedback incorrect show';

             timerBar.style.transition = 'none';
             const currentWidth = timerBar.offsetWidth;
             const containerWidth = timerBar.parentElement.offsetWidth;
             const percentage = (currentWidth / containerWidth) * 100;
             timerBar.style.width = percentage + '%'; // Fixer la barre là où elle était
             timerBar.style.backgroundColor = '#d9534f'; // Rouge
        }

        highlightCorrectAnswer(selectedAnswerIndex, isCorrect);

        nextButton.classList.remove('hidden');
    }

    function highlightCorrectAnswer(selectedAnswerIndex = -1, isCorrect = false) {
         const currentQuestion = quizQuestions[currentQuestionIndex];
         optionsArea.querySelectorAll('input[name="quizOption"]').forEach((radio, index) => {
             const label = radio.nextElementSibling;

             if (index === currentQuestion.correctAnswerIndex) {
                 label.classList.add('correct-answer');
             }

             if (!isCorrect && selectedAnswerIndex !== -1 && index === selectedAnswerIndex) {
                 label.classList.add('incorrect-answer');
             }
         });
    }

    function nextQuestion() {
        currentQuestionIndex++;
        displayQuestion();
    }

    function endQuiz() {
        stopTimer();
        showSection(endScreen);
        finalScoreElement.textContent = `Votre score final : ${score} / ${quizQuestions.length}`;
    }

    function restartQuiz() {
         firstNameInput.value = '';
         lastNameInput.value = '';
         userName = "";
         userLastName = "";
         firstNameInput.classList.remove('invalid');
         firstNameErrorElement.textContent = '';

         showSection(welcomeScreen);
    }

    // --- Gestion des Événements ---

    startButton.addEventListener('click', () => {
        userName = firstNameInput.value.trim();
        userLastName = lastNameInput.value.trim();

        if (userName) {
            firstNameInput.classList.remove('invalid');
            firstNameErrorElement.textContent = '';

            showSection(greetingScreen);
            greetingMessage.textContent = `Let's Go ${userName} !`;

             const greetingTitle = greetingScreen.querySelector('h1');
             greetingTitle.addEventListener('animationend', function handleGreetingEnd() {
                 greetingTitle.removeEventListener('animationend', handleGreetingEnd);
                 setTimeout(startQuiz, 500);
             }, { once: true });

        } else {
            firstNameInput.classList.add('invalid');
            firstNameErrorElement.textContent = "Veuillez entrer votre prénom.";
            firstNameInput.focus();
        }
    });

    firstNameInput.addEventListener('input', () => {
        if (firstNameInput.value.trim()) {
             firstNameInput.classList.remove('invalid');
             firstNameErrorElement.textContent = '';
        }
    });

    validateButton.addEventListener('click', validateAnswer);
    nextButton.addEventListener('click', nextQuestion);
    restartButton.addEventListener('click', restartQuiz);

    // --- Initialisation ---
    showSection(welcomeScreen);

});
