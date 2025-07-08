import express from "express";

export namespace NSUser {

    export interface IUser {
        name: string;
        email: string;
        password: string;
        imageURL?: string;
    }

    export interface IUserRequest extends express.Request<{}, {}, NSUser.IUser, {}> { }
}