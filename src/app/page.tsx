"use client";

import { randomInt } from "crypto";
import { useState, useRef } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), {
	ssr: false,
});

const createNode = (linkTo: string[], linkFrom: string[]) => {
	let node = [];
	let links: { source: string; target: string }[] = [];

	const number = Math.round(Math.random() * 1000).toString(10);

	const id = "id".concat(number);
	const name = "name".concat(number);
	const val = Math.round(Math.random() * 10)

	node.push({
		id: id,
		name: name,
		val: val,
	});
	linkTo.forEach((targetId) =>
		links.push({
			source: id,
			target: targetId,
		})
	);
	linkFrom.forEach((sourceId) =>
		links.push({
			source: sourceId,
			target: id,
		})
	);
	console.log(`node: ${JSON.stringify(node)}`)
	console.log(`links: ${JSON.stringify(links)}`);


	return { node, links };
};

const myData = {
	nodes: [
		{
			id: "id1",
			name: "name1",
			val: 1,
		},
		{
			id: "id2",
			name: "name2",
			val: 10,
		},
	],
	links: [
		{
			source: "id1",
			target: "id2",
		},
	],
};

export default function Home() {
	const [data, setData] = useState(myData);
	let graphContainer = useRef<HTMLDivElement>(null)

	const addNode = () => {
		const linkTo: string[] = []
		const linkFrom: string[] = []
		data.nodes.forEach(node => {
			if (Math.random() > 0.5){
				return linkTo.push(node.id)
			}
			return linkFrom.push(node.id)
		})
		const { node, links } = createNode(linkTo, linkFrom);
		setData((oldData) => {
			return {
				nodes: [...oldData.nodes, ...node],
				links: [...oldData.links, ...links]
			};
		});
		console.log(data)
	};

	return (
		<div className="flex flex-col max-h-screen max-w-screen outline h-screen w-screen">
			<div className="flex flex-col items-center justify-center h-full max-h-full">
				<div className="flex-none max-h-full">
					<button className="bg-blue-500 px-4 py-2" onClick={addNode}>Click Me!</button>
				</div>
				<div
					className="grow basis-0 flex-col w-full max-w-full min-h-0 max-h-full"
					ref={graphContainer}
				>
					<ForceGraph2D
						graphData={data}
						height={graphContainer.current?.clientHeight}
					/>
				</div>
			</div>
		</div>
	);
}
