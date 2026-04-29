import Header from '../home/Header.jsx';
import { Link } from "react-router-dom";
import "./GradeCalc.css"

import React, { useState } from "react";
import TextInputComponent from '../signup/TextInputComponent.jsx';
function GradeCalc() {
	const [rows, setRows] = useState([
		{ weight:1.00, score: 0,total:0, text:"" }
	]);
	const [letter, setLetter] = useState("A");
	const [overallPercent, setOverallPercent] = useState(1.00);

	function onChange(){


		let overallpercent = 0;

		const uniqueWeights = [
			...new Set(rows.map(row => Number(row.weight)))
		];

		const totalUniqueWeights = uniqueWeights.reduce((sum, weight) => sum + weight,0
		);

		uniqueWeights.forEach(weight => {
			const matchingRows = rows.filter(row => Number(row.weight) === weight);

			const totalScore = matchingRows.reduce((sum, row) => sum + Number(row.score),0);

			const totalTotal = matchingRows.reduce((sum, row) => sum + Number(row.total),0
			);

			const categoryPercent = totalScore / totalTotal;

			overallpercent += categoryPercent * (weight / totalUniqueWeights);
		});

		setOverallPercent(
		(overallpercent * 100).toFixed(2)
		);

	}


	return( 
		<>
			<ul style={{margin: 0, padding: 0, gap: 10, flex:1, flexDirection: "column", alignItems: "center"}}>
						<li>
							<Header />

						</li>
						<li>
							<Link to="/GradeCalc"
								style={{}}
							>
									<div style={{  }}>
										<h1
											style={{
												textAlign: "center",
												fontSize: "18px",
												fontWeight: "bold"
											}}
										>
											GradeCalc
										</h1>
										<hr></hr>
									</div>
							</Link>
						</li>
					
					</ul>
					<div
					style={{
						margin: "0 auto",
						marginTop: "10%",
						width: "100%",
						display: "flex",
						justifyContent: "center",
						flexDirection: "column",
					}}	
					>
						<p
						style={{
							fontSize:100,
							textAlign: "center",
							height:"1px" 
						
						}}
						>
							{letter}
						</p>
						<p
						style={{
							fontSize:50,
							textAlign: "center",
							height:"1px" 
						
						}}
						>
							{overallPercent + "%"}
						</p>

					</div>
					<div className="horizontalDiv"
					style={{
						margin: "0 auto",
						marginTop: "10%",
						width: "100%"
					}}	
					>
						<div
							style={{
								width: "100%",
								display: "flex",
								justifyContent: "center",
								flexDirection: "column",
							}}
						>
							<div
							style={{
								width: "100%",
								display: "flex",
								justifyContent: "flex-end"
							}}
							>
								<button
									onClick={() => {
										setRows([
											...rows,
											{ weight: 1.00, score: 0, total: 0, text: "" }
										]);
									}}
									style={{
										alignSelf: "flex-end",
										background: "transparent",
										border: "none",
										cursor: "pointer",
										fontSize: "20px",
										fontWeight:  "bold"
									}}
								>
								+
								</button>
								<button
									onClick={() => {
									setRows(
										rows.filter(row =>
										row.weight !== 1.00 ||
										row.score !== 0 ||
										row.text !== "" ||
										row.total == 0
										)
									);
									}}
									style={{
										alignSelf: "flex-end",
										background: "transparent",
										border: "none",
										cursor: "pointer",
										fontSize: "20px",
										fontWeight:  "bold"
									}}
								>
								×
								</button>
							</div>
							
							
							<table border="1"
								style={{
									flex:1,

								}}
							>
								<thead>
									<tr>
										<th>Weight</th>
										<th>Score</th>
										<th>Description</th>

									</tr>
								</thead>

								<tbody>
									{rows.map((row, i) => (
										<tr key={i}>
											<td>
												<input
													type="text"
													value={row.weight}
													onChange={(e) => {
														const copy = [...rows];
														copy[i].weight = e.target.value;
														setRows(copy);
														onChange();
													}}
													onKeyDown={(e) => {
														if (
															!/[0-9/.]/.test(e.key) &&
															!["Backspace","Delete","ArrowLeft","ArrowRight","Tab"].includes(e.key)
														) {
														e.preventDefault();
														}
													}}
													style={{
														margin: 0,
														width: "100%",
														padding:"0px",
														boxSizing:"border-box",
														display:"block",
														border: row.valid ? "2px solid red" : "1px solid gray"
													}}	
												/>
											</td>

											<td>
												<div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
													<input
													type="text"
													value={row.score}
													onChange={(e) => {
														const copy = [...rows];
														copy[i].score = e.target.value;
														setRows(copy);
														onChange();
													}}
													onKeyDown={(e) => {
														if (
															!/[0-9/.]/.test(e.key) &&
															!["Backspace","Delete","ArrowLeft","ArrowRight","Tab"].includes(e.key)
														) {
														e.preventDefault();
														}
													}}
													style={{ width: "50%" }}
													/>

													<span>/</span>

													<input
													type="text"
													value={row.total}
													onChange={(e) => {
														const copy = [...rows];
														copy[i].total = e.target.value;
														setRows(copy);
														onChange();
													}}
													onKeyDown={(e) => {
														if (
															!/[0-9/.]/.test(e.key) &&
															!["Backspace","Delete","ArrowLeft","ArrowRight","Tab"].includes(e.key)
														) {
														e.preventDefault();
														}
													}}
													style={{ width: "50%" }}
													/>
												</div>
											</td>
											<td>
												<input
													type="text"
													value={row.text}
													onKeyDown={(e) => {
														if (
															!/[0-9/.]/.test(e.key) &&
															!["Backspace","Delete","ArrowLeft","ArrowRight","Tab"].includes(e.key)
														) {
														e.	preventDefault();
														}
													}}
													onChange={(e) => {
														const copy = [...rows];
														copy[i].text = e.target.value ;
														setRows(copy);
														onChange();
													}}
													style={{
														margin: 0,
														width: "100%",
														padding:"0px",
														boxSizing:"border-box",
														display:"block",
														border: row.valid ? "2px solid red" : "1px solid gray"
													}}	
												/>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
						
					</div>
		</>
	)
}

export default GradeCalc
