export class ApiException extends Error {
    statusCode: number;
    errors: Record<string, unknown>;

    constructor(message: string, statusCode: number, errors: Record<string, unknown> = {}) {
        super(message);

        this.name = 'ApiException';
        this.statusCode = statusCode;
        this.errors = errors;
    }
}

export type SuccessResponse<T = Record<string, unknown>> = {
    ok: true;
    statusCode: number;
    message: string;
    data: T;
    meta: Record<string, unknown>;
};

export type ExceptionResponse<T = Record<string, unknown>> = {
    ok: false;
    statusCode: number;
    message: string;
    errors: T;
};
