import { IFavoriteBook } from "./favorite-book.interface";

export interface IPaginatedFavoriteBooks {
    page: number;
    pageSize: number;
    total: number;
    items: IFavoriteBook[];
}