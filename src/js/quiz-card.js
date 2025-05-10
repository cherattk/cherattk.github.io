import React from 'react';
import { Link } from 'react-router-dom';

export default function QuizCard ({ quizMetadata }) {

  let level = parseInt(quizMetadata.level);

  return (
    <div className="col mb-4" key={"subject-" + quizMetadata.id}>
      <div className="subject-card card shadow-sm">
        <Link to={`/quiz/${quizMetadata.id}`} className="text-decoration-none">
          <div className="card-body text-dark">
            <h5 className="card-title text-dark p-3 m-0">
              {quizMetadata.categorie}
               <span className={"badge p-2 float-end " + "question-level-" + quizMetadata.level}
                style={{"fontSize":"0.7rem"}}>
                {level == 1 ? "Beginner" :
                  level == 2 ? "Intermediate" : "Advanced"
                }
              </span>
            </h5>
            <p className="card-text p-3 fw-bold text-dark" style={{"fontSize":"1rem"}}>{quizMetadata.description}</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
