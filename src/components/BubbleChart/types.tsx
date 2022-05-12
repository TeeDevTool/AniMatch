export namespace Types {
    export type Data = {
        name: string;
        genre?: string;
        rating?: number;
        members: number;
    };

    export type GenreLists = {
        index: number;
        genre: string;
    };

    export type ForceData = {
        size: number;
    };
}
