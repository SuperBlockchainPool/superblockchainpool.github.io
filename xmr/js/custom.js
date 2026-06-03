/* Insert your pool's unique Javascript here */
document.addEventListener("DOMContentLoaded", () => {
    const toggleButton = document.getElementById("darkModeToggle");
    const body = document.body;
    const themeIcon = document.getElementById("themeIcon");

    // Cargar preferencia guardada
    const savedMode = localStorage.getItem("theme");
    if (savedMode === "dark") {
        body.classList.add("dark-mode");
        themeIcon.classList.remove("fa-sun-o");
        themeIcon.classList.add("fa-moon-o");
    }

    // Alternar modo oscuro/claro
    toggleButton.addEventListener("click", () => {
        body.classList.toggle("dark-mode");

        // Cambiar ícono
        if (body.classList.contains("dark-mode")) {
            localStorage.setItem("theme", "dark");
            themeIcon.classList.remove("fa-sun-o");
            themeIcon.classList.add("fa-moon-o");
        } else {
            localStorage.setItem("theme", "light");
            themeIcon.classList.remove("fa-moon-o");
            themeIcon.classList.add("fa-sun-o");
        }
    });
});

/** 
document.addEventListener("DOMContentLoaded", () => {
    const toggleButton = document.getElementById("darkModeToggle");
    const body = document.body;

    // Detectar preferencia del sistema
    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

    // Cargar preferencia guardada
    const savedMode = localStorage.getItem("theme");
    if (savedMode) {
        body.classList.toggle("dark-mode", savedMode === "dark");
    } else {
        // Aplicar preferencia del sistema si no hay preferencia guardada
        body.classList.toggle("dark-mode", prefersDarkScheme.matches);
    }

    // Alternar modo oscuro/claro
    toggleButton.addEventListener("click", () => {
        body.classList.toggle("dark-mode");

        // Guardar preferencia en LocalStorage
        const theme = body.classList.contains("dark-mode") ? "dark" : "light";
        localStorage.setItem("theme", theme);
    });
}); **/