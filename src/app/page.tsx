"use client";

import { randomInt } from "crypto";
import { useState, useRef, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import dictionary from "./dictionary.json";
import { ForceGraphMethods } from "react-force-graph-2d";

type node = {
	id: string;
	name: string;
	val: number;
};

type link = {
	source: string;
	target: string;
};

const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), {
	ssr: false,
});

const typedDict = dictionary as { [word: string]: string };

const createLinks = (id: string, linkTo?: string[], linkFrom?: string[]) => {
	let links: { source: string; target: string }[] = [];

	linkTo?.forEach((targetId) =>
		links.push({
			source: "id".concat(id),
			target: "id".concat(targetId),
		})
	);
	linkFrom?.forEach((sourceId) =>
		links.push({
			source: "id".concat(sourceId),
			target: "id".concat(id),
		})
	);
	return links;
};

const createWordNode = (word: string) => {
	return {
		id: "id".concat(word),
		name: word,
		val: 1,
	};
};

export default function Home() {
	const [data, setData] = useState<{ nodes: node[]; links: link[] }>({
		nodes: [],
		links: [],
	});
	let graphContainer = useRef<HTMLDivElement>(null);
	let wordList = useRef(Object.keys(dictionary));
	const addedWords = useRef(new Set());
	const graphRef = useRef<ForceGraphMethods>()

	const addLinks = (links: link[]) => {
		setData((oldData) => {
			const updatedNodes = oldData.nodes;
			const newLinks = [...oldData.links];
			links.forEach((link) => {
				// console.log(`trying to add link: ${JSON.stringify(link)}`);
				const nodeIndex = updatedNodes.findIndex(
					(node) => node.id === link.target
				);
				if (nodeIndex > -1) {
					updatedNodes[nodeIndex].val += 1;
					newLinks.push(link);
				} else {
					// console.log(`Couldn't find ${link.target} node`);
				}
				return;
			});
			// console.log(`updatedNodes: ${JSON.stringify(updatedNodes)}`);
			// console.log(`links: ${JSON.stringify(newLinks)}`);
			return {
				nodes: [...updatedNodes],
				links: [...newLinks],
			};
		});
	};
	const addWord = useCallback(() => {
		const word = wordList.current.pop()
		if (word === undefined) {
			return;
		}
		const wordsToAdd: node[] = [];
		const linksToAdd: link[] = [];
		if (!addedWords.current.has(word.toLowerCase())) {
			// console.log(`adding ${word.toLowerCase()}`);
			wordsToAdd.push(createWordNode(word.toLowerCase()));
			addedWords.current.add(word.toLowerCase());
		}
		const wordDescription = typedDict[word]
			.replaceAll(/[^a-zA-Z ]+/g, "")
			.toLowerCase()
			.split(" ");
		wordDescription.forEach((descriptionWord) => {
			if (!addedWords.current.has(descriptionWord)) {
				const newNode = createWordNode(descriptionWord);
				wordsToAdd.push(newNode);
				addedWords.current.add(descriptionWord);
			}
			const newLinks = createLinks(word.toLowerCase(), [descriptionWord]);
			linksToAdd.push(...newLinks);
		});
		addNodes(wordsToAdd);
		addLinks(linksToAdd);
	}, []);
	useEffect(() => {
		const interval = setInterval(() => {
			addWord();
		}, 500);
		return () => {
			clearInterval(interval);
		}
	}, []);

	const addNodes = (nodes: node[]) => {
		setData((oldData) => {
			const newNodes = [...oldData.nodes, ...nodes];
			// console.log(`new node list: ${JSON.stringify(newNodes)}`);
			return {
				...oldData,
				nodes: newNodes,
			};
		});
	};
	return (
		<div className="flex flex-col max-h-screen max-w-screen outline h-screen w-screen">
			<div className="flex flex-col items-center justify-center h-full max-h-full">
				<div className="flex-none max-h-full">
					<button
						className="bg-blue-500 px-4 py-2"
						onClick={() => addWord()}
					>
						Click Me!
					</button>
					<p className="text-lg">
						Words added so far {addedWords.current.size}
					</p>
				</div>
				<div
					className="grow basis-0 flex-col w-full max-w-full min-h-0 max-h-full"
					ref={graphContainer}
				>
					<ForceGraph2D
						graphData={data}
						height={graphContainer.current?.clientHeight}
						nodeAutoColorBy={"val"}
						// linkDirectionalParticles={1}
						// linkDirectionalParticleSpeed={0.003}
						// linkDirectionalParticleColor={() => "white"}
						linkAutoColorBy={"white"}
						// backgroundColor={"black"}
						nodeLabel={"name"}
						cooldownTicks={100}
						d3AlphaDecay={0}
						d3VelocityDecay={0}
					/>
				</div>
			</div>
		</div>
	);
}
