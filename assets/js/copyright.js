const getCurrentYear = ()=>{
    return new Date().getFullYear();
}
document.getElementById('current-year').textContent = getCurrentYear()