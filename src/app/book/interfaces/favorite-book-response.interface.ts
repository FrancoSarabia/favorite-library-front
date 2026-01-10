export interface IFavoriteBookResponse {
    id: string;
    externalId: string;
    title: string;
    firstPublishYear: number;
    coverUrl: string;
    authors: string[];
    user: string;
}