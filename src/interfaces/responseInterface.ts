export type Response<Res> = {
    data: Res[];
    meta: {
        total: number;
        limit: number;
        totalPages: number;
        currentPage: number;
    };
};
