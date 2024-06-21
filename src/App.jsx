import React, { useEffect, useState } from 'react';

const ITEMS_PER_PAGE = 1; // Number of articles to display per page

function App() {
  const [data, setData] = useState({ authors: [], articles: [] });
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('src/data.json'); // Fetching data from src/data.json
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const totalPages = Math.ceil(data.articles.length / ITEMS_PER_PAGE);

  const handlePreviousPage = () => {
    setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages));
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(Math.min(Math.max(pageNumber, 1), totalPages));
  };

  // Calculate paginated articles for the current page
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedArticles = data.articles.slice(startIndex, endIndex);

  return (
    <div className="App">
      <div className="authors-articles">
        {paginatedArticles.map(article => {
          // Find the author for the current article
          const author = data.authors.find(author => author.id === article.author_id);

          return (
            <div key={article.id} className="article">
              <div className="overlay">
                <img src={article.image_url} alt={article.title} />
                <div className="created-at">
                  <p className="text">
                    {new Date(article.created_at).toLocaleDateString('en-US', {
                      month: 'short', // Short month name, e.g., "Jan"
                      day: 'numeric'  // Numeric day, e.g., "13"
                    })}
                  </p>
                </div>
              </div>
              <div className="button">
                <button className="btn"><i className="fa fa-share"></i> Share</button>
              </div>
              <hr />
              <div className="card-img-overlay">
                <h3 className="text">{author ? author.name : 'Unknown Author'}</h3>
                <h1 className="card-title">{article.title}</h1>
                <p className="card-text">{article.body}</p>
                <a href="#" className="read-article">READ ARTICLE</a>
              </div>
            </div>
          );
        })}
      </div>
      <div className="pagination">
        <button onClick={handlePreviousPage} disabled={currentPage === 1} className="pagination-button">
          &lt;
        </button>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageClick(index + 1)}
            className={`pagination-button ${currentPage === index + 1 ? 'active' : ''}`}
          >
            {index + 1}
          </button>
        ))}
        <button onClick={handleNextPage} disabled={currentPage === totalPages} className="pagination-button">
          &gt;
        </button>
      </div>
    </div>
  );
}

export default App;
