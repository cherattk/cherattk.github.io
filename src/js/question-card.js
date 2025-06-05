import React, { useState, useEffect } from 'react';
import { genRandomId } from './util'


export default function QuestionCard({ question, question_index, incrementAnswerCount }) {

	const [userAnswers, setUserAnswer] = useState([]);
	const [send, setSend] = useState(false);
	const [disableForm, setDisableForm] = useState(true);

	// attempt number = option.length - 2 
	const [attemptCount, setAttemptCount] = useState(0);

	// useEffect(() => {
	// 	setDisableForm(userAnswers.length == 0);
	// }, [userAnswers]);

	// useEffect(() => {
	// 	if (!send) {
	// 		setUserAnswer([]);
	// 	}
	// }, [send]);

	const verifiedAnswer = (answerIndex) => {
		if (send) {

			if (userAnswers.includes(answerIndex) && question.good_answers_index.includes(answerIndex)) {
				return "good-answer";
			}
			if (!userAnswers.includes(answerIndex) && question.good_answers_index.includes(answerIndex)) {
				// style = "missed-answer";
				return "good-answer";
			}
			if (userAnswers.includes(answerIndex) && !question.good_answers_index.includes(answerIndex)) {
				return "bad-user-answer";
			}
			if (!question.good_answers_index.includes(answerIndex)) {
				return "bad-answer";
			}
		}
	};

	const setAnswer = (event) => {
		var input = event.target;
		const inputValue = parseInt(input.value);
		if (input.checked) {
			if (!userAnswers.includes(inputValue)) {
				if (question.option_type === "single_choice") {
					setUserAnswer([inputValue]);
				}
				else {
					setUserAnswer([inputValue, ...userAnswers]);
				}
			}
		}
		else if (!input.checked) {
			setUserAnswer(userAnswers.filter(item => item !== inputValue));
		}
	}

	const submitAnswer = (event) => {
		event.preventDefault();
		if (setUserAnswer.length) {
			setSend(true);
		}
	}

	return (
		<div id={"question-" + question_index} className="border-2 border-bottom py-4">
			<div className="question-card">
				<div className="align-items-center mb-3 question-title bg-light">
					<h3 className='py-2'>{question_index}. {question.question} ?</h3>
					{/* <span className='bg-light border d-inline-block m-0 px-3 py-1 rounded float-end'>
						{question.good_answers_index.length} points
					</span> */}
				</div>

				<form name='question-form' onSubmit={submitAnswer}>
					<div className="answers-list mb-4 px-2">
						{
							Object.values(question.options).map((item, index) => {

								const _key = genRandomId(10);
								const checkBoxKey = "checkbox-" + _key;
								// const checkBoxType = question.option_type === "single_choice" ? "radio" : "checkbox";
								const checkBoxType = "checkbox";
								var answerStyle = "answer-label my-1 w-100 px-3";
								answerStyle += " " + (send ? verifiedAnswer(index) : "");
								return (
									<div key={"div-" + _key}>
										<div className="answer d-flex align-items-center">
											<input id={checkBoxKey}
												type={checkBoxType}
												name='answer-option'
												value={index}
												checked={userAnswers.includes(index)}
												onChange={setAnswer}
												disabled={send}
												className="form-check-input mt-0 me-2" />
											<label key={checkBoxKey} htmlFor={checkBoxKey}
												className={answerStyle}>
												<span className="d-block py-2 answer-text">
													{index + 1}. {item.answer}
												</span>
												{send ? item.answer_description.length > 0 ?
													<span className='d-block answer-description border-top border-white py-2 mb-2'>
														{item.answer_description}
													</span>
													: null
													: null
												}
											</label>
										</div>
										{/* {
											send ? item.answer_description.length > 0 ?
												<p className='answer-description p-3 rounded'>
													{item.answer_description}
												</p>
												: null
												: null
										} */}

									</div>
								)
							})
						}
					</div>
					<div>
						<button type="submit" className='btn btn-primary px-3'
							disabled={userAnswers.length == 0 || send}>
							Submit
						</button>
					</div>
				</form>
			</div>
		</div>
	)

}