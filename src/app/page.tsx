"use client"

import dynamic from "next/dynamic";
import Image from "next/image";
const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), {ssr: false})

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
	return (
		<div className="flex flex-col items-center justify-center">
			<ForceGraph2D graphData={myData} />
		</div>
	);
}
