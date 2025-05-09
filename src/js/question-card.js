import React , { useState, useEffect } from 'react';
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
		var style = "";
		if (send) {

			if (userAnswers.includes(answerIndex) && question.good_answers_index.includes(answerIndex)) {
				style = "good-answer";
			}
			if (!userAnswers.includes(answerIndex) && question.good_answers_index.includes(answerIndex)) {
				style = "missed-answer";
			}
			if (userAnswers.includes(answerIndex) && !question.good_answers_index.includes(answerIndex)) {
				style = "bad-answer";
			}
		}
		return style;
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
		if(setUserAnswer.length){
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
					<div className="answers-list mb-4">
						{
							Object.values(question.options).map((item, index) => {

								const _key = genRandomId(10);
								const checkBoxKey = "checkbox-" + _key;
								// const checkBoxType = question.option_type === "single_choice" ? "radio" : "checkbox";
								const checkBoxType = "checkbox";
								var answerStyle = "answer-label my-1 w-100 p-2";
								answerStyle += " " + (send ? verifiedAnswer(index) : "");
								return (
									<div className="answer d-flex align-items-center" key={"div-" + _key}>
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
											<span className="answer-text">{index + 1}. {item}</span>
										</label>
									</div>
								)
							})
						}
					</div>
					<div>
						<button type="submit" className='btn btn-primary rounded-pill px-3'
							disabled={userAnswers.length == 0 || send}>
							Submit
						</button>
					</div>
				</form>
			</div>
		</div>
	)

}