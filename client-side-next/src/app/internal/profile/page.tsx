'use client'

import { useUserContext } from "@/app/context/userContext";

export default function ProfilePage(){

	const userState = useUserContext();

    return (
		<div className="mx-5">
			<h1 className="text-green-600 text-5xl text-center py-10">
				Hello, {userState.username}
			</h1>
		</div>
	);
}