declare namespace Store {
    interface IDiaryItem {
        id: number;
        title: string;
        type: string[];
        notes: string;
        state: number;
        image?: string;
        audio?: string;
    }
}

