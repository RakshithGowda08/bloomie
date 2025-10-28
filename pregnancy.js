// Pregnancy Module Functionality
class PregnancyModule {
    constructor() {
        this.init();
    }

    init() {
        this.populateFormOptions();
        this.setupEventListeners();
        this.loadDiscussionCards();
        this.loadDailySessions();
        this.setupProcedureAnimation();
    }

    populateFormOptions() {
        // Populate dates (1-31)
        const dateSelect = document.getElementById('pregnancy-date');
        for (let i = 1; i <= 31; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i;
            dateSelect.appendChild(option);
        }

        // Populate years (2015-2025)
        const yearSelect = document.getElementById('pregnancy-year');
        for (let i = 2025; i >= 2015; i--) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i;
            yearSelect.appendChild(option);
        }
    }

    setupEventListeners() {
        document.getElementById('calculatePregnancy').addEventListener('click', () => {
            this.calculatePregnancy();
        });

        document.getElementById('resetPregnancyCalculator').addEventListener('click', () => {
            this.resetPregnancyCalculator();
        });
    }

    calculatePregnancy() {
        const month = document.getElementById('pregnancy-month').value;
        const date = document.getElementById('pregnancy-date').value;
        const year = document.getElementById('pregnancy-year').value;

        if (!month || !date || !year) {
            alert('Please fill all fields');
            return;
        }

        const months = ['January', 'February', 'March', 'April', 'May', 'June',
                      'July', 'August', 'September', 'October', 'November', 'December'];
        const monthIndex = months.indexOf(month);
       
        const lastPeriodDate = new Date(year, monthIndex, date);
        const dueDate = new Date(lastPeriodDate);
        dueDate.setDate(dueDate.getDate() + 280); // 40 weeks from last period

        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = dueDate.toLocaleDateString('en-US', options);

        // Hide form and show result in the same location
        document.getElementById('pregnancy-form-container').style.display = 'none';
        document.getElementById('pregnancy-result-container').classList.add('active');
        document.getElementById('pregnancy-result-date').textContent = formattedDate;
    }

    resetPregnancyCalculator() {
        document.getElementById('pregnancy-form-container').style.display = 'block';
        document.getElementById('pregnancy-result-container').classList.remove('active');
        document.getElementById('pregnancy-month').value = '';
        document.getElementById('pregnancy-date').value = '';
        document.getElementById('pregnancy-year').value = '';
       
        // Scroll to top of the pregnancy module
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    loadDiscussionCards() {
        const discussionCards = [
            {
                icon: '🤰',
                title: 'What was your first pregnancy symptom and when did it start?',
                likes: '8K',
                comments: '15K'
            },
            {
                icon: '👶',
                title: 'When did you first feel your baby move and what did it feel like?',
                likes: '12K',
                comments: '25K'
            },
            {
                icon: '🛌',
                title: 'What sleeping positions worked best for you during pregnancy?',
                likes: '6K',
                comments: '18K'
            }
        ];

        const discussionCardsContainer = document.getElementById('pregnancy-discussion-cards');
        discussionCardsContainer.innerHTML = discussionCards.map(card => `
            <div class="discussion-card" onclick="window.open('https://www.babycenter.com/pregnancy/your-body/pregnancy-symptoms_2025', '_blank')">
                <div class="card-icon">${card.icon}</div>
                <div class="card-content">
                    <div class="card-title">${card.title}</div>
                    <div class="card-stats">
                        <div class="stat-item">
                            <span>❤</span>
                            <span>${card.likes}</span>
                        </div>
                        <div class="stat-item">
                            <span>💬</span>
                            <span>${card.comments}</span>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    loadDailySessions() {
        const dailySessions = [
            {
                icon: 'fas fa-spa',
                title: 'Prenatal Yoga',
                description: 'Gentle yoga poses to improve flexibility, reduce stress, and prepare your body for childbirth.',
                buttonText: 'Start Session'
            },
            {
                icon: 'fas fa-wind',
                title: 'Breathing Exercises',
                description: 'Learn breathing techniques to manage labor pain and reduce anxiety throughout your pregnancy.',
                buttonText: 'Start Session'
            },
            {
                icon: 'fas fa-book',
                title: 'Positive Reading',
                description: 'Daily inspirational readings and affirmations to maintain a positive mindset during pregnancy.',
                buttonText: 'Start Session'
            }
        ];

        const dailySessionsContainer = document.getElementById('daily-sessions');
        dailySessionsContainer.innerHTML = dailySessions.map(session => `
            <div class="session-card">
                <div class="session-icon">
                    <i class="${session.icon}"></i>
                </div>
                <h4>${session.title}</h4>
                <p>${session.description}</p>
                <button class="session-btn">${session.buttonText}</button>
            </div>
        `).join('');

        // Add event listeners to session buttons
        document.querySelectorAll('.session-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const sessionTitle = this.closest('.session-card').querySelector('h4').textContent;
                alert(`Starting ${sessionTitle} session...`);
            });
        });
    }

    setupProcedureAnimation() {
        const procedureSteps = document.querySelectorAll('.procedure-step');
       
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = entry.target.style.animationDelay || '0s';
                    entry.target.style.animationDelay = delay;
                    entry.target.style.animationPlayState = 'running';
                }
            });
        }, { threshold: 0.1 });
       
        procedureSteps.forEach(step => {
            step.style.animationPlayState = 'paused';
            observer.observe(step);
        });
    }
}

// Initialize pregnancy module when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PregnancyModule();
});