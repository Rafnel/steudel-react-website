
export interface SwimComponent{
    username: string;
    set: string;
    component_body: string;
    component_id: string;
    date_created: string;
    intervals: string[];
    tags: string[];
    yardage: number;
    difficulty: string;
    likes: number;
}

export function swimComponentToString(component: SwimComponent): string{
    let str: string = "";

    str += "body: " + component.component_body;
    str += "id: " + component.component_id;
    str += "set: " + component.set;
    str += "difficulty: " + component.difficulty;
    str += "tags: " + component.tags.toString();
    str += "intervals: " + component.intervals.toString();
    str += "yardage: " + component.yardage;
    str += "username: " + component.username;

    return str;
}

export class SwimWorkout{
    username: string = "";
    workout_id: string = "";
    warmup: string[] = [];
    preset: string[] = [];
    mainset: string[] = [];
    cooldown: string[] = [];
    likes: number = 0;
    yardage: number = 0;
    difficulty: string = "";
    date_created: string = "";
    last_used?: string = "";
}

export class User{
    username: string = "";
    liked_components: string[] = [];
    liked_workouts: string[] = [];
}

export function emptySwimComponent(): SwimComponent{
    return {
        username: "",
        set: "",
        component_body: "",
        component_id: "",
        date_created: "",
        intervals: [],
        tags: [],
        yardage: 0,
        difficulty: "",
        likes: 0
    }
}