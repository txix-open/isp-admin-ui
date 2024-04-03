import {useNavigate} from 'react-router-dom';

const LoginPage = () => {
    const navigate = useNavigate();

    return (
        <main className="login-page">
            <button onClick={() => {
                const url = localStorage.getItem("redirectUrl")
                if (url) {
                    navigate(url)
                    localStorage.removeItem("redirectUrl")
                }
            }}>Зарегистрироваться
            </button>
        </main>
    );
}

export default LoginPage;
