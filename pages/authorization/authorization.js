export default function authorization() {
    console.log("authorization");

    setCookie({
        name: "authorization",
        data: "true",
        expires: "",
        path: "/"
    });
}