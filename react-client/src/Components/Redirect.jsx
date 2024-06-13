export default function Redirect({href}) {
    return (
        <script>{window.location.href = href}</script>
    )
}
