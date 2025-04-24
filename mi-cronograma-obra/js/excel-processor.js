function processExcelData(jsonData) {
    // Verificar si hay datos
    if (jsonData.length === 0) throw new Error("El archivo está vacío");
    
    // Validar columnas
    const requiredColumns = ['Actividad', 'Fecha Inicio', 'Fecha Fin', 'Duración'];
    const missing = requiredColumns.filter(col => !Object.keys(jsonData[0]).includes(col));
    if (missing.length > 0) throw new Error(`Faltan columnas: ${missing.join(', ')}`);
    
    // ... resto del código
}

    // 2. Procesar cada actividad
    const activities = jsonData.map((item, index) => {
        // Convertir fechas
        const startDate = new Date(item['Fecha Inicio']);
        const endDate = new Date(item['Fecha Fin']);
        
        // Validar fechas
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            throw new Error(`Fechas inválidas en la actividad: ${item['Actividad']}`);
        }

        // Calcular duración en días
        const durationMs = endDate - startDate;
        const durationDays = Math.ceil(durationMs / (1000 * 60 * 60 * 24)) + 1;

        return {
            id: `act-${index + 1}`,
            name: item['Actividad'] || `Actividad ${index + 1}`,
            start: startDate,
            end: endDate,
            duration: durationDays,
            progress: parseFloat(item['Avance']) || 0,
            predecessors: item['Predecesoras'] ? item['Predecesoras'].split(',').map(p => p.trim()) : [],
            critical: false // Se determinará después
        };
    });

    // 3. Identificar ruta crítica (simplificado)
    identifyCriticalPath(activities);

    // 4. Calcular métricas del proyecto
    const projectMetrics = calculateProjectMetrics(activities, targetDate);

    return {
        activities,
        metrics: projectMetrics
    };
}

function identifyCriticalPath(activities) {
    // Implementación básica - en realidad necesitarías un algoritmo más complejo
    let maxEndDate = new Date(Math.max(...activities.map(a => a.end)));
    
    activities.forEach(act => {
        act.critical = act.end.getTime() === maxEndDate.getTime();
    });
}

function calculateProjectMetrics(activities, targetDate) {
    const totalActivities = activities.length;
    const completedActivities = activities.filter(a => a.progress >= 100).length;
    
    const totalDuration = activities.reduce((sum, act) => sum + act.duration, 0);
    const completedDuration = activities.reduce((sum, act) => sum + (act.duration * (act.progress / 100)), 0);
    const overallProgress = (completedDuration / totalDuration) * 100;
    
    const endDate = new Date(Math.max(...activities.map(a => a.end)));
    const daysDifference = Math.ceil((endDate - targetDate) / (1000 * 60 * 60 * 24));
    
    return {
        totalActivities,
        completedActivities,
        overallProgress: Math.round(overallProgress),
        endDate,
        targetDate,
        daysDifference,
        onSchedule: daysDifference <= 0
    };
}