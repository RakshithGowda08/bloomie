// Periods Module Functionality
class PeriodsModule {
    constructor() {
        this.init();
    }

    init() {
        this.populateFormOptions();
        this.setupEventListeners();
        this.loadDiscussionCards();
    }

    populateFormOptions() {
        // Populate dates (1-31)
        const dateSelect = document.getElementById('date');
        for (let i = 1; i <= 31; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i;
            dateSelect.appendChild(option);
        }

        // Populate years (2015-2025)
        const yearSelect = document.getElementById('year');
        for (let i = 2025; i >= 2015; i--) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i;
            yearSelect.appendChild(option);
        }

        // Populate cycle lengths (20-31 days)
        const cycleSelect = document.getElementById('cycle-length');
        for (let i = 20; i <= 31; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = `${i} days`;
            cycleSelect.appendChild(option);
        }
    }

    setupEventListeners() {
        document.getElementById('calculatePeriod').addEventListener('click', () => {
            this.calculatePeriod();
        });

        document.getElementById('resetCalculator').addEventListener('click', () => {
            this.resetCalculator();
        });
    }

    calculatePeriod() {
        const month = document.getElementById('month').value;
        const date = document.getElementById('date').value;
        const year = document.getElementById('year').value;
        const cycleLength = document.getElementById('cycle-length').value;

        if (!month || !date || !year || !cycleLength) {
            alert('Please fill all fields');
            return;
        }

        document.getElementById('form-section').style.display = 'none';
        document.getElementById('loading-screen').classList.add('active');

        const months = ['January', 'February', 'March', 'April', 'May', 'June',
                      'July', 'August', 'September', 'October', 'November', 'December'];
        const monthIndex = months.indexOf(month);
       
        const lastPeriodDate = new Date(year, monthIndex, date);
        const nextPeriodDate = new Date(lastPeriodDate);
        nextPeriodDate.setDate(nextPeriodDate.getDate() + parseInt(cycleLength));

        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = nextPeriodDate.toLocaleDateString('en-US', options);

        setTimeout(() => {
            document.getElementById('loading-screen').classList.remove('active');
            document.getElementById('result-screen').classList.add('active');
            document.getElementById('result-date').textContent = formattedDate;
        }, 3000);
    }

    resetCalculator() {
        document.getElementById('form-section').style.display = 'block';
        document.getElementById('result-screen').classList.remove('active');
        document.getElementById('month').value = '';
        document.getElementById('date').value = '';
        document.getElementById('year').value = '';
        document.getElementById('cycle-length').value = '';
       
        // Scroll to top of the periods module
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    loadDiscussionCards() {
        const discussionCards = [
            {
                icon: '📊',
                title: 'Have you noticed if anything makes your cycle more or less regular?',
                likes: '5K',
                comments: '12K'
            },
            {
                icon: '🩸',
                title: 'The most obvious sign that your period\'s about to start is...',
                likes: '10K',
                comments: '43K'
            },
            {
                icon: '🔴',
                title: 'Have you ever noticed spotting between periods? What causes it?',
                likes: '19K',
                comments: '30K'
            }
        ];

        const discussionCardsContainer = document.querySelector('.discussion-cards');
        discussionCardsContainer.innerHTML = discussionCards.map(card => `
            <div class="discussion-card">
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
}

// Initialize periods module when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PeriodsModule();
});