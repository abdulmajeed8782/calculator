
class CalculatorHub {
    constructor() {
        this.calculators = [];
        this.allCalculators = [];
        this.init();
    }

    async init() {
        await this.loadCalculators();
        this.setupEventListeners();
        this.renderCalculators();
    }

    async loadCalculators() {
        // Define the calculators manually since we can't dynamically scan directories in static hosting
        const calculatorList = [
            {
                name: 'Basic Calculator',
                description: 'Perform basic arithmetic operations like addition, subtraction, multiplication, and division.',
                fileName: 'basic-calculator.html',
                category: 'math'
            },
            {
                name: 'BMI Calculator',
                description: 'Calculate your Body Mass Index (BMI) to determine if your weight is in a healthy range.',
                fileName: 'bmi-calculator.html',
                category: 'health'
            },
            {
                name: 'Grade Calculator',
                description: 'Calculate your GPA and final grades based on your assignment and test scores.',
                fileName: 'grade-calculator.html',
                category: 'education'
            },
            {
                name: 'Loan Calculator',
                description: 'Calculate monthly payments, total interest, and payment schedules for loans and mortgages.',
                fileName: 'loan-calculator.html',
                category: 'finance'
            },
            {
                name: 'Percentage Calculator',
                description: 'Calculate percentages, percentage increase/decrease, and find what percentage one number is of another.',
                fileName: 'percentage-calculator.html',
                category: 'math'
            },
            {
                name: 'Currency Converter',
                description: 'Convert between different currencies with real-time exchange rates.',
                fileName: 'currency-converter.html',
                category: 'finance'
            },
            {
                name: 'Tip Calculator',
                description: 'Calculate tips and split bills among multiple people for restaurants and services.',
                fileName: 'tip-calculator.html',
                category: 'finance'
            }
        ];

        this.calculators = calculatorList;
        this.allCalculators = [...calculatorList];
    }

    setupEventListeners() {
        const searchInput = document.getElementById('searchInput');
        const searchBtn = document.querySelector('.search-btn');
        const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        const nav = document.querySelector('.nav');

        // Search functionality
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchCalculators(e.target.value);
            });
        }

        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                this.searchCalculators(searchInput.value);
            });
        }

        // Mobile menu toggle
        if (mobileMenuToggle && nav) {
            mobileMenuToggle.addEventListener('click', () => {
                nav.style.display = nav.style.display === 'block' ? 'none' : 'block';
            });
        }

        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Handle window resize for mobile menu
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                nav.style.display = 'flex';
            } else {
                nav.style.display = 'none';
            }
        });
    }

    searchCalculators(query) {
        const filteredCalculators = this.allCalculators.filter(calc => 
            calc.name.toLowerCase().includes(query.toLowerCase()) ||
            calc.description.toLowerCase().includes(query.toLowerCase()) ||
            calc.category.toLowerCase().includes(query.toLowerCase())
        );

        this.calculators = filteredCalculators;
        this.renderCalculators();
        
        // Show/hide no results message
        const noResults = document.getElementById('noResults');
        if (noResults) {
            noResults.style.display = filteredCalculators.length === 0 ? 'block' : 'none';
        }
    }

    renderCalculators() {
        const calculatorGrid = document.getElementById('calculatorGrid');
        if (!calculatorGrid) return;

        calculatorGrid.innerHTML = '';

        this.calculators.forEach(calculator => {
            const calculatorCard = this.createCalculatorCard(calculator);
            calculatorGrid.appendChild(calculatorCard);
        });
    }

    createCalculatorCard(calculator) {
        const card = document.createElement('div');
        card.className = 'calculator-card';
        
        card.innerHTML = `
            <h3>${calculator.name}</h3>
            <p>${calculator.description}</p>
            <a href="tools/${calculator.fileName}" class="try-btn">Try Now</a>
        `;

        return card;
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CalculatorHub();
});

// Utility function to extract calculator info from HTML files
function extractCalculatorInfo(htmlContent) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    
    const nameElement = doc.querySelector('[data-calculator-name]');
    const descElement = doc.querySelector('[data-calculator-description]');
    
    return {
        name: nameElement ? nameElement.textContent : 'Unknown Calculator',
        description: descElement ? descElement.textContent : 'No description available'
    };
}
