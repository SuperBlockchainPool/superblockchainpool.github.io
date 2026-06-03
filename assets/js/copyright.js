function updateCopyrightYear() {
    const currentYear = new Date().getFullYear();
    const copyrightElement = document.getElementById('current-year');
    if (copyrightElement) {
        copyrightElement.textContent = currentYear;
    }
}
setInterval(updateCopyrightYear, 1000); 
