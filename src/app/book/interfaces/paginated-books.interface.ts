import { IBook } from "./book.interface";

export interface IPaginatedBooks {
    page: number;
    pageSize: number;
    total: number;
    books: IBook[];
}