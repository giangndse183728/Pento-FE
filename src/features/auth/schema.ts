import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";
import { z } from "zod";

const Pento_API_Endpoints_Users_SignIn_Request = z
    .object({
        email: z.string().nullable(),
        password: z.string().nullable()
    })
    .partial();

export const schemas = {
    Pento_API_Endpoints_Users_SignIn_Request,
};

const endpoints = makeApi([
    {
        method: "post",
        path: "/users/sign-in",
        alias: "postUserssignIn",
        requestFormat: "json",
        parameters: [
            {
                name: "body",
                type: "Body",
                schema: Pento_API_Endpoints_Users_SignIn_Request,
            },
        ],
        response: z.void(),
    },
]);

export const api = new Zodios(endpoints);

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
    return new Zodios(baseUrl, endpoints, options);
}