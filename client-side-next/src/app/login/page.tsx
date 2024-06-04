'use client';

import Link from 'next/link';
import React, {useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { FaAngleLeft } from 'react-icons/fa6';
import { useAppContext } from '../context/appContext';
import Image from 'next/image'


export default function LoginPage() {
	const router = useRouter();
	const appContext = useAppContext();

	const [user, setUser] = React.useState({
		email: '',
		password: '',
	});

	const [buttonDisabled, setButtonDisabled] = useState(false);

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	const onLogin = async () => {
		try {
			console.log('login clicked')
			appContext.toggleLoadingState(true)
			const response = await axios.post('api/users/login', user);
			console.log('Login successful', response.data);	
			

			if(response.data.type === 'u'){
				router.push('internal/profile');
			}else if(response.data.type === 'a'){
				router.push('/admin/dashboard');
			}else{
				router.push('/login');
			}
			appContext.toggleLoadingState(false)
		} catch (error: any) {
			setError(error.response.data['error'])
			console.log('Login failed:', error.message);
		} finally {
			appContext.toggleLoadingState(false);
		}
	};

	useEffect(() => {
		if (
			user.email.length > 0 &&
            user.email.includes('@') &&
			user.password.length > 0
		){
			setButtonDisabled(false);
		} else {
			setButtonDisabled(true);
		}
	}, [user]);


	return (
		<div className="flex flex-col items-center justify-center min-h-screen">

			<Image
              src="/logo_play.svg"
              width={75}
              height={75}
              alt="Logo"
            />

			<h1 className="py-10 mb-10 text-5xl">
				{loading ? "We're logging you in..." : 'Account Login'}
			</h1>

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
			{error === '' ? <></> : <p className="text-red-600">{error}</p>}
			<button
				onClick={onLogin}
				className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-600 uppercase px-40 py-3 mt-10 font-bold hover:bg-blue-600 hover:text-white">
				Login
			</button>

			<Link href="/sign-up">
				<p className="mt-10">
					Do not have an account yet?
					<span className="font-bold text-blue-600 ml-2 cursor-pointer hover:underline hover:text-blue-700">
						Register your free account now
					</span>
				</p>
			</Link>

			<Link href="/">
				<p className="mt-8 opacity-50 hover:underline hover:opacity-100">
					<FaAngleLeft className="inline mr-1" /> Back to the Homepage
				</p>
			</Link>
		</div>
	);
}