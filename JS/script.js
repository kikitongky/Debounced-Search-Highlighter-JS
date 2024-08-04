// Get the search input element and results container element
const searchInput = document.querySelector('.search-input');
const resultsContent = document.querySelector('.result-content');

// Store data fetched from the API
let items = [];

/**
 * Creates a debounced function that delays invoking the provided function until after
 * `wait` milliseconds have elapsed since the last time the debounced function was invoked.
 * The debounced function can be invoked multiple times within this `wait` period, but the
 * actual invocation of the provided function will be delayed until the last invocation.
 *
 * @param {Function} func - The function to be debounced.
 * @param {number} wait - The number of milliseconds to delay invoking the provided function.
 * @return {Function} - The debounced function.
 */
function debounce(func, wait) {
    let timeout; // The timeout ID returned by `setTimeout`.
    return function(...args) {
        const context = this; // The context in which the function is invoked.
        clearTimeout(timeout); // Clear the timeout if it exists.
        timeout = setTimeout(() => func.apply(context, args), wait); // Set a new timeout that will invoke the provided function after `wait` milliseconds.
    };
}

// Fetch data from the API
async function getData() {
    try {
        const res = await fetch('https://jsonplaceholder.typicode.com/users');
        items = await res.json();
        displayResult(items); // Display results after fetching data
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Display results in a table
function displayResult(results) {
    resultsContent.innerHTML = ''; // Clear the results container
    results.forEach(item => {
        const rowItem = document.createElement('tr');
        rowItem.classList.add('result-item');
        rowItem.innerHTML = `  
            <td>${item.name}</td>
            <td>${item.email}</td>
        `;
        resultsContent.appendChild(rowItem);
    });
}

// Highlight the search term in the text
function highlight(text, term) {
    const regexSearch = new RegExp(`(${term})`, 'gi');
    return text.replace(regexSearch, `<span class="highlight">$1</span>`);
}

// Handle search input
function handleSearchInput(e) {
    const term = e.target.value.toLowerCase();
    const filteredItems = items.filter(item => 
        item.name.toLowerCase().includes(term) || item.email.toLowerCase().includes(term)
    );

    resultsContent.innerHTML = ''; // Clear the results container
    filteredItems.forEach(item => {
        const rowItem = document.createElement('tr');
        rowItem.innerHTML = `
        <td>${highlight(item.name, term)}</td>
        <td>${highlight(item.email, term)}</td>
        `;
        resultsContent.appendChild(rowItem);
    });
}

// Add event listener to the search input with debounce
searchInput.addEventListener('input', debounce(handleSearchInput, 500));

// Fetch initial data
getData();
