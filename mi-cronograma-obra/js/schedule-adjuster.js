function adjustSchedule(activities, targetDate) {
    // 1. Calcular la ruta crítica usando el método CPM
    calculateCriticalPath(activities);
    
    // 2. Acelerar actividades críticas primero
    const criticalActs = activities.filter(a => a.critical && a.progress < 100);
    
    criticalActs.forEach(act => {
        const possibleReduction = Math.min(act.duration - 1, 3); // Máximo reducir 3 días
        act.duration -= possibleReduction;
        act.end = new Date(act.start.getTime() + (act.duration * 86400000));
    });
    
    // ... resto del ajuste
}

    // 4. Calcular días de exceso
    const excessDays = Math.ceil((originalEndDate - targetDate) / (1000 * 60 * 60 * 24));
    
    // 5. Estrategia de ajuste (simplificada)
    const incompleteActivities = adjustedActivities.filter(a => a.progress < 100);
    
    // 5a. Reducir duración de actividades no críticas
    const nonCriticalActivities = incompleteActivities.filter(a => !a.critical);
    nonCriticalActivities.forEach(act => {
        const reduction = Math.min(2, act.duration - 1); // No reducir a menos de 1 día
        act.duration -= reduction;
        act.end = new Date(new Date(act.start).setDate(act.start.getDate() + act.duration - 1));
    });
    
    // 5b. Ajustar fechas basado en dependencias
    adjustBasedOnDependencies(adjustedActivities);
    
    // 6. Verificar si el ajuste fue suficiente
    const newEndDate = new Date(Math.max(...adjustedActivities.map(a => a.end)));
    const stillOverdue = newEndDate > targetDate;
    
    return {
        adjustedActivities,
        adjustmentsMade: true,
        originalEndDate,
        newEndDate,
        excessDays,
        stillOverdue,
        message: stillOverdue 
            ? "El cronograma ajustado aún excede la fecha objetivo" 
            : "Cronograma ajustado exitosamente"
    };
}

function adjustBasedOnDependencies(activities) {
    // Implementación básica - en realidad necesitarías un algoritmo más robusto
    activities.forEach(act => {
        if (act.predecessors.length > 0) {
            const predecessorEndDates = act.predecessors.map(predId => {
                const pred = activities.find(a => a.id === predId);
                return pred ? pred.end : new Date(act.start);
            });
            
            const latestPredEnd = new Date(Math.max(...predecessorEndDates));
            if (latestPredEnd > act.start) {
                const diffDays = Math.ceil((latestPredEnd - act.start) / (1000 * 60 * 60 * 24));
                act.start = new Date(latestPredEnd);
                act.end = new Date(new Date(latestPredEnd).setDate(latestPredEnd.getDate() + act.duration - 1));
            }
        }
    });
}