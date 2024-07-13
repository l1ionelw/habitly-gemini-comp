export default function shouldSelect(url) {
    const pagePath = window.location.pathname;
    console.log(pagePath);
    if (url === "/") {
        if (url === pagePath) {
            return "selected"
        }
        return ""
    }
    if (pagePath.includes(url)) {
        return "selected";
    }
}