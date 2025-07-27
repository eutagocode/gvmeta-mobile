// Chave para acesso ao localStorage
const SECRET_KEY = "newGoal";

// Armazena todos os feriados nacionais no Brasil
const holidays = [
    "2024-01-01", // Ano Novo
    "2024-04-21", // Tiradentes
    "2024-05-01", // Dia do Trabalhador
    "2024-09-07", // Independência do Brasil
    "2024-10-12", // Nossa Senhora Aparecida
    "2024-11-02", // Finados
    "2024-11-15", // Proclamação da República
    "2024-12-25", // Natal
];

// Variável date para utilizar a biblioteca de datas no decorrer do código
const date = new Date();

// Chamando elementos do HTML
const navItem1 = document.getElementById("nav-item1");
const navItem2 = document.getElementById("nav-item2");
const navItem3 = document.getElementById("nav-item3");
const asideSection = document.getElementById("aside-section");
const createGoalBtn = document.getElementById("create-goal-btn");

// Mostra e esconde a sidebar para navegação
function handleShowNav() {
    let display = window.getComputedStyle(asideSection).display;

    if (display === "none") {
        asideSection.style.display = "flex";
        asideSection.classList.remove("aside-close");
        asideSection.classList.add("aside-open");
    } else {
        asideSection.style.display = "none";
        asideSection.classList.remove("aside-open");
        asideSection.classList.add("aside-close");
    }

    navItem1.classList.toggle("d-none");
    navItem2.classList.toggle("nav-item2-open");
    navItem3.classList.toggle("nav-item3-open");
}

// Pega a chave "newGoal" no localStorage e coloca os resultados em tela
function viewGoal() {
    const replacementOfNull = [
        {
            daily: "",
            days: "",
            forSale: "",
            goal: "",
            sold: "",
        },
    ];

    const { goal, sold, days, daily, forSale } = JSON.parse(
        localStorage.getItem(SECRET_KEY) || `${replacementOfNull}`,
    );

    document.getElementById("goal").innerHTML = formatElements(goal);
    document.getElementById("sold").innerHTML = formatElements(sold);
    document.getElementById("days-left").innerHTML = days;
    document.getElementById("daily").innerHTML = formatElements(daily);
    document.getElementById("for-sale").innerHTML = formatElements(forSale);
}
addEventListener("DOMContentLoaded", viewGoal);

function updateDisplay() {
    const data = JSON.parse(localStorage.getItem(SECRET_KEY));

    console.log(data);
}

class Goal {
    constructor(goal) {
        this.goal = parseFloat(goal);
        this.sold = 0;

        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDate();

        this.days = getRemainingBusinessDays(year, month, day);
        this.forSale = this.goal;
        this.daily = Math.round(this.forSale / this.days);
    }
}

function unformattedValue(element) {
    return element.value
        .replace("R$", "")
        .replace("R$ ", "")
        .replace(/\./g, "")
        .replace(" ", "")
        .trim();
}

// Criar uma nova meta
function createGoal() {
    const inputCreateGoal = document.getElementById("input-create-goal");

    let goal = new Goal(unformattedValue(inputCreateGoal));

    localStorage.setItem(SECRET_KEY, JSON.stringify(goal));
}

function deleteGoal() {
    return localStorage.removeItem(SECRET_KEY);
}

function updateDisplay(input, operation) {
    let data = JSON.parse(localStorage.getItem(SECRET_KEY));

    switch (operation) {
        case "+": {
            data.sold += input;
            break;
        }
        case "-": {
            data.sold -= input;
            break;
        }
        default:
            break;
    }

    data.forSale = data.goal - data.sold;
    data.daily = Math.round(data.forSale / data.days);

    return data;
}

function addSale() {
    const inputSale = document.getElementById("input-new-sale");

    newSale = parseFloat(unformattedValue(inputSale));

    localStorage.setItem(
        SECRET_KEY,
        JSON.stringify(updateDisplay(newSale, "+")),
    );

    inputSale.value = "";
}

function removeSale() {
    const inputSale = document.getElementById("input-remove-sale");

    removeSale = parseFloat(unformattedValue(inputSale));

    localStorage.setItem(
        SECRET_KEY,
        JSON.stringify(updateDisplay(removeSale, "-")),
    );

    inputSale.value = "";
}

// Formatação dos valores dos inputs para colocar pontuação e o R$
function formatNumbers(input) {
    let inputValue = input.value.replace(/\D/g, "");
    inputValue = inputValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    input.value = `R$${inputValue}`;
}
function formatElements(element) {
    let value = String(element).replace(/\D/g, "");
    value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    element = `R$${value}`;

    return element;
}

// Formatação das datas para o formato brasileiro
function formatDate(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
}

// Função que checa se é feriado ou não
function isHoliday(date) {
    return holidays.includes(formatDate(date));
}

// Retorna os dias úteis no mês (Dias trabalhados) e calcula quantos dias úteis faltam para acabar o mês
function getRemainingBusinessDays(year, month, currentDay) {
    const today = new Date(year, month, currentDay);
    const lastDay = new Date(year, month + 1, 0);

    let businessDaysRemaining = [];

    for (
        let day = new Date(today);
        day <= lastDay;
        day.setDate(day.getDate() + 1)
    ) {
        const dayOfTheWeek = day.getDay();
        const holiday = isHoliday(day);

        // Exclui domingos e feriados
        if (dayOfTheWeek !== 0 && !holiday) {
            businessDaysRemaining.push(new Date(day));
        }
    }

    return businessDaysRemaining.length;
}
