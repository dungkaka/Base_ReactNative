import axios from "axios";

export const Request = {
    Server: axios.create({
        headers: {
            "Content-Type": "application/json",
        },
    }),
};

export const createRequestWithToken = (token) => {
    if (token) {
        Request.Server = axios.create({
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
        });
    } else {
        Request.Server = axios.create({
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
};
