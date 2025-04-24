// En script.js, dentro del evento click del botón Exportar
document.getElementById('export-btn').addEventListener('click', () => {
    const projectName = document.getElementById('project-name').value;
    exportToExcel(projectData.adjusted, projectName);
});

function exportToExcel(activities, projectName) {
    // Convertir datos al formato de Excel
    const exportData = activities.map(act => ({
        'Actividad': act.name,
        'Fecha Inicio': act.start.toISOString().split('T')[0],
        'Fecha Fin': act.end.toISOString().split('T')[0],
        'Duración (días)': act.duration,
        'Avance (%)': act.progress,
        'Crítica': act.critical ? 'Sí' : 'No'
    }));

    // Crear hoja de cálculo
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Cronograma');
    
    // Descargar archivo
    XLSX.writeFile(workbook, `${projectName}_Ajustado.xlsx`);
}