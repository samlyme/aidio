export default function WelcomeMenu({ setReady }) {

    return (
        <button onClick={() => { setReady(true); }}>
            start
        </button>
    )
}