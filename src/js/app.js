import React, { useState, useEffect, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Quiz from './quiz';
import QuizCard from './quiz-card';

const App = () => {
  const [quizMetadata, setQuizMetadata] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatQuizMetadata = (dataList) => {
    let quizCardList = dataList.map((item, index) => {
      item.metadata.id = index + 1;
      return item.metadata;
    });
    return quizCardList;
  }


  const fetchData = async () => {
    try {
      const response = await fetch('/data/data.json');
      if (!response.ok) {
        throw new Error(`Failed to fetch data.json: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      /**
       * Check if each item conforms to quizSchema : @see data-schema.js
       */
      if (Array.isArray(data)) {
        const validDataSchema = data.every(item =>
          typeof item.metadata.id === 'number' &&
          typeof item.metadata.categorie === 'string' &&
          typeof item.metadata.description === 'string'
        );

        if (validDataSchema) {
          localStorage.setItem('data', JSON.stringify(data));
          setQuizMetadata(formatQuizMetadata(data));
        } else {
          setError("Error: Data from data.json does not match the quizSchema .");
        }

      } else {
        setError("Error: Data from data.json is not an array.");
      }
    } catch (err) {
      setError(`Error loading data.json: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (quizMetadata) {
      setLoading(false);
    }
  }, [quizMetadata]);

  useEffect(() => {
    fetchData();
    // let storedData = localStorage.getItem('data');
    // if (!storedData) {
    //   // check data.metadata.date
    //   fetchData();
    // }
    // else{
    //   setQuizMetadata(formatQuizMetadata(JSON.parse(storedData)));
    // }
  }, []);

  const Home = () => {
    return (
      <>
        <main className='home-main'>
          <section className="py-5 text-center container">
            <div className="row">
              <div className="mx-auto">
                <h1 className="text-primary">
                  {/* <i className='bi bi-rocket text-danger me-3'></i> */}
                  10 Questions Brain Booster
                  <i className='bi bi-rocket text-danger ms-3'></i>
                </h1>
              </div>
            </div>
          </section>
          <div className="py-5">
            <div className="container">
              <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3">
                {
                  quizMetadata.map((item, index) => {
                    return (<QuizCard key={"sub-c" + index} quizMetadata={item} />)
                  })
                }
              </div>
            </div>
          </div>
        </main>
        <footer className="text-body-secondary py-5">
          <div className="container">
          </div>
        </footer>
      </>
    )
  }

  if (loading) {
    return <div>Loading subjects...</div>;
  }

  if (error) {
    return <div>Error : {error}</div>;
  }

  return (
    <>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quiz/:quizId" element={<Quiz />} />
        </Routes>
      </HashRouter>

    </>
  );
};

const RootApp = createRoot(document.getElementById('app'));
RootApp.render(process.env.NODE_ENV === 'development' ? (
  <React.StrictMode>
    <App />
  </React.StrictMode>
) : (
  <App />
));
