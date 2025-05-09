import React from 'react';
import { Link } from 'react-router-dom';

export default function QuizCard ({ quizMetadata }) {

  let level = parseInt(quizMetadata.level);

  return (
    <div className="col mb-4" key={"subject-" + quizMetadata.id}>
      <div className="subject-card card shadow-sm">
        <Link to={`/quiz/${quizMetadata.id}`} className="text-decoration-none">
          <div className="card-body text-dark text-center">
            <h5 className="card-title text-dark py-3 bg-light">{quizMetadata.categorie}</h5>
            <p className="card-text mb-4">{quizMetadata.description}</p>
            <div className="d-flex justify-content-between">
              <span className={"px-3 py-1 rounded " + "question-level-" + quizMetadata.level}>
                {level == 1 ? "Beginner" :
                  level == 2 ? "Intermediate" : "Advanced"
                }
              </span>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
