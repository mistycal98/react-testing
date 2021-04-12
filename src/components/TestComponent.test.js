import React from "react";
import { render, waitFor, screen, cleanup } from "@testing-library/react";
import TestComponent from "./TestComponent";
import { rest } from "msw";
import { setupServer } from "msw/node";
import axios from "axios";
import mockAdapter from "axios-mock-adapter";

const url = "/greetings";

//? Using Axios Mock Adapter

// let mock = new mockAdapter(axios, { onNoMatch: "throwException" });

// beforeAll(() => mock.reset());
// afterEach(() => cleanup());

// describe("Testing Component with Axios Mock Adapter", () => {
// 	it("Fetch and Display Compoent", async () => {
// 		mock.onGet(url).reply(200, () => [{ id: "1", name: "Tushar Mistry" }]);
// 		render(<TestComponent url={url} />);
// 		expect(screen.getByTestId("loading")).toHaveTextContent("Loading ....");

// 		await waitFor(() => screen.getByTestId("resolved"));
// 		expect(screen.getByTestId("resolved")).toHaveTextContent("Tushar Mistry");
// 		// await waitFor(() => screen.getByTestId("error"));
// 		// expect(screen.getByTestId("error")).toHaveTextContent("Something Went Wrong");
// 	});
// 	it("handle Failures using handle mock adapter", async () => {
// 		mock.onGet(url).networkError();
// 		render(<TestComponent url={url} />);
// 		expect(screen.getByTestId("loading")).toHaveTextContent("Loading ....");

// 		await waitFor(() => screen.getByTestId("error"));
// 		expect(screen.getByTestId("error")).toHaveTextContent("Something Went Wrong");
// 	});
// });

//? Using Mock Service Workers
const server = setupServer(
	rest.get(url, (req, res, ctx) => {
		return res(ctx.json([{ id: 1, name: "Tushar Mistry" }]));
	})
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("Testing TestCompoent with Mock Service Workers", () => {
	it("Fetch and Display Compoent", async () => {
		const { getByTestId } = render(<TestComponent url={url} />);
		expect(getByTestId("loading")).toHaveTextContent("Loading ....");

		await waitFor(() => getByTestId("resolved"));

		expect(screen.getByTestId("resolved")).toHaveTextContent("Tushar Mistry");
	});

	it("handle Failure with Mock Service Workers", async () => {
		server.use(
			rest.get(url, (req, res, ctx) => {
				return res(ctx.status(404));
			})
		);
		const { getByTestId } = render(<TestComponent url={url} />);
		await waitFor(() => screen.getByTestId("error"));

		expect(getByTestId("error")).toHaveTextContent("Something Went Wrong");
	});
});
