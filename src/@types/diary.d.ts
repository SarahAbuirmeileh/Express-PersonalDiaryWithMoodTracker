import { ObjectId } from "mongoose";

declare namespace moreSuitable {
    interface IDiaryItem {
        _id: ObjectId;
        id: number;
        title: string;
        type: string[];
        notes: string;
        state: number;
        image?: string;
        audio?: string;
    }
}

