import React from 'react';
import { Link } from 'react-router-dom';

export default function QuizSideList({ questions , quizId}) {

	return (
		<div className='list-group list-group-flush'>
			<Link to={`/`} className="border-bottom text-center py-2 text-decoration-none">
				<i className="bi bi-arrow-left me-3"></i>Back
				<h1 className='fs-4'>				
				10/Quest
				</h1>
			</Link>
			{
				questions.map((item, index) => {
					return (
						<Link key={"hash-quest-"+index} to={`/quiz/${quizId}#question-` + (index + 1)} 
									className='list-group-item list-group-item-action text-center'>
							 <span>Question</span>
							 <i className='badge text-bg-light border ms-3'>{index + 1}</i>
						</Link>
					)
				})
			}
		</div>
	)

}