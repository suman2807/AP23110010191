import { Notification } from './api';

export function getWeight(type: Notification['Type']): number {
    switch (type) {
        case "Placement": return 3;
        case "Result": return 2;
        case "Event": return 1;
        default: return 0;
    }
}

export function comparePriority(a: Notification, b: Notification): number {
    const weightA = getWeight(a.Type);
    const weightB = getWeight(b.Type);

    if (weightA !== weightB) {
        return weightB - weightA; 
    }

    const timeA = new Date(a.Timestamp).getTime();
    const timeB = new Date(b.Timestamp).getTime();
    return timeB - timeA; 
}
