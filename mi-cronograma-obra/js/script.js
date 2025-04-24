// Al inicio del archivo
import { processExcelData } from './excel-processor.js';
import { adjustSchedule } from './schedule-adjuster.js';

// Reemplaza la función processExcelFile con:
async function processExcelFile(file, projectName, targetDate) {
    try {
        const reader = new FileReader();
        
        reader.onload = async function(e) {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            
            // Procesar datos de Excel
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(firstSheet);
            const processedData = processExcelData(jsonData, targetDate);
            
            // Ajustar cronograma si es necesario
            const adjustmentResult = adjustSchedule(processedData.activities, targetDate);
            
            // Almacenar datos para mostrar
            projectData = {
                original: processedData.activities,
                adjusted: adjustmentResult.adjustedActivities,
                metrics: {
                    ...processedData.metrics,
                    adjustedEndDate: adjustmentResult.newEndDate,
                    adjustmentsMade: adjustmentResult.adjustmentsMade
                },
                adjustmentMessage: adjustmentResult.message
            };
            
            // Mostrar resultados
            showProjectSummary(projectName, projectData);
            showAlerts(generateAlerts(projectData));
            renderGanttChart();
            
            resultsSection.classList.remove('hidden');
            resultsSection.scrollIntoView({ behavior: 'smooth' });
        };
        
        reader.readAsArrayBuffer(file);
    } catch (error) {
        alert(`Error al procesar el archivo: ${error.message}`);
        console.error(error);
    }
}

function generateAlerts(projectData) {
    const alerts = [];
    
    // Alerta por fecha objetivo
    if (!projectData.metrics.onSchedule) {
        alerts.push({
            type: 'danger',
            message: `El proyecto excede la fecha objetivo por ${-projectData.metrics.daysDifference} días`
        });
    }
    
    // Alertas por actividades críticas atrasadas
    projectData.original.forEach(act => {
        if (act.critical && act.progress < 100 && new Date(act.end) < new Date()) {
            alerts.push({
                type: 'danger',
                message: `Actividad crítica "${act.name}" está atrasada (${act.progress}% completado)`
            });
        }
    });
    
    // Alerta por ajustes realizados
    if (projectData.metrics.adjustmentsMade) {
        alerts.push({
            type: 'warning',
            message: projectData.adjustmentMessage
        });
    }
    
    return alerts;
}