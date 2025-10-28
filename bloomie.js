// Bloomie AI Chatbot Functionality
class BloomieModule {
    constructor() {
        this.API_KEY = "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";
        this.API_URL = "https://api.groq.com/openai/v1/chat/completions";
        this.MODEL_NAME = "llama-3.1-8b-instant";
        this.conversation = [
            {
                role: "system",
                content: "You are Bloomie, a helpful and empathetic AI assistant specializing in natural remedies and wellness. You provide gentle, natural solutions for common health concerns. You focus on herbal remedies, lifestyle changes, dietary adjustments, and natural approaches. You always remind users to consult healthcare professionals for serious conditions. You are warm, encouraging, and practical in your advice."
            }
        ];
        
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('sendMessage').addEventListener('click', () => {
            this.sendMessage();
        });

        document.getElementById('chatInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });

        // Setup suggestion chips
        document.querySelectorAll('.suggestion-chip').forEach(chip => {
            chip.addEventListener('click', () => {
                const question = chip.getAttribute('data-question');
                this.askQuestion(question);
            });
        });
    }

    addMessage(text, sender) {
        const chatMessages = document.getElementById('chatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        messageDiv.classList.add(sender === 'user' ? 'user-message' : 'bot-message');
        messageDiv.textContent = text;
       
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    showTypingIndicator() {
        const chatMessages = document.getElementById('chatMessages');
        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing-indicator';
        typingDiv.id = 'typingIndicator';
       
        const dotsDiv = document.createElement('div');
        dotsDiv.className = 'typing-dots';
       
        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('div');
            dot.className = 'typing-dot';
            dotsDiv.appendChild(dot);
        }
       
        typingDiv.appendChild(dotsDiv);
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    async sendMessage() {
        const chatInput = document.getElementById('chatInput');
        const message = chatInput.value.trim();
       
        if (message) {
            this.addMessage(message, 'user');
            chatInput.value = '';
            this.showTypingIndicator();

            this.conversation.push({ role: "user", content: message });

            try {
                const res = await fetch(this.API_URL, {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${this.API_KEY}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        model: this.MODEL_NAME,
                        messages: this.conversation,
                        temperature: 0.7,
                        max_tokens: 500
                    })
                });

                const data = await res.json();
                this.hideTypingIndicator();

                let reply = "I'm sorry, I couldn't generate a response at the moment. Please try again.";

                if (data.choices && data.choices.length > 0) {
                    reply = data.choices[0].message.content.trim();
                    this.conversation.push({ role: "assistant", content: reply });
                } else if (data.error) {
                    reply = `I'm experiencing a technical issue: ${data.error.message}`;
                }

                this.addMessage(reply, 'bot');

            } catch (err) {
                this.hideTypingIndicator();
                this.addMessage("I'm having trouble connecting right now. Please check your internet connection and try again.", 'bot');
                this.conversation.pop();
            }
        }
    }

    askQuestion(question) {
        this.addMessage(question, 'user');
        this.showTypingIndicator();
       
        this.conversation.push({ role: "user", content: question });

        fetch(this.API_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${this.API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: this.MODEL_NAME,
                messages: this.conversation,
                temperature: 0.7,
                max_tokens: 500
            })
        })
        .then(res => res.json())
        .then(data => {
            this.hideTypingIndicator();
           
            let reply = "I'm sorry, I couldn't generate a response at the moment. Please try again.";

            if (data.choices && data.choices.length > 0) {
                reply = data.choices[0].message.content.trim();
                this.conversation.push({ role: "assistant", content: reply });
            } else if (data.error) {
                reply = `I'm experiencing a technical issue: ${data.error.message}`;
            }

            this.addMessage(reply, 'bot');
        })
        .catch(err => {
            this.hideTypingIndicator();
            this.addMessage("I'm having trouble connecting right now. Please check your internet connection and try again.", 'bot');
            this.conversation.pop();
        });
    }
}

// Initialize Bloomie module when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new BloomieModule();
});