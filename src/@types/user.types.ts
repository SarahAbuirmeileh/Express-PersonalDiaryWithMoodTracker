import express from "express";

export namespace NSTracker {

    export interface IUser {
        name: string;
        email: string;
        password: string;
        imageURL?: string;
    }

    export interface IUserCreateRequest extends express.Request<{}, {}, NSTracker.IUser, {}> { }
    
    export type tagType = 'global' | 'custom';

    export interface ITag {
        name: string;
        emoji: string;
        type: tagType;
        user: number;
    }
    
    export interface ITagCreateRequest extends express.Request<{}, {}, ITag, {}> { }

}