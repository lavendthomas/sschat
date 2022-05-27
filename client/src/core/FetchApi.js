import getCsrfToken from "../Utils";


export const fetchApiPost = (path, body, then) => {
    return getCsrfToken().then(csrfToken => {
        fetch(`https://localhost:8080/api/${path}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "*/*",
                "X-CSRFToken": csrfToken,
                },
            credentials: "include",
            body: JSON.stringify(body),
            })
            .then(res => res.json())
            .then(then);
    }, []);
}
