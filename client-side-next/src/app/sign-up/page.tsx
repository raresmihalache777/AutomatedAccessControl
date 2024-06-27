'use client';

import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { FaAngleLeft } from 'react-icons/fa6';
import Image from 'next/image';

export default function SignUpPage() {
    const specialCharacterRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    const numbersRegex = /[123456789]/;

	// redirect to login page
	const router = useRouter();

	const [user, setUser] = React.useState({
		username: '',
		email: '',
		password: '',
	});

	const [buttonDisabled, setButtonDisabled] = useState(false);

	const [loading, setLoading] = useState(false);

    const [warning, setWarning] = useState('');

	const [error, setError] = useState('')

	const onSignUp = async () => {
		try {
			setLoading(true);
			const response = await axios.post('/api/users/signup', user);
			console.log('signup okay', response.data);
			router.push('/login');
		} catch (error: any) {
			setError(error.response.data['error'])
			console.log('Failed to sign up the user', error.message);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (
			user.username.length > 0 &&
			user.email.length > 0 &&
            user.email.includes('@') &&
			user.password.length > 0
		) {
			setButtonDisabled(false);
		} else {
			setButtonDisabled(true);
		}

        if(user.password.length < 8 || !specialCharacterRegex.test(user.password) || !numbersRegex.test(user.password)){
            setWarning('Password must have more than 8 characters, contain 1 number and one special character(!@#$...)')
            setButtonDisabled(true);
        }else{
            setWarning('');
            setButtonDisabled(false);
        }
	}, [user]);


	return (
		<div className="flex flex-col items-center justify-center min-h-screen py-2">
			<Image
              src="/logo_play.svg"
              width={75}
              height={75}
              alt="Logo"
            />

			<h1 className="py-10 mb-10 text-5xl">
				{loading ? 'Processing...' : 'Sign Up'}
			</h1>

			<input
				className="w-[350px] text-slate-800 p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
				id="username"
				type="text"
				value={user.username}
				onChange={(e) => setUser({ ...user, username: e.target.value })}
				placeholder="Your Username..."
			/>

			<input
				className="w-[350px] text-slate-800 p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
				id="email"
				type="text"
				value={user.email}
				onChange={(e) => setUser({ ...user, email: e.target.value })}
				placeholder="Your Email..."
			/>

			<input
				className="w-[350px] text-slate-800 p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
				id="password"
				type="password"
				value={user.password}
				onChange={(e) => setUser({ ...user, password: e.target.value })}
				placeholder="Your Password..."
			/>
			<input	
				className="w-[350px] text-slate-800 p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
				id="password"
				type="password"
				value={user.password}
				onChange={(e) => setUser({ ...user, password: e.target.value })}
				placeholder="Retype your password..."
			/>
            <p className="text-red-600">{warning}</p>
            <p className="text-red-600">{buttonDisabled ? 'Please complete all fields':''}</p>
			{error === '' ? <></> : <p className="text-red-600">{error}</p>}

			<button
                disabled={buttonDisabled}
				onClick={onSignUp}
				className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-600 uppercase px-40 py-3 mt-10 font-bold hover:bg-blue-600 hover:text-white">
				Register
			</button>

			<Link href="/login">
				<p className="mt-10">
					Do you have an account already?{' '}
					<span className="font-bold text-blue-600 ml-2 cursor-pointer underline">
						Login to your account
					</span>
				</p>
			</Link>

			<Link href="/">
				<p className="mt-8 opacity-50">
					<FaAngleLeft className="inline mr-1" /> Back to the Homepage
				</p>
			</Link>
		</div>
	);
}