import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
//
import QuestionCard from './question-card';

export default function Quiz() {

	const { quizId } = useParams();
	// const location = useLocation();
	const [quiz, setQuiz] = useState({ title: "", questions: [] });
	const [answerCount, setAnswerCount] = useState(0);

	const incrementAnswerCount = () => {
		setAnswerCount(prevCount => prevCount + 1);
	}

	// to navigate with side-panel
	// useEffect(() => {
	// 	if (location.hash) {
	// 		const element = document.querySelector(location.hash);
	// 		if (element) {
	// 			element.scrollIntoView({ behavior: 'auto' }); // or 'auto' for instant scroll
	// 		}
	// 	}
	// }, [location]);

	useEffect(() => {
		let data = localStorage.getItem('data');
		let dataList = JSON.parse(data);
		// get quiz by index
		setQuiz({
			title: dataList[quizId - 1].metadata.title,
			level: dataList[quizId - 1].metadata.level,
			questions: dataList[quizId - 1].questions
		});
		console.log('Component mounting');
		// Cleanup function (optional)
		return () => {
			console.log('Component unmounting');
		};
	}, []); //

	const renderListCard = () => {
		let list = quiz.questions.map((item, index) => {
			return (
				<QuestionCard
					key={"quest-card-" + index}
					question={item}
					question_index={index + 1}
					incrementAnswerCount={incrementAnswerCount} />
			)
		});
		return (
			<>
				{list}
			</>
		)
	}

	if (quiz.questions.length === 0) {
		return <div>No Quiz found.  Please ensure data.json exists and contains data.</div>;
	}

	// ScrollToTop component to handle scrolling
	const ScrollToTop = () => {
		const { pathname } = useLocation();

		useEffect(() => {
			window.scrollTo(0, 0);
		}, [pathname]);
		return null; // This component doesn't render anything
	};

	return (

		<>
			<div className='px-3 py-4 py-lg-0'>
				<div className='quiz-page bg-white mx-auto p-3 rounded border'>
					<h1 className="bg-light m-0 px-4 py-3 quiz-title fs-4">
						{quiz.title}
						<span className={"badge p-2 float-end " + "question-level-" + quiz.level}>
							{quiz.level == 1 ? "Beginner" :
								quiz.level == 2 ? "Intermediate" : "Advanced"
							}
						</span>
					</h1>
					<div className='quest-list'>
						{renderListCard()}
					</div>
				</div>
			</div>

			<ScrollToTop /> {/* Include ScrollToTop here */}

			{/* 
		<div className='d-flex h-100'>
			<div className='left-panel border-end overflow-auto p-2'>
				<QuizSideList questions={quiz.questions} quizId={quizId} />
			</div>
			<div className='main-panel overflow-auto h-100 w-100 py-4'>
				<div className='quiz-page bg-white mx-auto p-3 rounded border'>
					<h1 className="bg-light m-0 px-4 py-3 quiz-title fs-4">
						{quiz.title}
					</h1>
					<div className='quest-list px-4'>
						{renderListCard()}
					</div>
				</div>
			</div>
		</div>
		 */}
		</>

	);
}

