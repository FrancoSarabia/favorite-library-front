import { IBook } from "./book.interface";

export interface IFavoriteBook extends IBook {
    id: string;
    user: string;
}