import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login() {
    const [isRegistering, setIsRegistering] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { loginEmail, registerEmail, loginGoogle } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isRegistering) {
                await registerEmail(email, password);
                toast.success("Account created!");
            } else {
                await loginEmail(email, password);
                toast.success("Welcome back!");
            }
            navigate('/');
        } catch (err) {
            toast.error(err.message);
        }
    };

    const handleGoogle = async () => {
        try {
            await loginGoogle();
            toast.success("Welcome!");
            navigate('/');
        } catch (err) {
            toast.error("Google Login Failed");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[80vh]">
            <div className="card w-full max-w-md !p-10">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-tr from-cyan-500 to-purple-600 rounded-full mx-auto mb-4 animate-pulse flex items-center justify-center">
                        <LogIn className="text-white" size={32} />
                    </div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
                        {isRegistering ? 'Join Pulse' : 'Welcome Back'}
                    </h1>
                    <p className="text-slate-400 mt-2">Sign in to sync your portfolio</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">Email</label>
                        <input
                            type="email"
                            required
                            className="input-glass"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">Password</label>
                        <input
                            type="password"
                            required
                            className="input-glass"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="btn-neon w-full mt-4">
                        {isRegistering ? 'Sign Up' : 'Login'}
                    </button>
                </form>

                <div className="relative my-8 text-center">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-700"></div></div>
                    <span className="relative bg-slate-900 px-4 text-sm text-slate-500">OR</span>
                </div>

                <button
                    onClick={handleGoogle}
                    className="w-full bg-white text-slate-900 font-bold py-3 rounded-xl hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                >
                    <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="G" />
                    Continue with Google
                </button>

                <p className="mt-8 text-center text-slate-400 text-sm">
                    {isRegistering ? "Already have an account?" : "Don't have an account?"}
                    <button
                        onClick={() => setIsRegistering(!isRegistering)}
                        className="text-cyan-400 ml-2 hover:underline"
                    >
                        {isRegistering ? 'Login' : 'Details'}
                    </button>
                </p>
            </div>
        </div>
    );
}
