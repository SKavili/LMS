import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../Services/postApiServices';
import logo from '../assets/logo.svg';
const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const userData = { email, password }; // Create a JSON object with email and password
            const response = await loginUser(userData);
            const data = await response.json();
            localStorage.clear();
            if (response.ok) {
                localStorage.setItem('userData', JSON.stringify(data));
                localStorage.setItem('auth', data.token)
                // Redirect to Create User page
                switch (data.role_id) {
                    case 1:
                        navigate('/UserCreation');
                        break;
                    case 2:
                        navigate('/Material');
                        break;
                    case 3:
                        navigate('/ViewMaterials');
                        break;
                    default:
                        console.error('Invalid role:', data.role);
                        // Handle invalid role
                        break;
                }
            } else {
                alert('User Credentials Are Incorrect')
                console.error('Login failed:', data.message);
                // Handle login failure (e.g., show error message)
            }
        } catch (error) {
            console.error('Error during login:', error);
        }
    };

    return (
        <body className="login_bg">
        <main>
    <div class="container">
    <section class="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
        <div className="container">
        <div class="row justify-content-center">
        <div class="col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center">
     <div className="d-flex justify-content-center py-4">
                                    <a className="logo d-flex align-items-center w-auto">
                                    <img src={logo} alt="maven" /> <span className="d-none d-lg-block"> LMS</span>
                                    </a>
                                </div>
              <div class="card mb-3">

<div class="card-body">
<div class="pt-4 pb-2">
                    <h5 class="card-title text-center pb-0 fs-4">Login to Your Account</h5>
                    <p class="text-center small">Enter your username & password to login</p>
                  </div>
            <form  class="row g-3 needs-validation" onSubmit={handleSubmit}>
            <div class="col-12">
                    <label class="form-label" htmlFor="email">Email:</label>
                    <div class="input-group has-validation">
                    <span class="input-group-text" id="inputGroupPrepend">@</span>
                    <input class="form-control"
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    </div>
                </div>
                <div class="col-12">
                    <label class="form-label" htmlFor="password">Password:</label>
                    <input class="form-control" 
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" class="btn btn-primary w-100">Login</button>
            </form>
            </div>
            </div>

            </div>
    </div>
        </div>
</section>
        </div>
        </main>
        </body>
    );
};

export default Login;
