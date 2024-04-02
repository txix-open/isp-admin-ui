import {useNavigate} from "react-router-dom";

function LoginPage() {
    const navigate = useNavigate();

    return (
        <div className='login-page'>
            <button onClick={() => {
                const url = localStorage.getItem('redirectUrl')
                if (url) {
                    navigate(url)
                    localStorage.removeItem('redirectUrl')
                }
            }}>Зарегистрироваться
            </button>
        </div>
    );
}

export default LoginPage;