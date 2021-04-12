import React, { useEffect, useState } from "react";
import axios from "axios";

const TestComponent = ({ url }) => {
	const [data, setData] = useState([]);
	const [hasError, setError] = useState();

	const getDataAxios = async () => {
		try {
			const { data } = await axios.get(url);
			// console.log(data);
			setData([...data]);
		} catch (error) {
			setError(error.message);
			console.warn(error.message);
		}
	};

	const getDataFetch = async () => {
		try {
			const result = await fetch(url);
			const ctx = await result.json();
			// console.log(ctx);
			setData([...ctx]);
		} catch (error) {
			setError(error);
			console.warn(error);
		}
	};

	useEffect(() => {
		getDataAxios();
		// getDataFetch();
		return () => {
			// console.log("cleanup");
		};
	}, []);

	if (hasError) {
		return <p data-testid="error">Something Went Wrong</p>;
	} else if (data) {
		return (
			<div data-testid="resolved">
				{data.map((user) => (
					<p key={user.id}>{user.name}</p>
				))}
			</div>
		);
	}
	return <p data-testid="loading">Loading ....</p>;
};

export default TestComponent;
